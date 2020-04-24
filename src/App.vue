<template>
  <div id="app-wrapper">
    <Main
    :appVersion='appVersion'
    @showNotice="() => isLightBoxOpen = !isLightBoxOpen"
    />
    <Lightbox :title="`${appVersion} 版本更新內容`" :isLightBoxOpen="isLightBoxOpen" @closeLightbox="() => isLightBoxOpen = false">
      <template slot="content">
        新增 Mobile 版型（AWD)
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
      appVersion: '1.0.2',
      isLightBoxOpen: false
    }
  },
  mounted () {
    this.checkAppVersion()
  },
  methods: {
    checkAppVersion () {
      const clientVersion = this.getClientAppVersion()
      if (clientVersion !== this.appVersion) {
        this.uploadAppVersion()
      }
    },
    getClientAppVersion () {
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
html, body {
  background: #69F0AE;
  height:100%;
}
#app-wrapper {
  height:100%;
}
</style>
