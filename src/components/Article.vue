<template>
  <span class="card-wrapper">
    <div class="card-modal" target="_blank" >
      <div class="card-header">
        <span class="info-author">{{ author || '匿名工程師' }}</span>
        <span class="info-subscribe" @click="subscribe(blogUrl)" :class="{'is-subscribed': isSubscribed}">{{ isSubscribed ? '取消追蹤' : '追蹤作者'  }}</span>
      </div>
      <div class="card-body">
        <div class="article-layout-wrapper" ref="count-article" :style="{'max-height': 36 * articleLimit +'px'}">
          <template v-for="(article, index) in blogList">
            <div
              class="article-wrapper"
              v-if="matchKeyword(article.title)"
              :key="index"
              :style="{'left':(pagiCurrPage - 1) * -360 +'px'}"
              >
              <a class="article-link"
                :title="article.title"
                target="_blank"
                :href="article.url">
                {{ article.title }}
              </a>
            </div>
          </template>
        </div>
      </div>
      <div class="card-footer">
        <div class="pagination-wrapper">
          <div
            class="pagi-page"
            :class="{'is-curr': page === pagiCurrPage}"
            v-for="page in pagiTotalPage"
            @click="pagiCurrPage = page"
            :key="page">{{ page }}
            </div>
        </div>
      </div>
    </div>
  </span>
</template>

<script>

export default {
  name: 'Article',
  props: [
    'author',
    'blogUrl',
    'filter',
    'updateTime',
    'blogList',
    'articleLimit'
  ],
  data () {
    return {
      pagiCurrPage: 1,
      pagiTotalPage: 1,
      isSubscribed: false
    }
  },
  watch: {
    filter () {
      this.$nextTick(function () {
        this.initPagination()
      })
    },
    articleLimit () {
      this.$nextTick(function () {
        this.initPagination()
      })
    }
  },
  mounted () {
    this.initPagination()
    this.checkSubscribed()
  },
  methods: {
    matchKeyword (articleTitle) {
      return (articleTitle.toLowerCase().indexOf(this.filter.toLowerCase()) > -1)
    },
    initPagination () {
      this.countPaginationPage()
    },
    countPaginationPage () {
      const total = this.$refs['count-article'].childElementCount
      this.pagiTotalPage = Math.ceil(total / this.articleLimit)
    },
    subscribe (target) {
      const list = (localStorage.getItem('subscribeList'))
        ? JSON.parse(localStorage.getItem('subscribeList'))
        : { subscribeList: [] }

      if (list.subscribeList.indexOf(target) > -1) {
        list.subscribeList = list.subscribeList.filter(item => item !== target)
        this.isSubscribed = false
      } else {
        list.subscribeList.push(target)
        this.isSubscribed = true
      }

      localStorage.setItem('subscribeList', JSON.stringify(list))
    },
    checkSubscribed () {
      const list = (localStorage.getItem('subscribeList'))
        ? JSON.parse(localStorage.getItem('subscribeList'))
        : { subscribeList: [] }
      if (list.subscribeList.indexOf(this.blogUrl) > -1) {
        this.isSubscribed = true
      } else {
        this.isSubscribed = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.card-wrapper {
  display:inline-block;
  margin: 12px;
  .card-modal {
    width:352px;
    padding: 8px 12px;
    font-family: '微軟正黑體';
    font-weight: bold;
    font-size:15px;
    transition: 0.3s;
    background:white;
    box-shadow: 0 2px 4px 0 #00000090;
    border-radius: 4px;
    overflow: hidden;
    &:hover {
      box-shadow: 0 4px 8px 2px #00000090;
    }
    .card-header {
      display: flex;
      justify-content:space-between;
      align-items: center;
      border-bottom: 1px solid #1f1f1f;
      margin-bottom: 12px;
      padding: 8px 0;
      transition: 0.3s;
      overflow: hidden;
    }
    .card-body {
      width:352px;
      overflow: hidden;
    }
    .card-footer {
    }
    .info-subscribe {
      font-size: 14px;
      padding: 2px 4px;
      border: 2px solid #1e6642;
      color: #1e6642;
      border-radius: 4px;
      transition: 0.2s ease-out;
      &:hover {
        background: #1e664233;
        box-shadow: 0 0 2px 0px #caece2;
      }
      &.is-subscribed {
        background: #1e6642;
        color: white;
      }
    }
    .info-author {
      margin-right: 12px;
    }
  }
}
.article-layout-wrapper {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height:100%;
  .article-wrapper {
    position:relative;
    left:0px;
    margin-right:8px;
    transition:0.5s;
    .article-link {
      width:352px;
      display: block;
      height: 28px;
      box-sizing: border-box;
      background: #f1f1e1;
      color:#0f3127;
      margin-bottom: 8px;
      padding:4px;
      transition: 0.3s;
      overflow : hidden;
      white-space : nowrap;
      text-overflow : ellipsis;
      &:hover {
        background: #cacab4;
      }
    }
  }
}
.pagination-wrapper {
  display: flex;
  justify-content:center;
  .pagi-page {
    background: white;
    color: #0f3127;
    text-align: center;
    line-height: 20px;
    width:20px;
    height:20px;
    margin-right:4px;
    border: 2px solid #0f3127;
    border-radius: 50%;
    font-size:14px;
    font-family: arial;
    transition: 0.2s ease-out;
    cursor: pointer;
    &.is-curr {
      background: #0f3127;
      color: white;
      &:hover {
        background: #0f3127;
      }
    }
    &:hover {
      background: #caece2;
    }
  }
}
</style>
