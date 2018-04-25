const cwd = process.cwd();
const path = require('path');
const fs = require('fs');
const config = require('config');
const md5File = require('md5-file');
// const glob = require('glob');
const jsonFormat = require('json-format');
const sass = require('node-sass');

// Manifests
const cssMap = {};
const imageManifest = require(path.join(cwd, config.assets.path, 'images.json'));

// Get all page directories
const { entries } = config.sass;

// Create compiled SASS -> CSS
Object.keys(entries).forEach((entryKey) => {
  const sassFileName = entryKey;
  const sassFilePath = entries[entryKey];
  let fileContents;

  // MD5 filename
  const fileHash = config.isProd ?
    md5File.sync(path.join(cwd, sassFilePath)) :
    sassFileName;

  // Compile the sass files
  const compiledSass = sass.renderSync({
    file: path.join(cwd, sassFilePath),
    outFile: path.join(cwd, config.output.path.css, `${fileHash}.css`),
    outputStyle: config.isProd ? 'compressed' : 'nested',
    includePaths: ['src/styles'],
    sourceComments: !config.isProd,
    sourceMap: !config.isProd,
  });

  // Replace CSS image paths and create the CSS file
  Object.keys(imageManifest).forEach((key) => {
    const cssContents = compiledSass.css.toString();
    const parsedContents = cssContents.replace(key, imageManifest[key]);

    if (RegExp(key).test(cssContents)) {
      fileContents = parsedContents;
    }
  });

  // Add keys and values to CSS manifest
  cssMap[sassFileName] = `/css/${fileHash}.css`;

  // Write parsed sass contents to a css file
  fs.writeFileSync(
    path.join(cwd, config.output.path.css, `${fileHash}.css`),
    fileContents || compiledSass.css,
  );
});

// Create CSS manifest map file
fs.writeFileSync(
  path.join(cwd, config.assets.path, 'css.json'),
  jsonFormat(cssMap, { type: 'space', size: 2 }),
);
