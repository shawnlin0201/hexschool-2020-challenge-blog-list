<template>
  <div id="app-wrapper">
    <Main/>
  </div>
</template>

<script>
import Main from '@/views/Main'

export default {
  name: 'App',
  components: {
    Main
  }
}
</script>

<style lang="scss">
@import "~@/assets/scss/app.scss";
html, body {
  background: #69F0AE;
}
</style>
