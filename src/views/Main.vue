<template>
  <div class="main-wrapper">
    <!-- navbar start  -->
      <nav class="main-navbar-wrapper" :class="{'is-collapsed': currScrollTop > 180}">
        <div class="navbar-content">
          <div class="navbar-title">
            Hexschool 2020 鐵人賽文章搜尋器 ver {{ appVersion }}
          </div>
        </div>
      </nav>
    <!-- navbar end  -->
    <div class="main-content-wrapper">
      <!-- search filter start -->
        <div class="search-wrapper" :class="{'is-fixed': currScrollTop > 30}">
          <div class="search-function">
            <!-- keyword func start  -->
              <span class="search-group-wrapper">
                <input class="search-input" type="text" placeholder="搜尋文章關鍵字" v-model="keyword" @input="sort = ''">
                <div class="search-input-autoComplete"></div>
              </span>
            <!-- keyword func end  -->
            <!-- limit func start  -->
              <span class="search-group-wrapper has-label">
                <label class="search-label" for="limitArticleCount"> 文章顯示筆數</label>
                <input class="search-input" id="limitArticleCount" type="number" min="1" placeholder="欄位文章數" v-model="articleLimit">
              </span>
            <!-- limit func end -->
            <!-- subscribe func start -->
              <span class="search-group-wrapper has-label">
                <label class="search-label" for="limitArticleCount"> 列表</label>
                <button
                  class="search-btn"
                  :class="{'is-active': !isSubScribeModeOpen}"
                  @click="isSubScribeModeOpen = false">
                  全部
                </button>
                <button
                  class="search-btn"
                  :class="{'is-active': isSubScribeModeOpen}"
                  @click="isSubScribeModeOpen = true">
                  收藏
                </button>
              </span>
            <!-- subscribe func end -->
            <!-- sort func start -->
              <span class="search-group-wrapper has-label">
                <label class="search-label" for="limitArticleCount"> 排序</label>
                <div class="search-select">
                  <button
                    class="search-btn"
                    :class="{'is-active': sort === 'ascendArticleCount'}"
                    @click="sortByAscendArticleCount(), sort = 'ascendArticleCount'">
                    發布文章多到少
                  </button>
                  <button
                    class="search-btn"
                    :class="{'is-active': sort === 'descendArticleCount'}"
                    @click="sortByDescendArticleCount(), sort = 'descendArticleCount'">
                    發布文章少到多
                  </button>
                  <button
                    class="search-btn"
                    :class="{'is-active': sort === 'ascendDate'}"
                    @click="sortByAscendDate(), sort = 'ascendDate'">
                    更新日期遠到近
                  </button>
                  <button
                    class="search-btn"
                    :class="{'is-active': sort === 'descendDate'}"
                    @click="sortByDescendDate(), sort = 'descendDate'">
                    更新日期近到遠
                  </button>
                </div>
              </span>
            <!-- sort func end -->
            <!-- status func end -->
              <div class="status-wrapper">
                <span class="status" ref="konami-chatbox">
                  <span class="konami-cat" ref="konami-cat">🐈</span>小幫手：<span class="notice">{{ statusNotice }}</span>
                </span>
              </div>
            <!-- status func end -->
          </div>
        </div>
      <!-- search filter end -->
      <!-- search result start -->
        <div class="list-wrapper" ref="list-wrapper">
          <template v-for="data in List">
            <Article
              v-show="searchFilter(data)"
              :filter="keyword"
              :key="data.updateTime"
              :author="data.name"
              :authorKeyId="data.keyID"
              :blogUrl="data.blogUrl"
              :blogList="data.blogList"
              :updateTime="data.updateTime"
              :articleLimit="articleLimit"
            />
          </template>
        </div>
        <template v-if="this.ListCount === 0">
          <div class="main-not-found-wrapper">
            <div class="not-found" @click="keyword = '' , isSubScribeModeOpen = false">找不到相關文章！<br>點此清除搜尋條件！</div>
          </div>
        </template>
      <!-- search result end -->
    </div>
    <!-- footer start -->
      <div class="main-footer-wrapper">
        <div class="footer-content">
          本網站由 <a href="https://shawnlin0201.github.io/">ShawnL</a> 建置，文章資料來源為 <a href="https://github.com/hexschool/w3hexschool-API">{{ ListOrigin }}</a>。
        </div>
      </div>
    <!-- footer end -->
    <!-- extra func start -->
      <div class="go-top-wrapper">
        <div class="go-top">
          <i class="icon go-top" @click="smoothToTop()" :class="{'is-active': currScrollTop > 180}"></i>
        </div>
      </div>
    <!-- extra func end -->
  </div>
</template>

<script>
import Article from '@/components/Article'
import mockListData from '@/mockAPI/20200221.json'
import axios from 'axios'

export default {
  name: 'Main',
  components: {
    Article
  },
  props: [
    'appVersion'
  ],
  data () {
    return {
      List: mockListData,
      ListOrigin: '備份檔案（因目前 API、網路連線異常）',
      ListCount: 1,
      keyword: '',
      sort: 'ascendArticleCount',
      isSubScribeModeOpen: false,
      articleLimit: 3,
      statusNotice: '若是清單尚未出現你的文章，請至六角文章表單更新你的資訊，資料來源約 30 分鐘更新一次。',
      konamiCode: [],
      currScrollTop: 0
    }
  },
  watch: {
    articleLimit () {
      if (this.articleLimit < 1) {
        this.articleLimit = 1
      }
    },
    keyword () {
      this.countList()
    },
    isSubScribeModeOpen () {
      this.countList()
    },
    sort () {
      this.changeStatusNotice()
    }
  },
  mounted () {
    this.getListData()
    this.$nextTick(() => {
      this.ListCount = this.$refs['list-wrapper'].childElementCount
    })
    window.addEventListener('keydown', e => this.konami(e))
    window.addEventListener('scroll', e => { this.currScrollTop = this.detectScrollTop() })
  },
  destroyed () {
    window.removeEventListener('keydown', e => this.konami(e))
  },
  methods: {
    getListData () {
      axios.get('https://raw.githubusercontent.com/hexschool/w3hexschool-API/master/data.json')
        .then(res => {
          this.List = res.data
          this.formatListData()
          this.ListOrigin = '六角學院'
          this.sortByAscendArticleCount()
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
    searchFilter (data) {
      const flag = {
        keyword: true,
        subscribe: true
      }
      const isSubScribeModeOpen = this.isSubScribeModeOpen

      flag.keyword = false
      data.blogList.forEach((article, idx) => {
        if (article.title.toLowerCase().indexOf(this.keyword.toLowerCase()) > -1) {
          flag.keyword = true
        }
      })

      if (isSubScribeModeOpen) {
        flag.subscribe = false

        const list = (localStorage.getItem('subscribeList'))
          ? JSON.parse(localStorage.getItem('subscribeList'))
          : { subscribeList: [] }
        if (list.subscribeList.indexOf(data.keyID) > -1) {
          flag.subscribe = true
        } else {
          flag.subscribe = false
        }
      }

      return flag.keyword && flag.subscribe
    },
    countList () {
      this.$nextTick(() => {
        this.ListCount = this.$refs['list-wrapper'].childElementCount
        if (this.ListCount === 0) {
          this.statusNotice = `咦？找不到有關 " ${this.keyword}" 的文章，換換搜尋關鍵字吧！`
        } else {
          this.changeStatusNotice()
        }
      })
    },
    changeStatusNotice () {
      const noticeCollection = [
        '若是清單尚未出現你的文章，請至六角文章表單更新你的資訊，資料來源約 30 分鐘更新一次。',
        '聽說在螢幕上輸入密技會發生意想不到的事情。',
        '這個世界上有 10 種人，一種是懂二進位的人，另一種是不懂二進位的人。',
        `節錄目前參與人數總共有 ${this.List.length} 人，資料來源為${this.ListOrigin}`
      ]
      const random = Math.floor(Math.random() * noticeCollection.length)
      this.statusNotice = noticeCollection[random]
    },
    konami (e) {
      const komaniCode = '38,38,40,40,37,39,37,39,66,65'
      const nowCode = [...this.konamiCode]
      nowCode.push(e.keyCode)
      if (nowCode.length > 10) {
        nowCode.shift()
      }
      this.konamiCode = nowCode
      if (this.konamiCode.toString() === komaniCode) {
        this.konamiActive()
      }
    },
    konamiActive () {
      const cat = this.$refs['konami-cat'].style
      const chatbox = this.$refs['konami-chatbox'].style
      cat.position = 'fixed'
      cat.top = '50%'
      cat.left = '50%'
      cat.transform = 'translate(-50%, -140%)'
      cat.fontSize = '100px'
      chatbox.position = 'fixed'
      chatbox.top = '50%'
      chatbox.left = '50%'
      chatbox.transform = 'translate(-50%, -50%)'
      this.statusNotice = '感謝你，我已經被釋放了！'
    },
    smoothToTop () {
      const TOP = document.documentElement.scrollTop || document.body.scrollTop
      if (TOP > 0) {
        requestAnimationFrame(this.smoothToTop)
        window.scrollTo(0, TOP - (TOP / 8))
      }
    },
    detectScrollTop () {
      const body = window.document.body
      let document = window.document.documentElement
      document = (document.clientHeight) ? document : body
      return document.scrollTop
    }
  }
}
</script>

<style scoped lang="scss">
// section wrapper
.main-wrapper {
  padding-top: 48px;
}
.main-content-wrapper{
  width:100%;
  max-width: 1200px;
  margin:0 auto;
  background: #4cb683;
  box-shadow: 0 2px 6px 1px #00000090;
}
.main-navbar-wrapper {
  position: fixed;
  z-index:10;
  top:0;
  width:100%;
  background: #0F3127;
  color:#FFF;
  box-shadow: 0 2px 4px 0 #00000090;
  font-weight: bold;
  font-family: '微軟正黑體';
  transition: 0.3s;
  &.is-collapsed {
    top:-48px;
  }
  .navbar-content {
    display:flex;
    justify-content: space-between;
    align-items: center;
    width:1200px;
    height:48px;
    margin:0 auto;
    padding: 12px;
    box-sizing: border-box;
  }
}
.status-wrapper {
  .status {
    display: inline-block;
    font-family: '微軟正黑體';
    font-weight: bold;
    margin: 12px;
    padding: 8px 12px;
    border-radius: 2px;
    background: white;
    box-shadow: 0 2px 4px 0 #00000090;
    .notice {
      color: #fc5513
    }
    .konami-cat {
      transition: 0.5s;
    }
  }
}
.list-wrapper {
  display:flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.search-wrapper {
  &.is-fixed {
    position: fixed;
    display:flex;
    justify-content: center;
    top:0;
    left:0;
    z-index:1;
    width:100%;
    background: #4cb683;
    box-shadow: 0 2px 4px 0 #00000090;
  }
  .search-group-wrapper {
    display: inline-block;
    margin:12px;
    overflow: hidden;
    vertical-align:bottom;
    &.has-label {
      background:#103523;
      border-radius: 2px;
      box-shadow: 0 2px 4px 0 #00000090;
      .search-input {
        padding: 6px;
        font-family: '微軟正黑體';
        font-weight: bold;
        font-size:15px;
        border: none;
        border-radius: 0;
        width:40px;
        box-shadow: none;
        &:focus {
          outline: none;
        }
      }
      .search-label {
        font-family: '微軟正黑體';
        font-weight: bold;
        font-size:15px;
        padding:0 8px;
        color:white;
      }
      .search-select {
        display:inline-block;
      }
    }
    .search-input {
      padding: 6px;
      font-family: '微軟正黑體';
      font-weight: bold;
      font-size:15px;
      border: none;
      border-radius: 2px;
      box-shadow: 0 2px 4px 0 #00000090;
      &:focus {
        outline: none;
      }
    }
    .search-btn {
      margin:0;
      border-radius: 0;
      box-shadow: none;
      &:hover {
        box-shadow: none;
      }
      &.is-active {
        box-shadow: none;
        background: #91ffca;
        color: #103523;
      }
    }
  }

  .search-btn {
    cursor: pointer;
    font-family: '微軟正黑體';
    font-weight: bold;
    font-size:15px;
    margin: 12px;
    padding: 6px 8px;
    border-radius: 2px;
    transition: 0.5s;
    background:#fff;
    box-shadow: 0 2px 4px 0 #00000090;
    overflow: hidden;
    &:hover {
      box-shadow: 0 4px 8px 0 #00000090;
    }
    &:focus {
      outline: none;
    }
    &.is-active {
      background: #103523;
      color:white;
    }
    &.is-disable {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
}
.main-not-found-wrapper {
  display:flex;
  justify-content: center;
  .not-found {
    text-align: center;
    margin: 12px;
    padding: 8px 12px;
    font-family: '微軟正黑體';
    font-weight: bold;
    font-size:15px;
    transition: 0.3s;
    background:#103523;
    color:white;
    box-shadow: 0 2px 4px 0 #00000090;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      box-shadow: 0 4px 8px 2px #00000090;
    }
  }
}

.main-footer-wrapper {
  width:100%;
  background:#103523;
  .footer-content {
    margin-top:100px;
    width:100%;
    max-width:1200px;
    padding:12px;
    margin:0 auto;
    font-family: '微軟正黑體';
    font-weight: bold;
    font-size:15px;
    color: #fff;
    text-align:center;
  }
  a {
    text-decoration: underline;
  }
}

.go-top-wrapper {
  .go-top {
    position:fixed;
    right:-100%;
    bottom:5%;
    background:#00000080;
    width:30px;
    height:30px;
    padding:8px;
    text-align: center;
    line-height: 40px;
    transition:1s;
    &.is-active {
      right:5%;
    }
  }
}
</style>
