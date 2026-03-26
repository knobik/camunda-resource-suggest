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

    this._backend = _getGlobal('backend');
    this._config = config;
    this._scanner = new ResourceScanner();
    this._currentDirectory = null;
    this._interceptor = null;
    this.resources = [];

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

    this._fileContextDebounce = null;
    this._lastResourceHash = '';
    this._directoryLoaded = false;
    this._fileContextSubscription = this._backend.on('file-context:changed', (_event, items) => {
      console.log('[ResourceSuggest] file-context:changed', 'directoryLoaded:', this._directoryLoaded, 'items:', items?.length, 'currentDir:', this._currentDirectory);
      if (!this._directoryLoaded) return;

      clearTimeout(this._fileContextDebounce);
      this._fileContextDebounce = setTimeout(() => {
        this._onFileContextChanged(items);
      }, 500);
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

    if (this._fileContextSubscription) {
      this._fileContextSubscription.cancel();
    }

    clearTimeout(this._fileContextDebounce);
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

  async _loadSavedDirectory() {
    const savedDir = await this._config.getForPlugin(PLUGIN_NAME, CONFIG_KEY);

    if (savedDir) {
      this._addRoot(savedDir);
    }

    this._directoryLoaded = true;
  }

  _onDirectoryChanged(newDirectory) {
    if (this._currentDirectory) {
      this._removeRoot(this._currentDirectory);
    }

    this.resources = [];
    this._lastResourceHash = '';

    if (newDirectory) {
      this._addRoot(newDirectory);
    }
  }

  _addRoot(directory) {
    this._currentDirectory = directory;
    this._scanner.setScanRoot(directory);
    this._backend.send('file-context:add-root', { filePath: directory });
  }

  _removeRoot(directory) {
    this._backend.send('file-context:remove-root', { filePath: directory });
    this._currentDirectory = null;
  }

  _onFileContextChanged(items) {
    const filteredItems = this._currentDirectory
      ? items.filter(item => item.file && item.file.path && item.file.path.startsWith(this._currentDirectory))
      : [];

    const newResources = this._scanner.scan(filteredItems);
    const newHash = newResources.map(r => `${r.type}:${r.id}:${r.filePath}`).sort().join('|');

    console.log('[ResourceSuggest] _onFileContextChanged', 'filtered:', filteredItems.length, 'resources:', newResources.length, 'hashChanged:', newHash !== this._lastResourceHash);

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
