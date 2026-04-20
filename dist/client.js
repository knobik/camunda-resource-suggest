/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/ComboboxRenderer.js"
/*!*********************************!*\
  !*** ./src/ComboboxRenderer.js ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ComboboxRenderer)
/* harmony export */ });
/* harmony import */ var _bpmn_io_properties_panel_preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @bpmn-io/properties-panel/preact */ "./node_modules/camunda-modeler-plugin-helpers/vendor/@bpmn-io/properties-panel/preact/index.js");
/* harmony import */ var _bpmn_io_properties_panel_preact__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_bpmn_io_properties_panel_preact__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _bpmn_io_properties_panel_preact_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @bpmn-io/properties-panel/preact/hooks */ "./node_modules/camunda-modeler-plugin-helpers/vendor/@bpmn-io/properties-panel/preact/hooks.js");
/* harmony import */ var _bpmn_io_properties_panel_preact_hooks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_bpmn_io_properties_panel_preact_hooks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ResourceScanner__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ResourceScanner */ "./src/ResourceScanner.js");
/* harmony import */ var _bpmn_io_properties_panel_preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @bpmn-io/properties-panel/preact/jsx-runtime */ "./node_modules/camunda-modeler-plugin-helpers/vendor/@bpmn-io/properties-panel/preact/jsx-runtime.js");
/* harmony import */ var _bpmn_io_properties_panel_preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_bpmn_io_properties_panel_preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




const OPEN_ICON = () => (0,_bpmn_io_properties_panel_preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("svg", {
  width: "12",
  height: "12",
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  children: (0,_bpmn_io_properties_panel_preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("path", {
    d: "M9 1h6v6M15 1L8 8M13 9v5a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1h5"
  })
});
const CLEAR_ICON = () => (0,_bpmn_io_properties_panel_preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("svg", {
  width: "10",
  height: "10",
  viewBox: "0 0 12 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  children: (0,_bpmn_io_properties_panel_preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("path", {
    d: "M2 2l8 8M10 2l-8 8"
  })
});
const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
function syncToOriginal(originalInput, value) {
  nativeInputValueSetter.call(originalInput, value);
  originalInput.dispatchEvent(new Event('input', {
    bubbles: true
  }));
  originalInput.dispatchEvent(new Event('change', {
    bubbles: true
  }));
}
function Combobox({
  originalInput,
  resources,
  config
}) {
  const [isOpen, setIsOpen] = (0,_bpmn_io_properties_panel_preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [searchValue, setSearchValue] = (0,_bpmn_io_properties_panel_preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)(originalInput.value || '');
  const [highlightIndex, setHighlightIndex] = (0,_bpmn_io_properties_panel_preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)(-1);
  const wrapperRef = (0,_bpmn_io_properties_panel_preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
  const searchInputRef = (0,_bpmn_io_properties_panel_preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
  const dropdownRef = (0,_bpmn_io_properties_panel_preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
  const mouseOverDropdownRef = (0,_bpmn_io_properties_panel_preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useRef)(false);
  const isMessage = config.resourceType === _ResourceScanner__WEBPACK_IMPORTED_MODULE_2__.RESOURCE_TYPES.BPMN_MESSAGE;
  const trimmed = searchValue.trim();
  const query = trimmed.toLowerCase();
  const filteredResources = resources.filter(r => {
    if (!query) return true;
    return r.name.toLowerCase().includes(query) || r.id.toLowerCase().includes(query) || r.filePath.toLowerCase().includes(query);
  });
  const matchedResource = trimmed ? resources.find(r => isMessage ? r.name === trimmed : r.id === trimmed) || null : null;
  const hasValue = trimmed.length > 0;
  const hasOpenAction = matchedResource && matchedResource.absolutePath && config.triggerAction;
  let buttonCount = 1;
  if (hasValue) buttonCount++;
  if (hasOpenAction) buttonCount++;
  const searchValueRef = (0,_bpmn_io_properties_panel_preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useRef)(searchValue);
  searchValueRef.current = searchValue;
  const open = (0,_bpmn_io_properties_panel_preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
    setIsOpen(true);
    setHighlightIndex(-1);
  }, []);
  const close = (0,_bpmn_io_properties_panel_preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
    setIsOpen(false);
  }, []);
  const commitValue = (0,_bpmn_io_properties_panel_preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
    const value = searchValueRef.current.trim();
    if (value !== originalInput.value) {
      syncToOriginal(originalInput, value);
    }
  }, [originalInput]);
  const selectResource = (0,_bpmn_io_properties_panel_preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useCallback)(resource => {
    const value = isMessage ? resource.name : resource.id;
    setSearchValue(value);
    syncToOriginal(originalInput, value);
  }, [isMessage, originalInput]);

  // Close on outside click — uses stable refs to avoid re-registering per keystroke
  (0,_bpmn_io_properties_panel_preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (!isOpen) return;
    const handler = e => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        commitValue();
        close();
      }
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, [isOpen, commitValue, close]);
  const onSearchInput = e => {
    setSearchValue(e.target.value);
    if (!isOpen) open();
  };
  const onSearchFocus = () => open();
  const onSearchBlur = () => {
    setTimeout(() => {
      if (mouseOverDropdownRef.current) {
        searchInputRef.current?.focus();
        return;
      }
      if (wrapperRef.current && !wrapperRef.current.contains(document.activeElement)) {
        commitValue();
        close();
      }
    }, 150);
  };
  const onSearchKeyDown = e => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          open();
        } else {
          setHighlightIndex(i => Math.min(i + 1, filteredResources.length - 1));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (isOpen && highlightIndex >= 0 && highlightIndex < filteredResources.length) {
          selectResource(filteredResources[highlightIndex]);
        } else {
          commitValue();
        }
        close();
        break;
      case 'Escape':
        e.preventDefault();
        setSearchValue(originalInput.value || '');
        close();
        break;
    }
  };
  const onToggleClick = e => {
    e.preventDefault();
    if (isOpen) {
      close();
    } else {
      searchInputRef.current?.focus();
      open();
    }
  };
  const onClear = e => {
    e.preventDefault();
    setSearchValue('');
    syncToOriginal(originalInput, '');
    searchInputRef.current?.focus();
  };
  const onOpenCurrent = e => {
    e.preventDefault();
    if (hasOpenAction) {
      config.triggerAction('open-diagram', {
        path: matchedResource.absolutePath
      });
      searchInputRef.current?.focus();
    }
  };
  const onDropdownMouseDown = e => {
    e.preventDefault();
    mouseOverDropdownRef.current = true;
    const onUp = () => {
      mouseOverDropdownRef.current = false;
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mouseup', onUp);
  };
  const onItemClick = (index, e) => {
    const resource = filteredResources[index];
    if (!resource) return;
    const openBtn = e.target.closest('.rs-combobox-item-open');
    if (openBtn && resource.absolutePath && config.triggerAction) {
      config.triggerAction('open-diagram', {
        path: resource.absolutePath
      });
    } else {
      selectResource(resource);
    }
    close();
    searchInputRef.current?.focus();
  };

  // Scroll highlighted item into view
  (0,_bpmn_io_properties_panel_preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (highlightIndex >= 0 && dropdownRef.current) {
      const items = dropdownRef.current.querySelectorAll('.rs-combobox-item');
      if (items[highlightIndex]) {
        items[highlightIndex].scrollIntoView({
          block: 'nearest'
        });
      }
    }
  }, [highlightIndex]);
  const hasTriggerAction = !!config.triggerAction;
  return (0,_bpmn_io_properties_panel_preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    ref: wrapperRef,
    class: 'rs-combobox-wrapper' + (isOpen ? ' rs-combobox-open' : ''),
    children: [(0,_bpmn_io_properties_panel_preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
      ref: searchInputRef,
      type: "text",
      class: "bio-properties-panel-input rs-combobox-input",
      placeholder: config.label || 'Search...',
      value: searchValue,
      onInput: onSearchInput,
      onFocus: onSearchFocus,
      onBlur: onSearchBlur,
      onKeyDown: onSearchKeyDown,
      style: {
        paddingRight: buttonCount * 22 + 2 + 'px'
      }
    }), (0,_bpmn_io_properties_panel_preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      class: "rs-combobox-actions",
      onMouseDown: e => e.preventDefault(),
      children: [hasValue && (0,_bpmn_io_properties_panel_preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
        type: "button",
        class: "rs-combobox-clear",
        title: "Clear value",
        onMouseDown: onClear,
        children: (0,_bpmn_io_properties_panel_preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(CLEAR_ICON, {})
      }), hasOpenAction && (0,_bpmn_io_properties_panel_preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
        type: "button",
        class: "rs-combobox-open-current",
        title: "Open in modeler",
        onMouseDown: onOpenCurrent,
        children: (0,_bpmn_io_properties_panel_preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(OPEN_ICON, {})
      }), (0,_bpmn_io_properties_panel_preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
        type: "button",
        class: "rs-combobox-toggle",
        onMouseDown: onToggleClick,
        children: '▾'
      })]
    }), isOpen && (0,_bpmn_io_properties_panel_preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      ref: dropdownRef,
      class: "rs-combobox-dropdown",
      onMouseDown: onDropdownMouseDown,
      children: filteredResources.length === 0 ? (0,_bpmn_io_properties_panel_preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        class: "rs-combobox-empty",
        children: resources.length === 0 ? (0,_bpmn_io_properties_panel_preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("a", {
          href: "#",
          class: "rs-combobox-settings-link",
          onMouseDown: e => {
            e.preventDefault();
            if (config.triggerAction) {
              config.triggerAction('emit-event', {
                type: 'app.settings-open'
              });
            }
            close();
          },
          children: "Configure a resource directory in Settings"
        }) : 'No matching resources found'
      }) : filteredResources.map((resource, index) => (0,_bpmn_io_properties_panel_preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        class: 'rs-combobox-item' + (index === highlightIndex ? ' rs-combobox-item--highlighted' : ''),
        onClick: e => onItemClick(index, e),
        onMouseEnter: () => setHighlightIndex(index),
        children: [(0,_bpmn_io_properties_panel_preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          class: "rs-combobox-item-content",
          children: [(0,_bpmn_io_properties_panel_preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            class: "rs-combobox-item-primary",
            children: [resource.name, " (", resource.id, ")"]
          }), (0,_bpmn_io_properties_panel_preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
            class: "rs-combobox-item-secondary",
            children: resource.filePath
          })]
        }), resource.absolutePath && hasTriggerAction && (0,_bpmn_io_properties_panel_preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
          type: "button",
          class: "rs-combobox-item-open",
          title: "Open in modeler",
          children: (0,_bpmn_io_properties_panel_preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(OPEN_ICON, {})
        })]
      }, resource.type + ':' + resource.id + ':' + resource.filePath))
    })]
  });
}

// --- Public API matching the old class interface ---

class ComboboxRenderer {
  constructor(originalInput, resources, config) {
    this._originalInput = originalInput;
    this._resources = resources;
    this._config = config;
    originalInput.style.display = 'none';
    originalInput.setAttribute('data-resource-suggest', 'true');
    this._wrapper = document.createElement('div');
    this._wrapper.className = 'rs-combobox-mount';
    originalInput.parentNode.insertBefore(this._wrapper, originalInput.nextSibling);
    this._render();
  }
  get resourceType() {
    return this._config.resourceType;
  }
  updateResources(resources) {
    this._resources = resources;
    this._render();
  }
  destroy() {
    (0,_bpmn_io_properties_panel_preact__WEBPACK_IMPORTED_MODULE_0__.render)(null, this._wrapper);
    if (this._wrapper.parentNode) {
      this._wrapper.parentNode.removeChild(this._wrapper);
    }
    this._originalInput.style.display = '';
    this._originalInput.removeAttribute('data-resource-suggest');
  }
  _render() {
    (0,_bpmn_io_properties_panel_preact__WEBPACK_IMPORTED_MODULE_0__.render)((0,_bpmn_io_properties_panel_preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(Combobox, {
      originalInput: this._originalInput,
      resources: this._resources,
      config: this._config
    }), this._wrapper);
  }
}

/***/ },

/***/ "./src/FieldInterceptor.js"
/*!*********************************!*\
  !*** ./src/FieldInterceptor.js ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FieldInterceptor)
/* harmony export */ });
/* harmony import */ var _ComboboxRenderer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ComboboxRenderer */ "./src/ComboboxRenderer.js");
/* harmony import */ var _ResourceScanner__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ResourceScanner */ "./src/ResourceScanner.js");


const FIELD_CONFIG = {
  'decisionRef': {
    resourceType: _ResourceScanner__WEBPACK_IMPORTED_MODULE_1__.RESOURCE_TYPES.DMN,
    label: 'Decision reference'
  },
  'calledElement': {
    resourceType: _ResourceScanner__WEBPACK_IMPORTED_MODULE_1__.RESOURCE_TYPES.BPMN_PROCESS,
    label: 'Called element'
  },
  'formRef': {
    resourceType: _ResourceScanner__WEBPACK_IMPORTED_MODULE_1__.RESOURCE_TYPES.FORM,
    label: 'Form reference'
  },
  'messageName': {
    resourceType: _ResourceScanner__WEBPACK_IMPORTED_MODULE_1__.RESOURCE_TYPES.BPMN_MESSAGE,
    label: 'Message name'
  }
};
const ENTRY_IDS = Object.keys(FIELD_CONFIG);
class FieldInterceptor {
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
    for (const [, combobox] of this._comboboxes) {
      const filtered = this._getResourcesForType(combobox.resourceType);
      combobox.updateResources(filtered);
    }
  }
  destroy() {
    this._observer.disconnect();
    clearTimeout(this._scanDebounce);
    for (const [, combobox] of this._comboboxes) {
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
      const combobox = new _ComboboxRenderer__WEBPACK_IMPORTED_MODULE_0__["default"](input, resources, {
        ...config,
        triggerAction: this._triggerAction
      });
      this._comboboxes.set(input, combobox);
    }
    this._scanning = false;
  }
  _cleanupStaleComboboxes() {
    for (const [input, combobox] of this._comboboxes) {
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

/***/ },

/***/ "./src/ResourceScanner.js"
/*!********************************!*\
  !*** ./src/ResourceScanner.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CONFIG_KEY: () => (/* binding */ CONFIG_KEY),
/* harmony export */   PLUGIN_NAME: () => (/* binding */ PLUGIN_NAME),
/* harmony export */   RESOURCE_TYPES: () => (/* binding */ RESOURCE_TYPES),
/* harmony export */   "default": () => (/* binding */ ResourceScanner),
/* harmony export */   normalizePath: () => (/* binding */ normalizePath)
/* harmony export */ });
const RESOURCE_TYPES = {
  DMN: 'dmn',
  BPMN_PROCESS: 'bpmn-process',
  BPMN_MESSAGE: 'bpmn-message',
  FORM: 'form'
};
const PLUGIN_NAME = 'resource-suggest';
const CONFIG_KEY = 'scanDirectory';
const EXTENSIONS = {
  '.bpmn': 'bpmn',
  '.dmn': 'dmn',
  '.form': 'form'
};

/**
 * Normalize path separators to forward slashes for consistent comparison
 * across platforms (Windows backslashes vs Unix forward slashes).
 */
function normalizePath(p) {
  return p ? p.replace(/\\/g, '/') : '';
}
class ResourceScanner {
  constructor(scanRoot) {
    this._scanRoot = normalizePath(scanRoot);
  }
  setScanRoot(scanRoot) {
    this._scanRoot = normalizePath(scanRoot);
  }
  scan(items) {
    const resources = [];
    for (const item of items) {
      const {
        file
      } = item;
      if (!file || !file.contents || !file.path) {
        continue;
      }
      const ext = this._getExtension(file.path);
      const type = EXTENSIONS[ext];
      if (!type) {
        continue;
      }
      const relativePath = this._getRelativePath(file.path);
      const absolutePath = file.path;
      try {
        switch (type) {
          case 'bpmn':
            this._extractXmlResources(file.contents, 'process', RESOURCE_TYPES.BPMN_PROCESS, relativePath, absolutePath, resources);
            this._extractXmlResources(file.contents, 'message', RESOURCE_TYPES.BPMN_MESSAGE, relativePath, absolutePath, resources, true);
            break;
          case 'dmn':
            this._extractXmlResources(file.contents, 'decision', RESOURCE_TYPES.DMN, relativePath, absolutePath, resources);
            break;
          case 'form':
            this._parseForm(file.contents, relativePath, absolutePath, resources);
            break;
        }
      } catch (err) {
        console.warn('[ResourceSuggest] Failed to parse', file.path, err.message);
      }
    }
    return resources;
  }
  _extractXmlResources(contents, tagName, resourceType, filePath, absolutePath, resources, allowNameAsId = false) {
    const doc = new DOMParser().parseFromString(contents, 'text/xml');
    if (doc.querySelector('parsererror')) {
      return;
    }
    const elements = doc.getElementsByTagNameNS('*', tagName);
    for (const el of elements) {
      const id = el.getAttribute('id');
      const name = el.getAttribute('name');
      if (id || allowNameAsId && name) {
        resources.push({
          type: resourceType,
          id: id || name,
          name: name || id,
          filePath,
          absolutePath
        });
      }
    }
  }
  _parseForm(contents, filePath, absolutePath, resources) {
    const form = JSON.parse(contents);
    if (form && typeof form === 'object' && form.id) {
      resources.push({
        type: RESOURCE_TYPES.FORM,
        id: form.id,
        name: form.name || form.id,
        filePath,
        absolutePath
      });
    }
  }
  _getExtension(filePath) {
    const lastDot = filePath.lastIndexOf('.');
    return lastDot >= 0 ? filePath.substring(lastDot).toLowerCase() : '';
  }
  _getRelativePath(filePath) {
    const normalized = normalizePath(filePath);
    if (this._scanRoot && normalized.startsWith(this._scanRoot)) {
      let relative = normalized.substring(this._scanRoot.length);
      if (relative.startsWith('/')) {
        relative = relative.substring(1);
      }
      return relative;
    }
    return filePath;
  }
}

/***/ },

/***/ "./src/ResourceSuggestPlugin.js"
/*!**************************************!*\
  !*** ./src/ResourceSuggestPlugin.js ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ResourceSuggestPlugin)
/* harmony export */ });
/* harmony import */ var _settings_DirectoryPicker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./settings/DirectoryPicker */ "./src/settings/DirectoryPicker.js");
/* harmony import */ var _ResourceScanner__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ResourceScanner */ "./src/ResourceScanner.js");
/* harmony import */ var _FieldInterceptor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FieldInterceptor */ "./src/FieldInterceptor.js");



const SETTINGS_ID = 'resourceSuggest';
const SETTINGS_KEY_DIRECTORY = `${SETTINGS_ID}.scanDirectory`;
class ResourceSuggestPlugin {
  constructor(props) {
    this.props = props;
    const {
      subscribe,
      settings,
      config,
      _getGlobal
    } = props;
    this._config = config;
    this._settings = settings;
    this._scanner = new _ResourceScanner__WEBPACK_IMPORTED_MODULE_1__["default"]();
    this._currentDirectory = null;
    this._interceptor = null;
    this._useTextFallback = false;
    this.resources = [];
    this._lastResourceHash = '';

    // Defer settings registration so the DOM is available for version detection.
    // The settings dialog is opened manually by the user, so this is safe.
    // We pre-load the saved directory to use as the default value for the text field.
    this._config.getForPlugin(_ResourceScanner__WEBPACK_IMPORTED_MODULE_1__.PLUGIN_NAME, _ResourceScanner__WEBPACK_IMPORTED_MODULE_1__.CONFIG_KEY).then(savedDir => {
      setTimeout(() => this._registerSettings(_getGlobal, config, settings, savedDir || ''), 0);
    });

    // Listen for scan results from the menu.js backend (main process).
    subscribe('resource-suggest.files', ({
      directory,
      items
    }) => {
      console.log('[ResourceSuggest] received backend scan', 'directory:', directory, 'items:', items?.length);
      if (directory && items) {
        this._currentDirectory = directory;
        this._scanner.setScanRoot(directory);
        this._processItems(items);
      }
    });
    this._loadSavedDirectory();
    this._currentContainer = null;
    subscribe('app.activeTabChanged', ({
      activeTab
    }) => {
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
    this._interceptor = new _FieldInterceptor__WEBPACK_IMPORTED_MODULE_2__["default"](container, this.resources, {
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
            component: componentProps => (0,_settings_DirectoryPicker__WEBPACK_IMPORTED_MODULE_0__["default"])({
              ...componentProps,
              getGlobal: _getGlobal,
              config,
              onDirectoryChanged: path => this._onDirectoryChanged(path)
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
      settings.subscribe(SETTINGS_KEY_DIRECTORY, ({
        value
      }) => {
        const dir = (value || '').trim();

        // Keep plugin config in sync so both storage paths stay consistent.
        this._config.setForPlugin(_ResourceScanner__WEBPACK_IMPORTED_MODULE_1__.PLUGIN_NAME, _ResourceScanner__WEBPACK_IMPORTED_MODULE_1__.CONFIG_KEY, dir);
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
        return major > 5 || major === 5 && minor >= 43;
      }
    }

    // If we can't determine the version, fall back to text (safe default).
    return false;
  }
  async _loadSavedDirectory() {
    const savedDir = await this._config.getForPlugin(_ResourceScanner__WEBPACK_IMPORTED_MODULE_1__.PLUGIN_NAME, _ResourceScanner__WEBPACK_IMPORTED_MODULE_1__.CONFIG_KEY);
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
ResourceSuggestPlugin.prototype.isReactComponent = {};

/***/ },

/***/ "./src/settings/DirectoryPicker.js"
/*!*****************************************!*\
  !*** ./src/settings/DirectoryPicker.js ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DirectoryPicker)
/* harmony export */ });
/* harmony import */ var _ResourceScanner__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ResourceScanner */ "./src/ResourceScanner.js");


// DirectoryPicker renders inside the modeler's React settings dialog.
// We can't use JSX here (webpack compiles it to Preact), so we create
// a React element via the modeler's global React and populate it with
// vanilla DOM via a ref callback.
const React = window.react;
function DirectoryPickerComponent({
  getGlobal,
  config,
  onDirectoryChanged
}) {
  const containerRef = React.useRef(null);
  const builtRef = React.useRef(false);
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || builtRef.current) return;
    builtRef.current = true;
    const description = document.createElement('div');
    description.className = 'custom-control-description';
    description.textContent = 'Directory to scan for BPMN, DMN, and Form files.';
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:8px;margin-top:8px';
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'bio-properties-panel-input';
    input.placeholder = 'No directory selected';
    input.style.flex = '1';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-secondary';
    button.textContent = 'Browse...';
    row.appendChild(input);
    row.appendChild(button);
    el.appendChild(description);
    el.appendChild(row);
    const saveDirectory = async path => {
      input.value = path;
      await config.setForPlugin(_ResourceScanner__WEBPACK_IMPORTED_MODULE_0__.PLUGIN_NAME, _ResourceScanner__WEBPACK_IMPORTED_MODULE_0__.CONFIG_KEY, path);
      if (onDirectoryChanged) {
        onDirectoryChanged(path);
      }
    };
    input.addEventListener('change', e => saveDirectory(e.target.value));
    button.addEventListener('click', async () => {
      const dialog = getGlobal('dialog');
      const result = await dialog.showOpenFilesDialog({
        properties: ['openDirectory'],
        title: 'Select resource directory'
      });
      const directoryPath = result && result[0];
      if (directoryPath) {
        saveDirectory(directoryPath);
      }
    });
    config.getForPlugin(_ResourceScanner__WEBPACK_IMPORTED_MODULE_0__.PLUGIN_NAME, _ResourceScanner__WEBPACK_IMPORTED_MODULE_0__.CONFIG_KEY).then(value => {
      if (value) input.value = value;
    });
  }, []);
  return React.createElement('div', {
    className: 'custom-control',
    ref: containerRef
  });
}
function DirectoryPicker(props) {
  return React.createElement(DirectoryPickerComponent, props);
}

/***/ },

/***/ "./node_modules/camunda-modeler-plugin-helpers/helper.js"
/*!***************************************************************!*\
  !*** ./node_modules/camunda-modeler-plugin-helpers/helper.js ***!
  \***************************************************************/
(module) {

function returnOrThrow(getter, minimalModelerVersion) {
  let result;
  try {
    result = getter();
  } catch (error) {}

  if (!result) {
    throw new Error(`Not compatible with Camunda Modeler < ${minimalModelerVersion}`);
  }

  return result;
}

module.exports = {
  returnOrThrow
};


/***/ },

/***/ "./node_modules/camunda-modeler-plugin-helpers/index.js"
/*!**************************************************************!*\
  !*** ./node_modules/camunda-modeler-plugin-helpers/index.js ***!
  \**************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getModelerDirectory: () => (/* binding */ getModelerDirectory),
/* harmony export */   getPluginsDirectory: () => (/* binding */ getPluginsDirectory),
/* harmony export */   registerBpmnJSModdleExtension: () => (/* binding */ registerBpmnJSModdleExtension),
/* harmony export */   registerBpmnJSPlugin: () => (/* binding */ registerBpmnJSPlugin),
/* harmony export */   registerClientExtension: () => (/* binding */ registerClientExtension),
/* harmony export */   registerClientPlugin: () => (/* binding */ registerClientPlugin),
/* harmony export */   registerCloudBpmnJSModdleExtension: () => (/* binding */ registerCloudBpmnJSModdleExtension),
/* harmony export */   registerCloudBpmnJSPlugin: () => (/* binding */ registerCloudBpmnJSPlugin),
/* harmony export */   registerCloudDmnJSModdleExtension: () => (/* binding */ registerCloudDmnJSModdleExtension),
/* harmony export */   registerCloudDmnJSPlugin: () => (/* binding */ registerCloudDmnJSPlugin),
/* harmony export */   registerDmnJSModdleExtension: () => (/* binding */ registerDmnJSModdleExtension),
/* harmony export */   registerDmnJSPlugin: () => (/* binding */ registerDmnJSPlugin),
/* harmony export */   registerPlatformBpmnJSModdleExtension: () => (/* binding */ registerPlatformBpmnJSModdleExtension),
/* harmony export */   registerPlatformBpmnJSPlugin: () => (/* binding */ registerPlatformBpmnJSPlugin),
/* harmony export */   registerPlatformDmnJSModdleExtension: () => (/* binding */ registerPlatformDmnJSModdleExtension),
/* harmony export */   registerPlatformDmnJSPlugin: () => (/* binding */ registerPlatformDmnJSPlugin)
/* harmony export */ });
/**
 * Validate and register a client plugin.
 *
 * @param {Object} plugin
 * @param {String} type
 */
function registerClientPlugin(plugin, type) {
  var plugins = window.plugins || [];
  window.plugins = plugins;

  if (!plugin) {
    throw new Error('plugin not specified');
  }

  if (!type) {
    throw new Error('type not specified');
  }

  plugins.push({
    plugin: plugin,
    type: type
  });
}

/**
 * Validate and register a client plugin.
 *
 * @param {import('react').ComponentType} extension
 *
 * @example
 *
 * import MyExtensionComponent from './MyExtensionComponent';
 *
 * registerClientExtension(MyExtensionComponent);
 */
function registerClientExtension(component) {
  registerClientPlugin(component, 'client');
}

/**
 * Validate and register a bpmn-js plugin.
 *
 * @param {Object} module
 *
 * @example
 *
 * import {
 *   registerBpmnJSPlugin
 * } from 'camunda-modeler-plugin-helpers';
 *
 * const BpmnJSModule = {
 *   __init__: [ 'myService' ],
 *   myService: [ 'type', ... ]
 * };
 *
 * registerBpmnJSPlugin(BpmnJSModule);
 */
function registerBpmnJSPlugin(module) {
  registerClientPlugin(module, 'bpmn.modeler.additionalModules');
}

/**
 * Validate and register a platform specific bpmn-js plugin.
 *
 * @param {Object} module
 *
 * @example
 *
 * import {
 *   registerPlatformBpmnJSPlugin
 * } from 'camunda-modeler-plugin-helpers';
 *
 * const BpmnJSModule = {
 *   __init__: [ 'myService' ],
 *   myService: [ 'type', ... ]
 * };
 *
 * registerPlatformBpmnJSPlugin(BpmnJSModule);
 */
function registerPlatformBpmnJSPlugin(module) {
  registerClientPlugin(module, 'bpmn.platform.modeler.additionalModules');
}

/**
 * Validate and register a cloud specific bpmn-js plugin.
 *
 * @param {Object} module
 *
 * @example
 *
 * import {
 *   registerCloudBpmnJSPlugin
 * } from 'camunda-modeler-plugin-helpers';
 *
 * const BpmnJSModule = {
 *   __init__: [ 'myService' ],
 *   myService: [ 'type', ... ]
 * };
 *
 * registerCloudBpmnJSPlugin(BpmnJSModule);
 */
function registerCloudBpmnJSPlugin(module) {
  registerClientPlugin(module, 'bpmn.cloud.modeler.additionalModules');
}

/**
 * Validate and register a bpmn-moddle extension plugin.
 *
 * @param {Object} descriptor
 *
 * @example
 * import {
 *   registerBpmnJSModdleExtension
 * } from 'camunda-modeler-plugin-helpers';
 *
 * var moddleDescriptor = {
 *   name: 'my descriptor',
 *   uri: 'http://example.my.company.localhost/schema/my-descriptor/1.0',
 *   prefix: 'mydesc',
 *
 *   ...
 * };
 *
 * registerBpmnJSModdleExtension(moddleDescriptor);
 */
function registerBpmnJSModdleExtension(descriptor) {
  registerClientPlugin(descriptor, 'bpmn.modeler.moddleExtension');
}

/**
 * Validate and register a platform specific bpmn-moddle extension plugin.
 *
 * @param {Object} descriptor
 *
 * @example
 * import {
 *   registerPlatformBpmnJSModdleExtension
 * } from 'camunda-modeler-plugin-helpers';
 *
 * var moddleDescriptor = {
 *   name: 'my descriptor',
 *   uri: 'http://example.my.company.localhost/schema/my-descriptor/1.0',
 *   prefix: 'mydesc',
 *
 *   ...
 * };
 *
 * registerPlatformBpmnJSModdleExtension(moddleDescriptor);
 */
function registerPlatformBpmnJSModdleExtension(descriptor) {
  registerClientPlugin(descriptor, 'bpmn.platform.modeler.moddleExtension');
}

/**
 * Validate and register a cloud specific bpmn-moddle extension plugin.
 *
 * @param {Object} descriptor
 *
 * @example
 * import {
 *   registerCloudBpmnJSModdleExtension
 * } from 'camunda-modeler-plugin-helpers';
 *
 * var moddleDescriptor = {
 *   name: 'my descriptor',
 *   uri: 'http://example.my.company.localhost/schema/my-descriptor/1.0',
 *   prefix: 'mydesc',
 *
 *   ...
 * };
 *
 * registerCloudBpmnJSModdleExtension(moddleDescriptor);
 */
function registerCloudBpmnJSModdleExtension(descriptor) {
  registerClientPlugin(descriptor, 'bpmn.cloud.modeler.moddleExtension');
}

/**
 * Validate and register a dmn-moddle extension plugin.
 *
 * @param {Object} descriptor
 *
 * @example
 * import {
 *   registerDmnJSModdleExtension
 * } from 'camunda-modeler-plugin-helpers';
 *
 * var moddleDescriptor = {
 *   name: 'my descriptor',
 *   uri: 'http://example.my.company.localhost/schema/my-descriptor/1.0',
 *   prefix: 'mydesc',
 *
 *   ...
 * };
 *
 * registerDmnJSModdleExtension(moddleDescriptor);
 */
function registerDmnJSModdleExtension(descriptor) {
  registerClientPlugin(descriptor, 'dmn.modeler.moddleExtension');
}

/**
 * Validate and register a cloud specific dmn-moddle extension plugin.
 *
 * @param {Object} descriptor
 *
 * @example
 * import {
 *   registerCloudDmnJSModdleExtension
 * } from 'camunda-modeler-plugin-helpers';
 *
 * var moddleDescriptor = {
 *   name: 'my descriptor',
 *   uri: 'http://example.my.company.localhost/schema/my-descriptor/1.0',
 *   prefix: 'mydesc',
 *
 *   ...
 * };
 *
 * registerCloudDmnJSModdleExtension(moddleDescriptor);
 */
function registerCloudDmnJSModdleExtension(descriptor) {
  registerClientPlugin(descriptor, 'dmn.cloud.modeler.moddleExtension');
}

/**
 * Validate and register a platform specific dmn-moddle extension plugin.
 *
 * @param {Object} descriptor
 *
 * @example
 * import {
 *   registerPlatformDmnJSModdleExtension
 * } from 'camunda-modeler-plugin-helpers';
 *
 * var moddleDescriptor = {
 *   name: 'my descriptor',
 *   uri: 'http://example.my.company.localhost/schema/my-descriptor/1.0',
 *   prefix: 'mydesc',
 *
 *   ...
 * };
 *
 * registerPlatformDmnJSModdleExtension(moddleDescriptor);
 */
function registerPlatformDmnJSModdleExtension(descriptor) {
  registerClientPlugin(descriptor, 'dmn.platform.modeler.moddleExtension');
}

/**
 * Validate and register a dmn-js plugin.
 *
 * @param {Object} module
 *
 * @example
 *
 * import {
 *   registerDmnJSPlugin
 * } from 'camunda-modeler-plugin-helpers';
 *
 * const DmnJSModule = {
 *   __init__: [ 'myService' ],
 *   myService: [ 'type', ... ]
 * };
 *
 * registerDmnJSPlugin(DmnJSModule, [ 'drd', 'literalExpression' ]);
 * registerDmnJSPlugin(DmnJSModule, 'drd')
 */
function registerDmnJSPlugin(module, components) {

  if (!Array.isArray(components)) {
    components = [ components ]
  }

  components.forEach(c => registerClientPlugin(module, `dmn.modeler.${c}.additionalModules`));
}

/**
 * Validate and register a cloud specific dmn-js plugin.
 *
 * @param {Object} module
 *
 * @example
 *
 * import {
 *   registerCloudDmnJSPlugin
 * } from 'camunda-modeler-plugin-helpers';
 *
 * const DmnJSModule = {
 *   __init__: [ 'myService' ],
 *   myService: [ 'type', ... ]
 * };
 *
 * registerCloudDmnJSPlugin(DmnJSModule, [ 'drd', 'literalExpression' ]);
 * registerCloudDmnJSPlugin(DmnJSModule, 'drd')
 */
function registerCloudDmnJSPlugin(module, components) {

  if (!Array.isArray(components)) {
    components = [ components ]
  }

  components.forEach(c => registerClientPlugin(module, `dmn.cloud.modeler.${c}.additionalModules`));
}

/**
 * Validate and register a platform specific dmn-js plugin.
 *
 * @param {Object} module
 *
 * @example
 *
 * import {
 *   registerPlatformDmnJSPlugin
 * } from 'camunda-modeler-plugin-helpers';
 *
 * const DmnJSModule = {
 *   __init__: [ 'myService' ],
 *   myService: [ 'type', ... ]
 * };
 *
 * registerPlatformDmnJSPlugin(DmnJSModule, [ 'drd', 'literalExpression' ]);
 * registerPlatformDmnJSPlugin(DmnJSModule, 'drd')
 */
function registerPlatformDmnJSPlugin(module, components) {

  if (!Array.isArray(components)) {
    components = [ components ]
  }

  components.forEach(c => registerClientPlugin(module, `dmn.platform.modeler.${c}.additionalModules`));
}

/**
 * Return the modeler directory, as a string.
 *
 * @deprecated Will be removed in future Camunda Modeler versions without replacement.
 *
 * @return {String}
 */
function getModelerDirectory() {
  return window.getModelerDirectory();
}

/**
 * Return the modeler plugin directory, as a string.
 *
 * @deprecated Will be removed in future Camunda Modeler versions without replacement.
 *
 * @return {String}
 */
function getPluginsDirectory() {
  return window.getPluginsDirectory();
}

/***/ },

/***/ "./node_modules/camunda-modeler-plugin-helpers/vendor/@bpmn-io/properties-panel/preact/hooks.js"
/*!******************************************************************************************************!*\
  !*** ./node_modules/camunda-modeler-plugin-helpers/vendor/@bpmn-io/properties-panel/preact/hooks.js ***!
  \******************************************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

const { returnOrThrow } = __webpack_require__(/*! ../../../../helper.js */ "./node_modules/camunda-modeler-plugin-helpers/helper.js");

module.exports = returnOrThrow(() => window.vendor?.propertiesPanel?.preact?.hooks, '5.0.0');


/***/ },

/***/ "./node_modules/camunda-modeler-plugin-helpers/vendor/@bpmn-io/properties-panel/preact/index.js"
/*!******************************************************************************************************!*\
  !*** ./node_modules/camunda-modeler-plugin-helpers/vendor/@bpmn-io/properties-panel/preact/index.js ***!
  \******************************************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

const { returnOrThrow } = __webpack_require__(/*! ../../../../helper.js */ "./node_modules/camunda-modeler-plugin-helpers/helper.js");

module.exports = returnOrThrow(() => window.vendor?.propertiesPanel?.preact?.root, '5.0.0');


/***/ },

/***/ "./node_modules/camunda-modeler-plugin-helpers/vendor/@bpmn-io/properties-panel/preact/jsx-runtime.js"
/*!************************************************************************************************************!*\
  !*** ./node_modules/camunda-modeler-plugin-helpers/vendor/@bpmn-io/properties-panel/preact/jsx-runtime.js ***!
  \************************************************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

const { returnOrThrow } = __webpack_require__(/*! ../../../../helper.js */ "./node_modules/camunda-modeler-plugin-helpers/helper.js");

module.exports = returnOrThrow(() => window.vendor?.propertiesPanel?.preact?.jsxRuntime, '5.0.0');


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var camunda_modeler_plugin_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! camunda-modeler-plugin-helpers */ "./node_modules/camunda-modeler-plugin-helpers/index.js");
/* harmony import */ var _ResourceSuggestPlugin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ResourceSuggestPlugin */ "./src/ResourceSuggestPlugin.js");


(0,camunda_modeler_plugin_helpers__WEBPACK_IMPORTED_MODULE_0__.registerClientExtension)(_ResourceSuggestPlugin__WEBPACK_IMPORTED_MODULE_1__["default"]);
})();

/******/ })()
;
//# sourceMappingURL=client.js.map