<template>
  <span class="article-wrapper">
    <a class="article-card" :href="blogUrl" target="_blank">
      <div class="card-header">{{ title }}</div>
      <div class="card-body"></div>
      <div class="card-footer">
        <span class="info-author">{{ author || '無名' }}</span>
        <span class="info-update">{{ updateTime }}</span>
      </div>
    </a>
  </span>
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
.article-card {
  display:inline-block;
  margin:12px 12px;
  font-family: '微軟正黑體';
  font-weight: bold;
  transition: 0.3s;
  box-shadow: 0 4px 4px 0 #00000080;
  border-radius: 4px;
  overflow: hidden;
  &:hover {
    box-shadow: 0 8px 12px 0 #00000080;
    .card-footer {
      display: flex;
      padding: 12px 12px;
      max-height: 200px;
    }
  }
  .card-header {
    background:#69F0AE;
    padding: 12px;
    color: #212529;
  }
  .card-footer {
    display: flex;
    padding: 0 12px;
    justify-content:space-between;
    max-height:0;
    transition: 0.3s;
    overflow: hidden;
  }
}
</style>
