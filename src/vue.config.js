module.exports = {
  filenameHashing: false,
  productionSourceMap: false,
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "~@/assets/scss/app.scss";'
      }
    }
  }
}
