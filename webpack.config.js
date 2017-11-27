const path = require('path');

// Webpack Config
const webpackConfig = {
  entry: './src/index.ts',

  devtool: 'inline-source-map',

  output: {
    publicPath: '',
    path: path.resolve(__dirname, 'dist'),
    filename: 'webpack.js',
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{ loader: 'ts-loader' }],
      }
    ]
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js']
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
