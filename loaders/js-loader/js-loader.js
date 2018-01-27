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

// Find all javascript files and get their absolute paths
const jsPaths = glob.sync(`${config.pages.path}/**/*.js`, {
  cwd: path.join(cwd),
  ignore: '**/context.js',
  realpath: true,
});

jsPaths.forEach((filePath) => {
  const splitPath = filePath.split('/');
  const splitFilename = splitPath[splitPath.length - 1].split('.');

  // MD5 filename
  const fileName = splitFilename[0];
  const fileHash = config.isProd ? md5File.sync(filePath) : fileName;

  // Add keys and values to Javascript manifest
  jsMap[fileName] = `/js/${fileHash}.js`;

  // Ready for browser and write to file
  const publicFilePath = path.join(cwd, config.output.path.js, `${fileHash}.js`);

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
});

// Create Javascript manifest map file
fs.writeFileSync(
  path.join(cwd, config.assets.path, 'js.json'),
  jsonFormat(jsMap, { type: 'space', size: 2 }),
);
