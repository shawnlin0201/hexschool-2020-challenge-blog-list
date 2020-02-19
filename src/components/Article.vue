<template>
  <span class="article-wrapper">
    <a class="article-card" :href="blogUrl" target="_blank">
      <div class="card-header">{{ title }}</div>
      <div class="card-body"></div>
      <div class="card-footer">
        <span class="info-author">{{ author || '匿名工程師' }}</span>
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
  width:360px;
  margin:12px 12px;
  font-family: '微軟正黑體';
  font-weight: bold;
  font-size:15px;
  transition: 0.3s;
  background:white;
  box-shadow: 0 2px 4px 0 #00000090;
  border-radius: 4px;
  overflow: hidden;
  &:hover {
    box-shadow: 0 4px 8px 0 #00000090;
  }
  .card-header {
    padding: 12px;
    color: #212529;
  }
  .card-footer {
    display: flex;
    padding: 12px 12px;
    justify-content:space-between;
    transition: 0.3s;
    overflow: hidden;
  }
  .info-author {
    margin-right: 12px;
    font-size:14px;
  }
  .info-update {
    font-size:14px;
  }
}
</style>
