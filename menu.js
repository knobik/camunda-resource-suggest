'use strict';

const fs = require('fs');
const nodePath = require('path');
const { app: electronApp } = require('electron');

const PLUGIN_NAME = 'resource-suggest';
const CONFIG_KEY = 'scanDirectory';
const EXTENSIONS = new Set(['.bpmn', '.dmn', '.form']);
const EVENT_TYPE = 'resource-suggest.files';

function readConfig() {
  try {
    const configPath = nodePath.join(electronApp.getPath('userData'), 'config.json');
    const raw = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(raw);
    const plugins = config.plugins || {};
    const pluginConfig = plugins[PLUGIN_NAME] || {};
    return pluginConfig[CONFIG_KEY] || null;
  } catch (err) {
    return null;
  }
}

function walkDirectory(dir) {
  const items = [];

  function walk(current) {
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch (err) {
      return;
    }

    for (const entry of entries) {
      const fullPath = nodePath.join(current, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        const ext = nodePath.extname(entry.name).toLowerCase();

        if (EXTENSIONS.has(ext)) {
          try {
            const contents = fs.readFileSync(fullPath, 'utf-8');
            items.push({ file: { path: fullPath, contents } });
          } catch (err) {
            // skip unreadable files
          }
        }
      }
    }
  }

  walk(dir);
  return items;
}

function scanAndEmit(app) {
  const directory = readConfig();

  if (!directory) {
    return;
  }

  try {
    const items = walkDirectory(directory);
    app.emit('menu:action', 'emit-event', {
      type: EVENT_TYPE,
      payload: { directory, items }
    });
  } catch (err) {
    // scan failed silently
  }
}

let initialized = false;

module.exports = function(app) {

  if (!initialized) {
    initialized = true;

    app.on('app:client-ready', () => {
      // Delay to let the renderer plugin finish mounting
      setTimeout(() => scanAndEmit(app), 1000);
    });
  }

  return [
    {
      label: 'Rescan Resources',
      action: function() {
        scanAndEmit(app);
      }
    }
  ];
};
