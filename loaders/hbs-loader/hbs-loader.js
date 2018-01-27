const cwd = process.cwd();
const path = require('path');
const fs = require('fs');
const config = require('config');
const glob = require('glob');
const mkdirp = require('mkdirp');
const Handlebars = require('handlebars');
const layoutHelpers = require('handlebars-layouts');
const formatHtml = require('js-beautify').html;

const routes = JSON.parse(fs.readFileSync(path.join(cwd, 'config/routes.json'), 'utf8'));

const helpersPath = config.hbs.helpersDir;
const partialsPath = config.hbs.partialsDir;
const publicPath = config.output.path.public;

const formatOpts = {
  indent_size: 2,
  end_with_newline: true,
  indent_inner_html: true,
  max_preserve_newlines: 1,
  extra_liners: [],
};

// Register layout helpers
Handlebars.registerHelper(layoutHelpers(Handlebars));

// Register helpers
fs.readdirSync(helpersPath).forEach((file) => {
  const name = file.split('.')[0];
  const helper = require(path.join(cwd, helpersPath, file));

  Handlebars.registerHelper(name, helper);
});

// Register partials
fs.readdirSync(partialsPath).forEach((file) => {
  const name = file.split('.')[0];
  const partial = fs.readFileSync(path.join(cwd, partialsPath, file), 'utf8');

  Handlebars.registerPartial(name, partial);
});

// Find all handlebars files and get their absolute paths
const hbsPaths = glob.sync(`${config.pages.path}/**/*.hbs`, {
  cwd: path.join(cwd),
  realpath: true,
});

hbsPaths.forEach((filePath) => {
  const splitPath = filePath.split('/');
  const splitFilename = splitPath[splitPath.length - 1].split('.');
  const fileName = splitFilename[0];
  const route = routes[fileName];

  // Construct hbs template
  const hbsContent = fs.readFileSync(path.join(filePath), 'utf8');
  const template = Handlebars.compile(hbsContent);

  // Construct hbs page context
  let context;
  try {
    context = require(path.join(path.dirname(filePath), 'context.js'));
  } catch (error) {
    context = {};
  }

  // Create full route path if it does not already exist
  mkdirp.sync(path.join(cwd, publicPath, route.path));

  // Format and create HTML file
  fs.writeFileSync(
    path.join(cwd, publicPath, route.path, `${route.url}.html`),
    formatHtml(template(context), formatOpts),
  );
});
