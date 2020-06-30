const path = require('path');
const glob = require('glob');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');

module.exports = {
  devtool: 'source-map',
  mode: 'development',
  entry: {
    app: ['./js/app.js'],
    'password-strength': ['./js/password-strength.js'].concat(
      glob.sync('./vendor/**/*.js'),
    ),
  },
  output: {
    path: path.resolve(__dirname, '..', 'priv', 'static'),
    filename: 'js/[name].js',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'static'),
          to: path.resolve(__dirname, '..', 'priv', 'static'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      allChunks: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(jpg|jpeg|gif|png)$/,
        exclude: [nodeModulesPath],
        loader: 'file-loader',
      },
      {
        test: /\.(woff2?|ttf|eot|svg)(\?[a-z0-9\=\.]+)?$/,
        exclude: [nodeModulesPath],
        loader: 'file-loader',
      },
    ],
  },
};
