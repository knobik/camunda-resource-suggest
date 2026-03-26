const CamundaModelerWebpackPlugin = require('camunda-modeler-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'client.js'
  },
  devtool: 'cheap-module-source-map',
  resolve: {
    alias: {
      '@bpmn-io/properties-panel': 'camunda-modeler-plugin-helpers/vendor/@bpmn-io/properties-panel'
    }
  },
  plugins: [
    new CamundaModelerWebpackPlugin({
      type: 'react'
    })
  ]
};
