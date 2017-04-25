const webpack = require('webpack');
const path = require('path');

// Webpack Config
const webpackConfig = {
  entry: {
    main: './src/index.js',
  },

  output: {
    publicPath: '',
    path: path.resolve(__dirname, './dist'),
  },

  plugins: [
  ],

  module: {
  },

  node: {
  //  global: true,
  //  crypto: 'empty',
  //  __dirname: true,
  //  __filename: true,
  //  process: true,
  // setImmediate: false,
  //  clearImmediate: false,
    fs: 'empty',
    Buffer: true,
    net: 'empty',
    tls: 'empty',
  },
};

module.exports = webpackConfig;
