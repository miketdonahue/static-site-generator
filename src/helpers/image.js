const manifest = require('../assets/images.json');

module.exports = originalPath => manifest[originalPath];
