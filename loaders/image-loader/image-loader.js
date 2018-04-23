const cwd = process.cwd();
const path = require('path');
const fs = require('fs');
const config = require('config');
const md5File = require('md5-file');
const glob = require('glob');
const Svgo = require('svgo');
const jsonFormat = require('json-format');

const imagesPath = config.output.path.images;
const publicPath = config.output.path.public;

// Image manifest
const imageMap = {};

// Find all images and get their absolute paths
const imagePaths = glob.sync('**/@(*.jpg|*.png|*.svg)', {
  cwd: path.join(cwd, config.pages.path),
  realpath: true,
});

// Copy all found images to public images folder
imagePaths.forEach((originalPath) => {
  const splitPath = originalPath.split('/');
  const splitFilename = splitPath[splitPath.length - 1].split('.');

  // MD5 filename
  const imageName = splitFilename[0];
  const imageExt = splitFilename[1];
  const imageHash = config.isProd ? md5File.sync(originalPath) : imageName;

  // Add keys and values to images manifest
  imageMap[`images/${imageName}.${imageExt}`] = `/images/${imageHash}.${imageExt}`;

  if (config.isProd) {
    const svgData = fs.readFileSync(originalPath, 'utf8');
    const svgo = new Svgo();

    // Optimize svg images with compression and write/copy files
    svgo.optimize(svgData, { path: originalPath }).then((result) => {
      fs.writeFileSync(path.join(cwd, imagesPath, `/${imageHash}.${imageExt}`), result.data);
    });
  } else {
    fs.copyFileSync(originalPath, path.join(cwd, imagesPath, `/${imageHash}.${imageExt}`));
  }
});

// Copy favicon
fs.copyFileSync(
  path.join(cwd, 'src/favicon.ico'),
  path.join(cwd, publicPath, '/favicon.ico'),
);

// Create image manifest map file
fs.writeFileSync(
  path.join(cwd, config.assets.path, 'images.json'),
  jsonFormat(imageMap, { type: 'space', size: 2 }),
);
