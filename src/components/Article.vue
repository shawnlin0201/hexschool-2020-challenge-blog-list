<template>
  <span class="card-wrapper">
    <div class="card-modal" target="_blank">
      <div class="card-header">
        <span class="info-author">{{ author || '匿名工程師' }}</span>
        <span class="info-update">{{ updateTime }}</span>
      </div>
      <div class="card-body">
        <div class="article-wrapper" v-for="(article, index) in blogList" :key="index">
          <a class="article-link"
            v-if="article.title.toLowerCase().indexOf(filter.toLowerCase()) > -1"
            target="_blank"
            :href="article.url">
            <span class="article-title">{{ article.title }}</span>
          </a>
        </div>
      </div>
      <div class="card-footer">

      </div>
    </div>
  </span>
</template>

<script>

export default {
  name: 'Article',
  props: [
    'author',
    'filter',
    'updateTime',
    'blogList'
  ],
  components: {
  }
}
</script>

<style scoped lang="scss">
.card-modal {
  display:inline-block;
  width:360px;
  box-sizing: border-box;
  margin: 12px;
  padding: 12px;
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
    display: flex;
    justify-content:space-between;
    border-bottom: 1px solid #1f1f1f;
    margin-bottom: 8px;
    padding-bottom: 4px;
    transition: 0.3s;
    overflow: hidden;
  }
  .card-body {
  }
  .card-footer {
  }
  .info-author {
    margin-right: 12px;
    font-size:14px;
  }
  .info-update {
    font-size:14px;
  }
  .article-link {
    display: block;
    background: #f1f1e1;
    margin-bottom: 8px;
    padding:4px;
    transition: 0.3s;
    &:hover {
      background: #d8d8c3;
    }
  }
}
</style>
