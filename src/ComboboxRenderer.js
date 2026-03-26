import { RESOURCE_TYPES } from './ResourceScanner';

const OPEN_ICON_SVG = '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 1h6v6M15 1L8 8M13 9v5a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1h5"/></svg>';
const CLEAR_ICON_SVG = '<svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 2l8 8M10 2l-8 8"/></svg>';

const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype, 'value'
).set;

export default class ComboboxRenderer {

  constructor(originalInput, resources, config) {
    this._originalInput = originalInput;
    this._resources = resources;
    this._config = config;
    this._isOpen = false;
    this._highlightIndex = -1;
    this._filteredResources = [];
    this._currentMatchedPath = null;
    this._mouseOverDropdown = false;
    this._visibleButtonCount = 1;

    this._build();
    this._attachEvents();
    this._syncFromOriginal();
  }

  get resourceType() {
    return this._config.resourceType;
  }

  updateResources(resources) {
    this._resources = resources;

    if (this._isOpen) {
      this._filterAndRender();
    }

    this._updateActionButtons();
  }

  destroy() {
    this._detachEvents();

    if (this._wrapper && this._wrapper.parentNode) {
      this._wrapper.parentNode.removeChild(this._wrapper);
    }

    this._originalInput.style.display = '';
    this._originalInput.removeAttribute('data-resource-suggest');
  }

  _build() {
    this._originalInput.style.display = 'none';
    this._originalInput.setAttribute('data-resource-suggest', 'true');

    this._wrapper = document.createElement('div');
    this._wrapper.className = 'rs-combobox-wrapper';

    this._searchInput = document.createElement('input');
    this._searchInput.type = 'text';
    this._searchInput.className = 'bio-properties-panel-input rs-combobox-input';
    this._searchInput.placeholder = this._config.label || 'Search...';

    this._toggleBtn = document.createElement('button');
    this._toggleBtn.type = 'button';
    this._toggleBtn.className = 'rs-combobox-toggle';
    this._toggleBtn.textContent = '▾';

    this._clearBtn = document.createElement('button');
    this._clearBtn.type = 'button';
    this._clearBtn.className = 'rs-combobox-clear';
    this._clearBtn.title = 'Clear value';
    this._clearBtn.innerHTML = CLEAR_ICON_SVG;
    this._clearBtn.style.display = 'none';

    this._openCurrentBtn = document.createElement('button');
    this._openCurrentBtn.type = 'button';
    this._openCurrentBtn.className = 'rs-combobox-open-current';
    this._openCurrentBtn.title = 'Open in modeler';
    this._openCurrentBtn.innerHTML = OPEN_ICON_SVG;
    this._openCurrentBtn.style.display = 'none';

    this._dropdown = document.createElement('div');
    this._dropdown.className = 'rs-combobox-dropdown';
    this._dropdown.style.display = 'none';

    this._actions = document.createElement('div');
    this._actions.className = 'rs-combobox-actions';
    this._actions.appendChild(this._clearBtn);
    this._actions.appendChild(this._openCurrentBtn);
    this._actions.appendChild(this._toggleBtn);

    this._wrapper.appendChild(this._searchInput);
    this._wrapper.appendChild(this._actions);
    this._wrapper.appendChild(this._dropdown);

    this._originalInput.parentNode.insertBefore(this._wrapper, this._originalInput.nextSibling);
  }

  _attachEvents() {
    this._onSearchInput = this._onSearchInput.bind(this);
    this._onSearchKeyDown = this._onSearchKeyDown.bind(this);
    this._onSearchFocus = this._onSearchFocus.bind(this);
    this._onSearchBlur = this._onSearchBlur.bind(this);
    this._onToggleClick = this._onToggleClick.bind(this);
    this._onDocumentClick = this._onDocumentClick.bind(this);
    this._onActionsMouseDown = this._onActionsMouseDown.bind(this);
    this._onDropdownMouseDown = this._onDropdownMouseDown.bind(this);
    this._onDropdownClick = this._onDropdownClick.bind(this);

    this._searchInput.addEventListener('input', this._onSearchInput);
    this._searchInput.addEventListener('keydown', this._onSearchKeyDown);
    this._searchInput.addEventListener('focus', this._onSearchFocus);
    this._searchInput.addEventListener('blur', this._onSearchBlur);
    this._toggleBtn.addEventListener('mousedown', this._onToggleClick);
    this._actions.addEventListener('mousedown', this._onActionsMouseDown);
    this._dropdown.addEventListener('mousedown', this._onDropdownMouseDown);
    this._dropdown.addEventListener('click', this._onDropdownClick);
    document.addEventListener('click', this._onDocumentClick, true);
  }

  _detachEvents() {
    this._searchInput.removeEventListener('input', this._onSearchInput);
    this._searchInput.removeEventListener('keydown', this._onSearchKeyDown);
    this._searchInput.removeEventListener('focus', this._onSearchFocus);
    this._searchInput.removeEventListener('blur', this._onSearchBlur);
    this._toggleBtn.removeEventListener('mousedown', this._onToggleClick);
    this._actions.removeEventListener('mousedown', this._onActionsMouseDown);
    this._dropdown.removeEventListener('mousedown', this._onDropdownMouseDown);
    this._dropdown.removeEventListener('click', this._onDropdownClick);
    document.removeEventListener('click', this._onDocumentClick, true);
  }

  _syncFromOriginal() {
    this._searchInput.value = this._originalInput.value || '';
    this._updateActionButtons();
  }

  _findMatchingResource(value) {
    if (!value) return null;

    const isMessage = this._config.resourceType === RESOURCE_TYPES.BPMN_MESSAGE;

    return this._resources.find(r =>
      isMessage ? r.name === value : r.id === value
    ) || null;
  }

  _updateActionButtons() {
    const value = this._searchInput.value.trim();
    const match = this._findMatchingResource(value);

    this._clearBtn.style.display = value ? '' : 'none';

    if (match && match.absolutePath && this._config.triggerAction) {
      this._openCurrentBtn.style.display = '';
      this._currentMatchedPath = match.absolutePath;
    } else {
      this._openCurrentBtn.style.display = 'none';
      this._currentMatchedPath = null;
    }

    let count = 1;
    if (value) count++;
    if (this._currentMatchedPath) count++;

    if (count !== this._visibleButtonCount) {
      this._visibleButtonCount = count;
      this._searchInput.style.paddingRight = (count * 22 + 2) + 'px';
    }
  }

  // Prevents blur when clicking any action button (clear, open, toggle)
  _onActionsMouseDown(e) {
    e.preventDefault();

    const clearBtn = e.target.closest('.rs-combobox-clear');
    const openBtn = e.target.closest('.rs-combobox-open-current');

    if (clearBtn) {
      this._searchInput.value = '';
      this._syncToOriginal('');
      this._updateActionButtons();
      this._searchInput.focus();
      return;
    }

    if (openBtn && this._currentMatchedPath && this._config.triggerAction) {
      this._config.triggerAction('open-diagram', { path: this._currentMatchedPath });
      this._searchInput.focus();
      return;
    }
  }

  _syncToOriginal(value) {
    nativeInputValueSetter.call(this._originalInput, value);

    this._originalInput.dispatchEvent(new Event('input', { bubbles: true }));
    this._originalInput.dispatchEvent(new Event('change', { bubbles: true }));
  }

  _onSearchInput() {
    this._filterAndRender();

    if (!this._isOpen) {
      this._open();
    }
  }

  _onSearchFocus() {
    this._open();
  }

  _onSearchBlur() {
    setTimeout(() => {
      if (this._mouseOverDropdown) {
        this._searchInput.focus();
        return;
      }

      if (!this._wrapper.contains(document.activeElement)) {
        this._commitValue();
        this._close();
      }
    }, 150);
  }

  _onDropdownMouseDown(e) {
    e.preventDefault();
    this._mouseOverDropdown = true;

    const onUp = () => {
      this._mouseOverDropdown = false;
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mouseup', onUp);
  }

  // Event delegation for dropdown item clicks
  _onDropdownClick(e) {
    const itemEl = e.target.closest('.rs-combobox-item');
    if (!itemEl) return;

    const index = Array.from(this._dropdown.children).indexOf(itemEl);
    if (index < 0 || index >= this._filteredResources.length) return;

    const resource = this._filteredResources[index];
    const openBtn = e.target.closest('.rs-combobox-item-open');

    if (openBtn && resource.absolutePath && this._config.triggerAction) {
      this._config.triggerAction('open-diagram', { path: resource.absolutePath });
    } else {
      this._selectResource(resource);
    }

    this._close();
    this._searchInput.focus();
  }

  _onToggleClick(e) {
    e.preventDefault();

    if (this._isOpen) {
      this._close();
    } else {
      this._searchInput.focus();
      this._open();
    }
  }

  _onDocumentClick(e) {
    if (this._isOpen && !this._wrapper.contains(e.target)) {
      this._commitValue();
      this._close();
    }
  }

  _onSearchKeyDown(e) {
    switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();

      if (!this._isOpen) {
        this._open();
      } else {
        this._highlightIndex = Math.min(this._highlightIndex + 1, this._filteredResources.length - 1);
        this._updateHighlight();
      }
      break;

    case 'ArrowUp':
      e.preventDefault();
      this._highlightIndex = Math.max(this._highlightIndex - 1, 0);
      this._updateHighlight();
      break;

    case 'Enter':
      e.preventDefault();

      if (this._isOpen && this._highlightIndex >= 0 && this._highlightIndex < this._filteredResources.length) {
        this._selectResource(this._filteredResources[this._highlightIndex]);
      } else {
        this._commitValue();
      }

      this._close();
      break;

    case 'Escape':
      e.preventDefault();
      this._syncFromOriginal();
      this._close();
      break;
    }
  }

  _open() {
    if (this._isOpen) return;

    this._isOpen = true;
    this._highlightIndex = -1;
    this._filterAndRender();
    this._dropdown.style.display = '';
    this._wrapper.classList.add('rs-combobox-open');
  }

  _close() {
    if (!this._isOpen) return;

    this._isOpen = false;
    this._dropdown.style.display = 'none';
    this._wrapper.classList.remove('rs-combobox-open');
  }

  _commitValue() {
    const value = this._searchInput.value.trim();

    if (value !== this._originalInput.value) {
      this._syncToOriginal(value);
    }

    this._updateActionButtons();
  }

  _selectResource(resource) {
    const value = this._config.resourceType === RESOURCE_TYPES.BPMN_MESSAGE ? resource.name : resource.id;

    this._searchInput.value = value;
    this._syncToOriginal(value);
    this._updateActionButtons();
  }

  _filterAndRender() {
    const query = this._searchInput.value.toLowerCase().trim();

    this._filteredResources = this._resources.filter(r => {
      if (!query) return true;

      return (
        r.name.toLowerCase().includes(query) ||
        r.id.toLowerCase().includes(query) ||
        r.filePath.toLowerCase().includes(query)
      );
    });

    this._dropdown.innerHTML = '';

    if (this._filteredResources.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'rs-combobox-empty';

      if (this._resources.length === 0) {
        const link = document.createElement('a');
        link.href = '#';
        link.className = 'rs-combobox-settings-link';
        link.textContent = 'Configure a resource directory in Settings';
        link.addEventListener('mousedown', (e) => {
          e.preventDefault();

          if (this._config.triggerAction) {
            this._config.triggerAction('emit-event', { type: 'app.settings-open' });
          }

          this._close();
        });
        empty.appendChild(link);
      } else {
        empty.textContent = 'No matching resources found';
      }

      this._dropdown.appendChild(empty);
      return;
    }

    const hasTriggerAction = !!this._config.triggerAction;

    this._filteredResources.forEach((resource, index) => {
      const item = document.createElement('div');
      item.className = 'rs-combobox-item';
      item.dataset.index = index;

      if (index === this._highlightIndex) {
        item.classList.add('rs-combobox-item--highlighted');
      }

      const contentDiv = document.createElement('div');
      contentDiv.className = 'rs-combobox-item-content';

      const primaryLine = document.createElement('div');
      primaryLine.className = 'rs-combobox-item-primary';
      primaryLine.textContent = `${resource.name} (${resource.id})`;

      const secondaryLine = document.createElement('div');
      secondaryLine.className = 'rs-combobox-item-secondary';
      secondaryLine.textContent = resource.filePath;

      contentDiv.appendChild(primaryLine);
      contentDiv.appendChild(secondaryLine);
      item.appendChild(contentDiv);

      if (resource.absolutePath && hasTriggerAction) {
        const openBtn = document.createElement('button');
        openBtn.type = 'button';
        openBtn.className = 'rs-combobox-item-open';
        openBtn.title = 'Open in modeler';
        openBtn.innerHTML = OPEN_ICON_SVG;
        item.appendChild(openBtn);
      }

      item.addEventListener('mouseenter', () => {
        this._highlightIndex = index;
        this._updateHighlight();
      });

      this._dropdown.appendChild(item);
    });
  }

  _updateHighlight() {
    const items = this._dropdown.querySelectorAll('.rs-combobox-item');

    items.forEach((item, index) => {
      item.classList.toggle('rs-combobox-item--highlighted', index === this._highlightIndex);
    });

    const highlighted = items[this._highlightIndex];

    if (highlighted) {
      highlighted.scrollIntoView({ block: 'nearest' });
    }
  }
}
