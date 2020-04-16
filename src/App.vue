<template>
  <div id="app-wrapper">
    <Main
    :appVersion='appVersion'
    @showNotice="() => isLightBoxOpen = !isLightBoxOpen"
    />
    <Lightbox :title="`${appVersion} 版本更新內容`" :isLightBoxOpen="isLightBoxOpen" @closeLightbox="() => isLightBoxOpen = false">
      <template slot="content">
        正式版 Release！<br>
        新增版本資訊按鈕。
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
      appVersion: '1.0.0',
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
