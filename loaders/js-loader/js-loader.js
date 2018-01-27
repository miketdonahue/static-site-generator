const cwd = process.cwd();
const path = require('path');
const fs = require('fs');
const config = require('config');
const md5File = require('md5-file');
const glob = require('glob');
const browserify = require('browserify');
const jsonFormat = require('json-format');
const uglify = require('uglify-js');

// Javascript manifest
const jsMap = {};

// Get all page directories
const pageDirs = fs.readdirSync(path.join(cwd, config.pages.path));

pageDirs.forEach((dir) => {
  const jsFileNames = glob.sync('**/*.js', { cwd: path.join(cwd, config.pages.path, dir) });

  jsFileNames.forEach((jsFileName) => {
    const fileName = jsFileName.split('.')[0];

    if (fileName === dir) {
      const filePath = path.join(cwd, config.pages.path, dir, jsFileName);
      const fileHash = config.isProd ?
        md5File.sync(path.join(cwd, config.pages.path, dir, jsFileName)) :
        fileName;

      // Add keys and values to Javascript manifest
      jsMap[fileName] = `/js/${fileHash}.js`;

      // Ready for browser and write to file
      const publicFilePath = path.join(cwd, config.output.path.public, `/js/${fileHash}.js`);

      browserify(filePath, { debug: !config.isProd })
        .transform('babelify', { presets: ['env'], sourceMapsAbsolute: true })
        .bundle()
        .pipe(fs.createWriteStream(publicFilePath).on('finish', () => {
          if (config.isProd) {
            const code = fs.readFileSync(publicFilePath, 'utf8');

            // Uglify if production
            fs.writeFileSync(publicFilePath, uglify.minify(code).code);
          }
        }));
    }
  });
});

// Create Javascript manifest map file
fs.writeFileSync(
  path.join(cwd, config.assets.path, 'js.json'),
  jsonFormat(jsMap, { type: 'space', size: 4 }),
);
