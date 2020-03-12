<template>
  <div id="app-wrapper">
    <Main
    :appVersion='appVersion'
    />
    <Lightbox :title="`${appVersion} 版本更新內容`" :isLightBoxOpen="isLightBoxOpen" @triggerLightboxOpen="() => isLightBoxOpen = false">
      <template slot="content">
        收藏功能：解決收藏功能 (<a href="https://github.com/shawnlin0201/hexschool-2020-challenge-blog-list/issues/9" noopener>#9</a>)。
      </template>
    </Lightbox>
  </div>
</template>

<script>
import Main from '@/views/Main'
import Lightbox from '@/components/Lightbox'

export default {
  name: 'App',
  components: {
    Main,
    Lightbox
  },
  data () {
    return {
      appVersion: '0.4.0',
      isUpdated: false,
      isLightBoxOpen: false
    }
  },
  mounted () {
    const localVersion = this.getAppVersion()
    if (localVersion !== this.appVersion) {
      this.uploadAppVersion()
    }
  },
  methods: {
    getAppVersion () {
      return localStorage.getItem('HexSchoolVersion') || ''
    },
    uploadAppVersion () {
      localStorage.setItem('HexSchoolVersion', this.appVersion)
      this.isLightBoxOpen = true
    }
  }
}
</script>

<style lang="scss">
@import "~@/assets/scss/app.scss";
html, body {
  background: #69F0AE;
  height:100%;
}
#app-wrapper {
  height:100%;
}
</style>
