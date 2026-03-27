import React, { PureComponent } from 'react';

import DirectoryPicker from './settings/DirectoryPicker';
import ResourceScanner, { PLUGIN_NAME, CONFIG_KEY } from './ResourceScanner';
import FieldInterceptor from './FieldInterceptor';

const SETTINGS_ID = 'resourceSuggest';
const SETTINGS_KEY_DIRECTORY = `${SETTINGS_ID}.scanDirectory`;

export default class ResourceSuggestPlugin extends PureComponent {

  constructor(props) {
    super(props);

    const { subscribe, settings, config, _getGlobal } = props;

    this._config = config;
    this._settings = settings;
    this._scanner = new ResourceScanner();
    this._currentDirectory = null;
    this._interceptor = null;
    this._useTextFallback = false;
    this.resources = [];
    this._lastResourceHash = '';

    // Defer settings registration so the DOM is available for version detection.
    // The settings dialog is opened manually by the user, so this is safe.
    // We pre-load the saved directory to use as the default value for the text field.
    this._config.getForPlugin(PLUGIN_NAME, CONFIG_KEY).then((savedDir) => {
      setTimeout(() => this._registerSettings(_getGlobal, config, settings, savedDir || ''), 0);
    });

    // Listen for scan results from the menu.js backend (main process).
    subscribe('resource-suggest.files', ({ directory, items }) => {
      console.log('[ResourceSuggest] received backend scan', 'directory:', directory, 'items:', items?.length);

      if (directory && items) {
        this._currentDirectory = directory;
        this._scanner.setScanRoot(directory);
        this._processItems(items);
      }
    });

    this._loadSavedDirectory();

    this._currentContainer = null;

    subscribe('app.activeTabChanged', ({ activeTab }) => {
      if (activeTab?.type !== 'bpmn') {
        this._detachInterceptor();
      }
    });

    this._startContainerWatcher();
  }

  componentWillUnmount() {
    this._detachInterceptor();

    if (this._containerWatcher) {
      this._containerWatcher.disconnect();
    }

    clearTimeout(this._containerCheckDebounce);
  }

  _startContainerWatcher() {
    this._containerCheckDebounce = null;

    this._containerWatcher = new MutationObserver(() => {
      clearTimeout(this._containerCheckDebounce);
      this._containerCheckDebounce = setTimeout(() => {
        this._checkContainer();
      }, 200);
    });

    this._containerWatcher.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  _checkContainer() {
    const container = document.querySelector('.properties-container');

    if (container && container !== this._currentContainer) {
      this._detachInterceptor();
      this._attachInterceptor(container);
    } else if (!container && this._currentContainer) {
      this._detachInterceptor();
    }
  }

  _attachInterceptor(container) {
    this._currentContainer = container;
    this._interceptor = new FieldInterceptor(container, this.resources, {
      triggerAction: this.props.triggerAction
    });
  }

  _detachInterceptor() {
    this._currentContainer = null;

    if (this._interceptor) {
      this._interceptor.destroy();
      this._interceptor = null;
    }
  }

  _registerSettings(_getGlobal, config, settings, savedDir) {
    const supportsCustom = this._supportsCustomSettings();

    if (supportsCustom) {
      settings.register({
        id: SETTINGS_ID,
        title: 'Resource Suggest',
        order: 10,
        properties: {
          [SETTINGS_KEY_DIRECTORY]: {
            type: 'custom',
            component: (componentProps) => DirectoryPicker({
              ...componentProps,
              getGlobal: _getGlobal,
              config,
              onDirectoryChanged: (path) => this._onDirectoryChanged(path)
            }),
            description: 'Directory to scan for BPMN, DMN, and Form files.'
          }
        }
      });
    } else {
      this._useTextFallback = true;

      settings.register({
        id: SETTINGS_ID,
        title: 'Resource Suggest',
        order: 10,
        properties: {
          [SETTINGS_KEY_DIRECTORY]: {
            type: 'text',
            label: 'Scan directory',
            default: savedDir,
            description: 'Absolute path to directory with BPMN, DMN, and Form files.'
          }
        }
      });

      // Listen for text field changes via the settings system.
      settings.subscribe(SETTINGS_KEY_DIRECTORY, ({ value }) => {
        const dir = (value || '').trim();

        // Keep plugin config in sync so both storage paths stay consistent.
        this._config.setForPlugin(PLUGIN_NAME, CONFIG_KEY, dir);
        this._onDirectoryChanged(dir || null);
      });
    }

    console.log('[ResourceSuggest] settings registered, customType:', supportsCustom);
  }

  /**
   * Detect whether the modeler supports `type: 'custom'` in settings (v5.43+).
   * Reads the version from the status bar button rendered by the VersionInfo plugin.
   */
  _supportsCustomSettings() {
    const button = document.querySelector('[title="Toggle version info"]');

    if (button) {
      const match = button.textContent.match(/v?(\d+)\.(\d+)/);

      if (match) {
        const major = parseInt(match[1], 10);
        const minor = parseInt(match[2], 10);
        return major > 5 || (major === 5 && minor >= 43);
      }
    }

    // If we can't determine the version, fall back to text (safe default).
    return false;
  }

  async _loadSavedDirectory() {
    const savedDir = await this._config.getForPlugin(PLUGIN_NAME, CONFIG_KEY);

    if (savedDir) {
      this._currentDirectory = savedDir;
      this._scanner.setScanRoot(savedDir);
    }
  }

  _onDirectoryChanged(newDirectory) {
    this.resources = [];
    this._lastResourceHash = '';

    if (newDirectory) {
      this._currentDirectory = newDirectory;
      this._scanner.setScanRoot(newDirectory);
    } else {
      this._currentDirectory = null;
    }

    if (this._interceptor) {
      this._interceptor.updateResources(this.resources);
    }
  }

  _processItems(items) {
    const newResources = this._scanner.scan(items);
    const newHash = newResources.map(r => `${r.type}:${r.id}:${r.filePath}`).sort().join('|');

    console.log('[ResourceSuggest] _processItems', 'items:', items.length, 'resources:', newResources.length, 'hashChanged:', newHash !== this._lastResourceHash);

    if (newHash === this._lastResourceHash) {
      return;
    }

    this._lastResourceHash = newHash;
    this.resources = newResources;

    if (this._interceptor) {
      this._interceptor.updateResources(this.resources);
    }
  }

  render() {
    return null;
  }
}
