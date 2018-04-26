module.exports = {
  isProd: process.env.NODE_ENV === 'production',
  hbs: {
    partialsDir: 'src/partials',
    helpersDir: 'src/helpers',
  },
  assets: {
    path: 'src/assets',
  },
  pages: {
    path: 'src/pages',
  },
  sass: {
    entries: {
      styles: 'node_modules/jumpstart-css/styles.scss',
      index: 'src/pages/index/index.scss',
      about: 'src/pages/about/about.scss',
    },
  },
  output: {
    path: {
      public: '/public',
      js: '/public/js',
      css: '/public/css',
      images: '/public/images',
    },
  },
};
