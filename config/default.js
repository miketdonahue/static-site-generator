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
    paths: ['src/pages/about', 'src/pages/index', 'src/styles'],
  },
  output: {
    path: {
      public: '/public',
      js: '/js',
      css: '/css',
      images: '/images',
    },
  },
};
