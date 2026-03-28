import { PLUGIN_NAME, CONFIG_KEY } from '../ResourceScanner';

// DirectoryPicker renders inside the modeler's React settings dialog.
// We can't use JSX here (webpack compiles it to Preact), so we create
// a React element via the modeler's global React and populate it with
// vanilla DOM via a ref callback.
const React = window.react;

function DirectoryPickerComponent({ getGlobal, config, onDirectoryChanged }) {
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

    const saveDirectory = async (path) => {
      input.value = path;
      await config.setForPlugin(PLUGIN_NAME, CONFIG_KEY, path);
      if (onDirectoryChanged) {
        onDirectoryChanged(path);
      }
    };

    input.addEventListener('change', (e) => saveDirectory(e.target.value));

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

    config.getForPlugin(PLUGIN_NAME, CONFIG_KEY).then((value) => {
      if (value) input.value = value;
    });
  }, []);

  return React.createElement('div', { className: 'custom-control', ref: containerRef });
}

export default function DirectoryPicker(props) {
  return React.createElement(DirectoryPickerComponent, props);
}
