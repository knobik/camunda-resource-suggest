export const RESOURCE_TYPES = {
  DMN: 'dmn',
  BPMN_PROCESS: 'bpmn-process',
  BPMN_MESSAGE: 'bpmn-message',
  FORM: 'form'
};

export const PLUGIN_NAME = 'resource-suggest';
export const CONFIG_KEY = 'scanDirectory';

const EXTENSIONS = {
  '.bpmn': 'bpmn',
  '.dmn': 'dmn',
  '.form': 'form'
};

export default class ResourceScanner {

  constructor(scanRoot) {
    this._scanRoot = scanRoot || '';
  }

  setScanRoot(scanRoot) {
    this._scanRoot = scanRoot || '';
  }

  scan(items) {
    const resources = [];

    for (const item of items) {
      const { file } = item;

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

      if (id || (allowNameAsId && name)) {
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
    if (this._scanRoot && filePath.startsWith(this._scanRoot)) {
      let relative = filePath.substring(this._scanRoot.length);

      if (relative.startsWith('/') || relative.startsWith('\\')) {
        relative = relative.substring(1);
      }

      return relative;
    }

    return filePath;
  }
}
