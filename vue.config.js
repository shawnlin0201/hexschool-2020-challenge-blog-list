module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/hexschool-2020-challenge-blog-list/'
    : '/',
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "~@/assets/scss/app.scss";'
      }
    }
  }
}
