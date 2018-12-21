<template>
  <header class="page-header box-shadow" :style="{left:[isHiddenAside?'0':sidebarOpen?'200px':'64px']}">
    <div class="header-logo" >
      <template v-if="!isHiddenAside">
        <i  class="iconfont icon-caidanxiantiao" style="font-size: 14px;cursor: pointer;transition: 0.3s all;" :style="{transform: [sidebarOpen?'rotate(0)':'rotate(90deg)']}" @click="openAside"></i>
        <el-breadcrumb separator="/" class="breadcrumb">
          <template v-for="(item,index) in breadcrumbList" v-if="item.path">
            <el-breadcrumb-item  :key="index" >
              <router-link v-if="item.path != $route.path" :to="item.path">{{item.title}}</router-link>
              <span v-else>{{item.title}}</span>
            </el-breadcrumb-item>
          </template>
          <el-breadcrumb-item>{{typeof $route.meta.title != 'object' ? $route.meta.title : $route.meta.title[nowRobotInfo.industry] ? $route.meta.title[nowRobotInfo.industry] : $route.meta.title.default}}</el-breadcrumb-item>
        </el-breadcrumb>
      </template>
      <div class="idbear-logo cursor-pointer" @click="openWindow('http://www.id-bear.com')" v-else>
        <img src="/static/imgs/idbear-logo-blue.png" />
      </div>
    </div>
    <div class="header-user">
      <!--<span class="header-user-menu cursor-pointer" round size="small" style="margin-right: 30px;" @click="goto('/user/robot')">机器人管理</span>-->
      <!--<span class="header-user-menu cursor-pointer" round size="small" style="margin-right: 30px;" @click="openWindow('https://shimo.im/docs/MQP31Ys5lYgqWPCl')">帮助中心</span>-->
      <el-tooltip content="全屏显示" placement="bottom">
        <span class="cursor-pointer" @click="FullScreen" style="margin-right: 30px;">
          <i class="icon-quanping iconfont link-black" style="font-size: 12px;"></i>
        </span>
      </el-tooltip>
      <el-tooltip content="帮助中心" placement="bottom">
        <span class="cursor-pointer" style="margin-right: 30px;" @click="openWindow('https://www.kancloud.cn/xxm2430/xmm_dec/795928')">
          <i class="icon-shiyongbangzhu iconfont link-black" style="font-size: 12px;"></i>
        </span>
      </el-tooltip>
      <el-dropdown class="header-user-label" @command="handleCommand">
        <span class="cursor-pointer">
          {{userInfo.mobile}}
          <i class="iconfont icon-xiaotuziCduan_" style="font-size: 14px;"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="/user/robot">机器人管理</el-dropdown-item>
          <el-dropdown-item command="/user/oneself">账号设置</el-dropdown-item>
          <el-dropdown-item command="" @click.native="signout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

    </div>
    <!--<div-->
      <!--class="header-alert el-alert el-alert&#45;&#45;warning"-->
      <!--v-if="!isHiddenAside && headerAlertInfo.visible"-->
      <!--&gt;-->
      <!--<i class="el-alert__icon el-icon-warning"></i>-->
      <!--<span @click="openService" v-html="headerAlertInfo.title"></span>-->
    <!--</div>-->
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { openFullScreen, exitFullScreen } from '@/utils/common'
import mixin from '@/mixins'
// import dayjs from 'dayjs'
export default {
  components: {},
  mixins: [mixin],
  data () {
    return {
      selectStore: '',
      isHiddenAside: false,
      activateServiceInfo: {
        visible: false,
        title: '激活AI电商机器人服务',
        code: '',
        activeitem: {}
      },
      breadcrumbList: []
    }
  },
  computed: {
    headerAlertInfo () {
      let headerAlertInfo = {
        title: '',
        visible: false,
        type: ''
      }
      return headerAlertInfo
    },
    ...mapGetters(['sidebarOpen', 'userInfo', 'nowRobotInfo'])
  },
  created () {
    this.isHiddenAside = this.$route.meta.hiddenAside
    this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      this.$api.user.getUserInfo()
        .then((data) => {
          this.SetUserinfo(data[0])
          window.localStorage.setItem('userInfo', JSON.stringify(data[0]))
        })
    },
    openAside () {
      this.setSidebarOpen(!this.sidebarOpen)
    },
    ...mapActions(['setSidebarOpen', 'SetUserinfo']),
    handleCommand (data) {
      if (data === 'signOut') {
        window.signOut()
      } else {
        this.$router.push(data)
      }
    },
    signout () {
      window.authUser()
    },
    FullScreen (e) {
      var isFullscreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen
      if (!isFullscreen) { // 进入全屏,多重短路表达式
        openFullScreen()
      } else {
        exitFullScreen()
      }
    }
  },
  watch: {
    '$route': {
      handler (val) {
        this.isHiddenAside = val.meta.hiddenAside || false
        let list = []
        if (val.meta.breadcrumb) {
          list = list.concat(val.meta.breadcrumb.map((item) => {
            if (typeof item.title === 'object') {
              item.title = item.title[this.nowRobotInfo.industry] ? item.title[this.nowRobotInfo.industry] : item.title.default
            }
            return item
          }))
        }
        // let item = {}
        // if (typeof val.meta.title === 'object') {
        //   item = {
        //     path: val.path,
        //     title: val.meta.title[this.nowRobotInfo.industry] ? val.meta.title[this.nowRobotInfo.industry] : val.meta.title.default
        //   }
        // } else {
        //   item = {
        //     path: val.path,
        //     title: val.meta.title
        //   }
        // }
        // list.push(item)
        this.breadcrumbList = list
      },
      immediate: true
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/style/variate.scss";
.page-header{
  min-width: 1000px;
  height: 54px;
  position: fixed;
  top: 0;
  left: 200px;
  right: 0;
  z-index: 1024;
  background: #fff;
  display: flex;
  padding: 0 20px 0 10px;
  .header-logo{
    flex-grow: 1;
    display: flex;
    align-items: center;
  }
  .header-user{
    flex-grow: 0;
    line-height: 54px;
    .header-user-menu{
      &:hover{
        color: $blue;
      }
    }
    .header-user-label{
      span{
        display: inline-block;
        line-height: 54px;
      }
    }
    .selectStore{
      margin-right: 15px;
    }
  }
  .breadcrumb{
    margin-left: 15px;
  }
}
  .header-alert{
    position: absolute;
    bottom: -40px;
    height: 40px;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    i{
      display: inline-block;
      margin-right: 10px;
    }
    span{
      line-height: 1;
      user-select: none;
    }
  }
  .idbear-logo{
    padding-left: 10px;
    img{
      width: 123px;
      height: 26px;
    }
  }
</style>
