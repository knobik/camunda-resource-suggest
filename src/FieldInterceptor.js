import ComboboxRenderer from './ComboboxRenderer';
import { RESOURCE_TYPES } from './ResourceScanner';

const FIELD_CONFIG = {
  'decisionRef': { resourceType: RESOURCE_TYPES.DMN, label: 'Decision reference' },
  'calledElement': { resourceType: RESOURCE_TYPES.BPMN_PROCESS, label: 'Called element' },
  'formRef': { resourceType: RESOURCE_TYPES.FORM, label: 'Form reference' },
  'messageName': { resourceType: RESOURCE_TYPES.BPMN_MESSAGE, label: 'Message name' }
};

const ENTRY_IDS = Object.keys(FIELD_CONFIG);

export default class FieldInterceptor {

  constructor(container, resources, options = {}) {
    this._container = container;
    this._resources = resources;
    this._triggerAction = options.triggerAction;
    this._comboboxes = new Map();
    this._scanning = false;
    this._scanDebounce = null;

    this._observer = new MutationObserver(() => {
      if (this._scanning) return;

      clearTimeout(this._scanDebounce);
      this._scanDebounce = setTimeout(() => {
        this._scanForFields();
      }, 100);
    });

    this._observer.observe(container, {
      childList: true,
      subtree: true
    });

    this._scanForFields();
  }

  updateResources(resources) {
    this._resources = resources;

    for (const [ , combobox ] of this._comboboxes) {
      const filtered = this._getResourcesForType(combobox.resourceType);
      combobox.updateResources(filtered);
    }
  }

  destroy() {
    this._observer.disconnect();
    clearTimeout(this._scanDebounce);

    for (const [ , combobox ] of this._comboboxes) {
      combobox.destroy();
    }

    this._comboboxes.clear();
  }

  _scanForFields() {
    this._scanning = true;
    this._cleanupStaleComboboxes();

    for (const entryId of ENTRY_IDS) {
      const entry = this._container.querySelector(`[data-entry-id="${entryId}"]`);

      if (!entry) continue;

      const input = entry.querySelector('input.bio-properties-panel-input');

      if (!input) continue;
      if (input.getAttribute('data-resource-suggest')) continue;

      const config = FIELD_CONFIG[entryId];
      const resources = this._getResourcesForType(config.resourceType);
      const combobox = new ComboboxRenderer(input, resources, {
        ...config,
        triggerAction: this._triggerAction
      });

      this._comboboxes.set(input, combobox);
    }

    this._scanning = false;
  }

  _cleanupStaleComboboxes() {
    for (const [ input, combobox ] of this._comboboxes) {
      if (!this._container.contains(input)) {
        combobox.destroy();
        this._comboboxes.delete(input);
      }
    }
  }

  _getResourcesForType(resourceType) {
    return this._resources.filter(r => r.type === resourceType);
  }
}
