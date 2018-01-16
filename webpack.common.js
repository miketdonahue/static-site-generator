const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');

const args = process.argv[1].split('/');
const isDevServer = args[args.length - 1] === 'webpack-dev-server';

const homeContext = require('./src/pages/home/context.js');

module.exports = {
  context: __dirname,
  entry: {
    app: './src/styles/styles.scss',
    home: './src/pages/home/home.js',
    about: './src/pages/about/about.js',
  },
  output: {
    path: path.join(__dirname, 'public'),
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        use: ['eslint-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.hbs$/,
        use: [
          {
            loader: 'handlebars-loader',
            query: {
              partialDirs: [path.join(__dirname, 'src')],
              runtime: 'handlebars',
              inlineRequires: 'images',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new SimpleProgressWebpackPlugin({ format: 'minimal' }),
    new CleanWebpackPlugin(['public'], { verbose: true, dry: isDevServer }),
    new HtmlWebpackPlugin({
      title: 'Home',
      filename: 'index.html',
      template: './src/pages/home/home.hbs',
      favicon: './src/favicon.ico',
      chunks: ['app', 'home'],
      inject: false,
      chunksSortMode: 'manual',
      context: homeContext,
    }),
    new HtmlWebpackPlugin({
      title: 'About',
      filename: 'about/index.html',
      template: './src/pages/about/about.hbs',
      favicon: './src/favicon.ico',
      chunks: ['app', 'about'],
      inject: false,
      chunksSortMode: 'manual',
    }),
  ],
  resolve: {
    modules: ['node_modules', './'],
  },
  stats: {
    colors: true,
    reasons: true,
    chunks: true,
  },
};
