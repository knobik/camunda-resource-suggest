import { render as preactRender } from '@bpmn-io/properties-panel/preact';
import { useState, useEffect, useRef, useCallback } from '@bpmn-io/properties-panel/preact/hooks';
import { RESOURCE_TYPES } from './ResourceScanner';

const OPEN_ICON = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M9 1h6v6M15 1L8 8M13 9v5a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1h5" />
  </svg>
);

const CLEAR_ICON = () => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M2 2l8 8M10 2l-8 8" />
  </svg>
);

const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype, 'value'
).set;

function syncToOriginal(originalInput, value) {
  nativeInputValueSetter.call(originalInput, value);
  originalInput.dispatchEvent(new Event('input', { bubbles: true }));
  originalInput.dispatchEvent(new Event('change', { bubbles: true }));
}

function Combobox({ originalInput, resources, config }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(originalInput.value || '');
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const mouseOverDropdownRef = useRef(false);

  const isMessage = config.resourceType === RESOURCE_TYPES.BPMN_MESSAGE;
  const trimmed = searchValue.trim();

  const query = trimmed.toLowerCase();
  const filteredResources = resources.filter(r => {
    if (!query) return true;
    return r.name.toLowerCase().includes(query) ||
           r.id.toLowerCase().includes(query) ||
           r.filePath.toLowerCase().includes(query);
  });

  const matchedResource = trimmed
    ? resources.find(r => isMessage ? r.name === trimmed : r.id === trimmed) || null
    : null;

  const hasValue = trimmed.length > 0;
  const hasOpenAction = matchedResource && matchedResource.absolutePath && config.triggerAction;

  let buttonCount = 1;
  if (hasValue) buttonCount++;
  if (hasOpenAction) buttonCount++;

  const searchValueRef = useRef(searchValue);
  searchValueRef.current = searchValue;

  const open = useCallback(() => {
    setIsOpen(true);
    setHighlightIndex(-1);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const commitValue = useCallback(() => {
    const value = searchValueRef.current.trim();
    if (value !== originalInput.value) {
      syncToOriginal(originalInput, value);
    }
  }, [originalInput]);

  const selectResource = useCallback((resource) => {
    const value = isMessage ? resource.name : resource.id;
    setSearchValue(value);
    syncToOriginal(originalInput, value);
  }, [isMessage, originalInput]);

  // Close on outside click — uses stable refs to avoid re-registering per keystroke
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        commitValue();
        close();
      }
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, [isOpen, commitValue, close]);

  const onSearchInput = (e) => {
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

  const onSearchKeyDown = (e) => {
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

  const onToggleClick = (e) => {
    e.preventDefault();
    if (isOpen) {
      close();
    } else {
      searchInputRef.current?.focus();
      open();
    }
  };

  const onClear = (e) => {
    e.preventDefault();
    setSearchValue('');
    syncToOriginal(originalInput, '');
    searchInputRef.current?.focus();
  };

  const onOpenCurrent = (e) => {
    e.preventDefault();
    if (hasOpenAction) {
      config.triggerAction('open-diagram', { path: matchedResource.absolutePath });
      searchInputRef.current?.focus();
    }
  };

  const onDropdownMouseDown = (e) => {
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
      config.triggerAction('open-diagram', { path: resource.absolutePath });
    } else {
      selectResource(resource);
    }
    close();
    searchInputRef.current?.focus();
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightIndex >= 0 && dropdownRef.current) {
      const items = dropdownRef.current.querySelectorAll('.rs-combobox-item');
      if (items[highlightIndex]) {
        items[highlightIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightIndex]);

  const hasTriggerAction = !!config.triggerAction;

  return (
    <div
      ref={wrapperRef}
      class={'rs-combobox-wrapper' + (isOpen ? ' rs-combobox-open' : '')}
    >
      <input
        ref={searchInputRef}
        type="text"
        class="bio-properties-panel-input rs-combobox-input"
        placeholder={config.label || 'Search...'}
        value={searchValue}
        onInput={onSearchInput}
        onFocus={onSearchFocus}
        onBlur={onSearchBlur}
        onKeyDown={onSearchKeyDown}
        style={{ paddingRight: (buttonCount * 22 + 2) + 'px' }}
      />
      <div class="rs-combobox-actions" onMouseDown={(e) => e.preventDefault()}>
        {hasValue && (
          <button type="button" class="rs-combobox-clear" title="Clear value" onMouseDown={onClear}>
            <CLEAR_ICON />
          </button>
        )}
        {hasOpenAction && (
          <button type="button" class="rs-combobox-open-current" title="Open in modeler" onMouseDown={onOpenCurrent}>
            <OPEN_ICON />
          </button>
        )}
        <button type="button" class="rs-combobox-toggle" onMouseDown={onToggleClick}>
          {'▾'}
        </button>
      </div>
      {isOpen && (
        <div
          ref={dropdownRef}
          class="rs-combobox-dropdown"
          onMouseDown={onDropdownMouseDown}
        >
          {filteredResources.length === 0 ? (
            <div class="rs-combobox-empty">
              {resources.length === 0 ? (
                <a
                  href="#"
                  class="rs-combobox-settings-link"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (config.triggerAction) {
                      config.triggerAction('emit-event', { type: 'app.settings-open' });
                    }
                    close();
                  }}
                >
                  Configure a resource directory in Settings
                </a>
              ) : 'No matching resources found'}
            </div>
          ) : (
            filteredResources.map((resource, index) => (
              <div
                key={resource.type + ':' + resource.id + ':' + resource.filePath}
                class={'rs-combobox-item' + (index === highlightIndex ? ' rs-combobox-item--highlighted' : '')}
                onClick={(e) => onItemClick(index, e)}
                onMouseEnter={() => setHighlightIndex(index)}
              >
                <div class="rs-combobox-item-content">
                  <div class="rs-combobox-item-primary">{resource.name} ({resource.id})</div>
                  <div class="rs-combobox-item-secondary">{resource.filePath}</div>
                </div>
                {resource.absolutePath && hasTriggerAction && (
                  <button type="button" class="rs-combobox-item-open" title="Open in modeler">
                    <OPEN_ICON />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// --- Public API matching the old class interface ---

export default class ComboboxRenderer {

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
    preactRender(null, this._wrapper);
    if (this._wrapper.parentNode) {
      this._wrapper.parentNode.removeChild(this._wrapper);
    }
    this._originalInput.style.display = '';
    this._originalInput.removeAttribute('data-resource-suggest');
  }

  _render() {
    preactRender(
      <Combobox
        originalInput={this._originalInput}
        resources={this._resources}
        config={this._config}
      />,
      this._wrapper
    );
  }
}
