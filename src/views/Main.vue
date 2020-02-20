<template>
  <div class="main-wrapper">
    <nav class="main-navbar-wrapper">
      <div class="navbar-title">
        Hexschool 2020 鐵人賽文章搜尋器 ver 0.1.2
      </div>
      <div class="navbar-info">
        <span class="navbar-info-count">
          目前參賽人數：{{List.length}}。
        </span>
        <span class="navbar-info-dataOrigin">
          {{ ListOrigin }}。
        </span>
      </div>
    </nav>
    <div class="main-search-wrapper">
      <span class="search-input-wrapper">
        <input class="search-input" type="text" placeholder="搜尋文章關鍵字" @input="getKeyword($event.target.value), sort = ''">
        <div class="search-input-autoComplete"></div>
      </span>
      <button class="search-btn"
        :class="{'is-active': sort === 'ascendDate'}"
        @click="sortByAscendDate(), sort = 'ascendDate'">
        依更新日期遠到近
      </button>
      <button
        class="search-btn"
        :class="{'is-active': sort === 'descendDate'}"
        @click="sortByDescendDate(), sort = 'descendDate'">
        依更新日期近到遠
      </button>
      <button class="search-btn"
        :class="{'is-active': sort === 'ascendArticleCount'}"
        @click="sortByAscendArticleCount(), sort = 'ascendArticleCount'">
        依發布文章多到少
      </button>
      <button class="search-btn"
        :class="{'is-active': sort === 'descendArticleCount'}"
        @click="sortByDescendArticleCount(), sort = 'descendArticleCount'">
        依發布文章少到多
      </button>
    </div>
    <div class="main-list-wrapper">
      <template v-for="(data, index) in List">
        <Article
          v-if="keywordFilter(data)"
          :filter="keyword"
          :key="index"
          :author="data.name"
          :blogList="data.blogList"
          :updateTime="data.updateTime"
        />
      </template>
    </div>
  </div>
</template>

<script>
import Article from '@/components/Article'
import mockListData from '@/mockAPI/20200219.json'

export default {
  name: 'Main',
  components: {
    Article
  },
  data () {
    return {
      List: mockListData,
      ListOrigin: '資料、連線異常，啟用備份模式',
      keyword: '',
      sort: ''
    }
  },
  mounted () {
    this.getListData()
  },
  methods: {
    getListData () {
      fetch('https://raw.githubusercontent.com/hexschool/w3hexschool-API/master/data.json')
        .then(res => res.json())
        .then(res => {
          this.List = res
          this.formatListData()
          this.ListOrigin = '資料來源為六角學院'
        })
    },
    formatListData () {
      this.List.map(data => {
        const day = data.updateTime.split(' ')[0]
        const meridiem = data.updateTime.split(' ')[1]
        const time = data.updateTime.split(' ')[2]
        let hour = time.split(':')[0]
        let minute = time.split(':')[1]
        let second = time.split(':')[2]
        if (meridiem === '下午') {
          hour = (+time.split(':')[0] + 12).toString()
          if (hour === '24') { hour = '00' }
          minute = time.split(':')[1].toString()
          second = time.split(':')[2].toString()
        }
        data.timestamp = Date.parse(`${day} ${hour}:${minute}:${second}`)
      })
    },
    getKeyword (keyword) {
      this.keyword = keyword
    },
    sortByAscendDate () {
      this.List = this.List.sort((a, b) => a.timestamp - b.timestamp)
    },
    sortByDescendDate () {
      this.List = this.List.sort((a, b) => b.timestamp - a.timestamp)
    },
    sortByAscendArticleCount () {
      this.List = this.List.sort((a, b) => b.blogList.length - a.blogList.length)
    },
    sortByDescendArticleCount () {
      this.List = this.List.sort((a, b) => a.blogList.length - b.blogList.length)
    },
    keywordFilter (data) {
      let flag = false
      data.blogList.forEach(article => {
        if (article.title.toLowerCase().indexOf(this.keyword.toLowerCase()) > -1) { flag = true }
      })
      return flag
    }
  }
}
</script>

<style scoped lang="scss">
// section wrapper
.main-wrapper {
  padding-top: 48px;
}
.main-navbar-wrapper {
  position: fixed;
  z-index:10;
  top:0;
  width:100%;
  height:48px;
  box-sizing: border-box;
  padding: 12px;
  display:flex;
  justify-content: space-between;
  align-items: center;
  background: #FFF;
  color:#0F3127;
  box-shadow: 0 2px 4px 0 #00000090;
  font-weight: bold;
  font-family: '微軟正黑體';
}
.main-search-wrapper {

}
.main-list-wrapper {
  display:flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

// components wrapper
.search-input-wrapper {
  display: inline-block;
  margin:12px;
  .search-input {
    padding: 8px;
    border: none;
    border-radius: 2px;
    font-size:16px;
    font-family: '微軟正黑體';
    font-weight: bold;
    box-shadow: 0 2px 4px #00000080;
    &:focus {
      outline: none;
    }
  }
}

.search-btn {
  cursor: pointer;
  font-family: '微軟正黑體';
  font-weight: bold;
  margin: 12px;
  padding: 8px 12px;
  border-radius: 2px;
  transition: 0.5s;
  background:#fff;
  box-shadow: 0 4px 8px 0 #00000080;
  overflow: hidden;
  &:hover {
    box-shadow: 0 8px 12px 0 #00000080;
  }
  &:focus {
    outline: none;
  }
  &.is-active {
    background: black;
    color:white;
  }
}
</style>
