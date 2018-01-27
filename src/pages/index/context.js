const fs = require('fs');
const path = require('path');
const parseMarkdown = require('../../utils/parse-markdown');

const markdownFile = fs.readFileSync(path.join(__dirname, 'index.md'), 'utf8');

module.exports = {
  page_title: 'New Page',
  name: {
    first: 'Mike',
    last: 'Hue',
  },
  markdown: parseMarkdown(markdownFile),
};
