const cwd = process.cwd();
const path = require('path');
const fs = require('fs');
const config = require('config');
const Handlebars = require('handlebars');
const layoutHelpers = require('handlebars-layouts');
const formatHtml = require('js-beautify').html;

const helpersPath = config.hbs.helpersDir;
const partialsPath = config.hbs.partialsDir;
const publicPath = config.output.path.public;

const opts = {
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

// Compile the templates and write to output files
const pageDirs = fs.readdirSync(path.join(cwd, config.pages.path));

pageDirs.forEach((dirName) => {
  const hbsFileName = dirName;
  const hbs = fs.readFileSync(path.join(cwd, config.pages.path, dirName, `${hbsFileName}.hbs`), 'utf8');
  const template = Handlebars.compile(hbs);
  let context;

  try {
    context = require(path.join(cwd, config.pages.path, dirName, 'context.js'));
  } catch (error) {
    context = {};
  }

  if (!fs.existsSync(path.join(cwd, publicPath, dirName))) {
    if (dirName === 'index') {
      fs.writeFileSync(path.join(cwd, publicPath, 'index.html'), formatHtml(template(context), opts));
    } else {
      fs.mkdirSync(path.join(cwd, publicPath, dirName));
      fs.writeFileSync(path.join(cwd, publicPath, dirName, 'index.html'), formatHtml(template(context), opts));
    }
  }
});
