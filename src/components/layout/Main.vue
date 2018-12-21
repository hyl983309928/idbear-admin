<template>
  <section class="page-main" v-loading="loading" element-loading-text="加载中" :style="{marginLeft:[isHiddenAside?'0':sidebarOpen?'200px':'64px'],paddingTop:[!isHiddenAside && isShowAlert?'90px':'54px']}">
    <div class="container">
      <transition name="el-fade-in-linear">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" />
        </keep-alive>
      </transition>
      <transition name="el-fade-in-linear">
        <router-view v-if="!$route.meta.keepAlive"/>
      </transition>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
// import dayjs from 'dayjs'
export default {
  components: {},
  data () {
    return {
      isHiddenAside: false
    }
  },
  computed: {
    isShowAlert () {
      return false
    },
    routerPath () {
      return this.$route.path
    },
    ...mapGetters(['sidebarOpen', 'loading'])
  },
  created () {
    this.isHiddenAside = this.$route.meta.hiddenAside
    // checkStoreListExist(this.init)
  },
  methods: {
    init () {
    }
  },
  watch: {
    '$route': function (val) {
      this.isHiddenAside = val.meta.hiddenAside || false
    }
  }
}
</script>

<style scoped lang="scss">
.page-main{
  min-width: 1000px;
  transition: 0.3s margin-left;
  overflow: hidden;
  margin-left: 200px;
  padding-top: 54px;
  display: block;
  z-index: 1022;
  .container{
    padding: 20px;
  }
}
</style>
