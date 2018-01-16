const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const cssNext = require('postcss-cssnext');

module.exports = merge(common, {
  devtool: 'cheap-eval-source-map',
  output: {
    filename: 'js/[name].js',
    pathinfo: true,
  },
  devServer: {
    contentBase: ['/public'],
    port: 8080,
    historyApiFallback: true,
    watchContentBase: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                ident: 'postcss',
                plugins: () => [
                  cssNext(),
                ],
              },
            },
            { loader: 'sass-loader', options: { sourceMap: true } },
          ],
          fallback: 'style-loader',
        }),
      },
      {
        test: /\.(png|jpg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
              publicPath: '/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new ExtractTextPlugin('css/[name].css'),
  ],
});
