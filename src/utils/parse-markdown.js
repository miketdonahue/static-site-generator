const markdown = require('markdown-it')('commonmark');
const formatHtml = require('js-beautify').html;

const parseMarkdown = contents => (
  formatHtml(markdown.render(contents), { end_with_newline: false })
);

module.exports = parseMarkdown;
