import React, { useState, useEffect } from 'react';

import { PLUGIN_NAME, CONFIG_KEY } from '../ResourceScanner';

export default function DirectoryPicker({ getGlobal, config, onDirectoryChanged }) {

  const [ currentPath, setCurrentPath ] = useState('');

  useEffect(() => {
    config.getForPlugin(PLUGIN_NAME, CONFIG_KEY).then((value) => {
      if (value) {
        setCurrentPath(value);
      }
    });
  }, []);

  const saveDirectory = async (path) => {
    setCurrentPath(path);
    await config.setForPlugin(PLUGIN_NAME, CONFIG_KEY, path);

    if (onDirectoryChanged) {
      onDirectoryChanged(path);
    }
  };

  const handleChange = (event) => {
    saveDirectory(event.target.value);
  };

  const handleBrowse = async () => {
    const dialog = getGlobal('dialog');

    const result = await dialog.showOpenFilesDialog({
      properties: [ 'openDirectory' ],
      title: 'Select resource directory'
    });

    const directoryPath = result && result[0];

    if (!directoryPath) {
      return;
    }

    saveDirectory(directoryPath);
  };

  return (
    <div className="custom-control">
      <div className="custom-control-description">
        Directory to scan for BPMN, DMN, and Form files.
      </div>
      <div style={ { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' } }>
        <input
          type="text"
          className="bio-properties-panel-input"
          value={ currentPath }
          placeholder="No directory selected"
          onChange={ handleChange }
          style={ { flex: 1 } }
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={ handleBrowse }
        >
          Browse...
        </button>
      </div>
    </div>
  );
}
