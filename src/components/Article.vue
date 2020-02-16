<template>
  <div class="article-wrapper">
    <a class="article-card" :href="blogUrl" target="_blank">
      <div class="card-header">{{ title }}</div>
      <div class="card-body"></div>
      <div class="card-footer">
        <span class="info-author">posted by: {{ author }}</span>
        <span class="info-update">{{ updateTime }}</span>
      </div>
    </a>
  </div>
</template>

<script>

export default {
  name: 'Article',
  props: [
    'author',
    'title',
    'articleUrl',
    'blogUrl',
    'updateTime'
  ],
  components: {
  }
}
</script>

<style scoped lang="scss">
.article-wrapper {
  padding: 12px;
}
</style>
