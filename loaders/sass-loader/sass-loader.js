const cwd = process.cwd();
const path = require('path');
const fs = require('fs');
const config = require('config');
const md5File = require('md5-file');
const glob = require('glob');
const jsonFormat = require('json-format');
const sass = require('node-sass');

// Manifests
const cssMap = {};
const imageManifest = require(path.join(cwd, config.assets.path, 'images.json'));

// Get all page directories
const folderPaths = config.sass.paths;

// Create compiled SASS -> CSS files with md5 name
// Add files to CSS manifest
folderPaths.forEach((dirPath) => {
  const sassFileNames = glob.sync('**/*.scss', { cwd: path.join(cwd, dirPath) });

  sassFileNames.forEach((sassFileName) => {
    const fileName = sassFileName.split('.')[0];
    const dirName = dirPath.split('/').pop();
    let fileContents;

    // Only transform main entry point file (filename same as directory name)
    if (fileName === dirName) {
      const fileHash = config.isProd ?
        md5File.sync(path.join(cwd, dirPath, sassFileName)) :
        fileName;

      const compiledSass = sass.renderSync({
        file: path.join(cwd, dirPath, sassFileName),
        outFile: path.join(cwd, config.output.path.public, `/css/${fileHash}.css`),
        outputStyle: config.isProd ? 'compressed' : 'nested',
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
      cssMap[fileName] = `/css/${fileHash}.css`;

      // Write parsed contents to file
      fs.writeFileSync(
        path.join(cwd, config.output.path.public, `/css/${fileHash}.css`),
        fileContents || compiledSass.css,
      );
    }
  });
});

// Create CSS manifest map file
fs.writeFileSync(
  path.join(cwd, config.assets.path, 'css.json'),
  jsonFormat(cssMap, { type: 'space', size: 4 }),
);
