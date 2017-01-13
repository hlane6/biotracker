var webpack = require('webpack');

module.exports = {
  entry: [
    "./client/app.js"
  ],
  output: {
    path: __dirname + '/biotracker/static',
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-2']
        },
        exclude: /node_modules/
      },
    ]
  },
  plugins: [
  ]
};
