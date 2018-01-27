const cwd = process.cwd();
const path = require('path');
const fs = require('fs');
const config = require('config');
const rimraf = require('rimraf');

const publicPath = config.output.path.public;

// Refresh public directory
rimraf.sync(path.join(cwd, config.output.path.public));
fs.mkdirSync(path.join(cwd, config.output.path.public));

// Refresh public images directory
rimraf.sync(path.join(cwd, publicPath, config.output.path.images));
fs.mkdirSync(path.join(cwd, publicPath, config.output.path.images));

// Refresh public css directory
rimraf.sync(path.join(cwd, publicPath, config.output.path.css));
fs.mkdirSync(path.join(cwd, publicPath, config.output.path.css));

// Refresh public javascript directory
rimraf.sync(path.join(cwd, publicPath, config.output.path.js));
fs.mkdirSync(path.join(cwd, publicPath, config.output.path.js));

// Refresh assets directory
rimraf.sync(path.join(cwd, config.assets.path));
fs.mkdirSync(path.join(cwd, config.assets.path));
