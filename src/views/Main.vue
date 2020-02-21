<template>
  <div class="main-wrapper">
    <nav class="main-navbar-wrapper">
      <div class="navbar-title">
        Hexschool 2020 鐵人賽文章搜尋器 ver 0.1.2
      </div>
      <div class="navbar-info">
        <span class="navbar-info-count">
          節錄參與人數：{{List.length}}。
        </span>
        <span class="navbar-info-dataOrigin">
          {{ ListOrigin }}。
        </span>
      </div>
    </nav>
    <div class="main-search-wrapper">
      <span class="search-input-wrapper">
        <input class="search-input" type="text" placeholder="搜尋文章關鍵字" v-model="keyword" @input="sort = ''">
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
        :class="{'is-active': sort === 'ascendArticleCount', 'is-disable': keyword}"
        @click="sortByAscendArticleCount(), sort = 'ascendArticleCount'">
        依發布文章多到少
      </button>
      <button class="search-btn"
        :class="{'is-active': sort === 'descendArticleCount', 'is-disable': keyword}"
        @click="sortByDescendArticleCount(), sort = 'descendArticleCount'">
        依發布文章少到多
      </button>
    </div>
    <div class="main-status-wrapper">
        <span class="status" ref="konami-chatbox">
          <span class="konami-cat" ref="konami-cat">🐈</span>小幫手：<span class="notice">{{ statusNotice }}</span>
        </span>
    </div>
    <div class="main-list-wrapper" ref="list-wrapper">
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
import mockListData from '@/mockAPI/20200221.json'
import axios from 'axios'

export default {
  name: 'Main',
  components: {
    Article
  },
  data () {
    return {
      List: mockListData,
      ListOrigin: '備份檔案（因目前 API、網路連線異常）',
      ListCount: 1,
      keyword: '',
      sort: '',
      statusNotice: '若是清單尚未出現你的文章，請至六角文章表單更新你的資訊，資料來源約 30 分鐘更新一次。',
      konamiCode: []
    }
  },
  watch: {
    keyword () {
      this.$nextTick(() => {
        this.ListCount = this.$refs['list-wrapper'].childElementCount
        if (this.ListCount === 0) {
          this.statusNotice = `咦？找不到有關 " ${this.keyword}" 的文章，換換搜尋關鍵字吧！`
        } else {
          this.changeStatusNotice()
        }
      })
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
    keywordFilter (data) {
      let flag = false
      data.blogList.forEach(article => {
        if (article.title.toLowerCase().indexOf(this.keyword.toLowerCase()) > -1) { flag = true }
      })
      return flag
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
.main-status-wrapper {
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
  box-shadow: 0 2px 4px 0 #00000090;
  overflow: hidden;
  &:hover {
    box-shadow: 0 4px 8px 0 #00000090;
  }
  &:focus {
    outline: none;
  }
  &.is-active {
    background: black;
    color:white;
  }
  &.is-disable {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
</style>
