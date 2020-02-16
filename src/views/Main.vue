<template>
  <div class="main-wrapper">
    <template v-for="(data, index) in List">
      <Article
        :key="index"
        :author="data.name"
        :title="data.blogList[0].title"
        :articleUrl="data.blogList[0].url"
        :blogUrl="data.blogUrl"
        :updateTime="data.updateTime"
      />
    </template>
  </div>
</template>

<script>
import Article from '@/components/Article'

export default {
  name: 'Main',
  components: {
    Article
  },
  data () {
    return {
      List: []
    }
  },
  mounted () {
    this.getListData()
  },
  methods: {
    getListData () {
      if (this.List.length === 0) {
        fetch('https://raw.githubusercontent.com/hexschool/w3hexschool-API/master/data.json')
          .then(res => res.json())
          .then(res => {
            this.List = res
            console.log('List', this.List)
          })
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
