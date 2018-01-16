module.exports = {
  "extends": "airbnb-base",
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 2016,
    "sourceType": "module",
  },
  "settings": {
    "import/resolver": {
      "webpack": {
        "config": "webpack.dev.js"
      }
    }
  },
  "env": {
    "es6": true,
    "browser": true,
  }
};
