<template>
  <aside class="page-aside" :style="{width:[sidebarOpen?'200px':'64px']}" v-if="!isHiddenAside">
    <div v-if="sidebarOpen">
      <div class="idbear-logo cursor-pointer" @click="openWindow('http://www.id-bear.com')">
        <img src="/static/imgs/idbear-logo.png" />
      </div>
      <div class="company-logo">
        <div ><img :src="nowRobotInfo.avatar ? nowRobotInfo.avatar.replace('http://storage.id-bear.com', 'https://xxm3.id-bear.com:8005') : '/static/imgs/logo.jpg'" /></div>
        <span v-if="robotList && robotList.length == 0" class="el-dropdown-link pick-robot cursor-pointer">
          <span class="text">熊小秘</span><i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown v-else>
          <span class="el-dropdown-link pick-robot cursor-pointer">
            <span class="text">{{nowRobotInfo.title}}</span><i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="nowRobotInfo.id != item.id ? changeNowRobot(item) : ''" class="dropdown-item" v-for="item in robotList" :key="item.id" :class="{'is-active': nowRobotInfo.id == item.id}">
              <span v-if="nowRobotInfo.id == item.id">{{item.title}}</span>
              <span v-else class="cursor-pointer" >{{item.title}}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="industry-box text-color-minor">{{nowRobotInfo.industry ? `${industryMap[nowRobotInfo.industry]}行业` : '微信'}}AI机器人</div>
      </div>
    </div>
    <div v-else>
      <div class="idbear-logo-small cursor-pointer" @click="openWindow('http://www.id-bear.com')">
        <img src="/static/imgs/idbear-logo-small.png" />
      </div>
      <div class="company-logo-small" >
        <img :src="nowRobotInfo.avatar ? nowRobotInfo.avatar : '/static/imgs/logo.jpg'" />
      </div>
    </div>

    <div class="aside-menu">
      <div class="aside-menu-item"></div>
    </div>
    <Menu
      :default-openeds="openeds"
      ref="menu"
      router
      :collapse="!sidebarOpen"
      :default-active="activeIndex"
      class="el-menu"
      @select="handleSelect"
      background-color="#15102E"
      text-color="#B9B9B9"
      active-text-color="#ffffff"
      hoverBgColor="#43424C"
    >
      <template v-for="(item,index) in routers" v-if="!item.hidden">
        <el-submenu :index="item.path" :key="index" v-if="handleMenuHidden(item)">
          <template slot="title">
            <i v-if="item.meta.icon" class="menu-icon" :class="item.meta.icon"></i>
            <span>{{item.meta.title}}</span>
          </template>
          <menu-item :index="item.path + '/' + childItem.path" v-for="(childItem,childIndex) in item.children" :key="childIndex" v-if="!childItem.hidden">
            <i v-if="childItem.meta.icon" class="menu-icon" :class="childItem.meta.icon"></i>
            <span slot="title">{{childItem.meta.title}}</span>
          </menu-item>
        </el-submenu>
        <menu-item :index="item.children?item.path+'/'+item.children[0].path:item.path" :key="index" v-else>
          <i :class="item.children?item.children[0].meta.icon:item.meta.icon" class="menu-icon"></i>
          <span slot="title">{{item.children?item.children[0].meta.title:item.meta.title}}</span>
        </menu-item>
      </template>
    </Menu>
  </aside>
</template>

<script>
import { mapGetters } from 'vuex'
import Menu from '@/components/element/menu/menu'
import MenuItem from '@/components/element/menu/menu-item'
import commonMixin from '@/mixins/common'
import { industryMap } from '../../lib/config'

export default {
  components: {
    Menu,
    'menu-item': MenuItem
  },
  mixins: [commonMixin],
  data () {
    return {
      industryMap,
      activeIndex: '',
      routers: [],
      openeds: [],
      isHiddenAside: false
    }
  },
  computed: {
    ...mapGetters(['sidebarOpen', 'nowRobotInfo', 'robotList'])
  },
  created () {
    this.isHiddenAside = this.$route.meta.hiddenAside
    this.routers = this.$router.options.routes
    this.activeIndex = this.$route.path
  },
  mounted () {
  },
  methods: {
    initOpeneds () {
      this.routers.forEach((item) => {
        this.openeds.push(item.path)
      })
    },
    handleSelect (path) {
      // this.$router.push(path)
    },
    handleMenuHidden (item) {
      let showItemChildren = item.children.filter((x) => {
        return !x.hidden
      })
      return showItemChildren && showItemChildren.length > 1
    },
    changeNowRobot (item) {
      window.localStorage.setItem('nowRobot', item.id)
      window.location.replace(window.location.origin + window.location.pathname)
    }
  },
  watch: {
    '$route' (val) {
      this.activeIndex = this.$route.path
      this.isHiddenAside = val.meta.hiddenAside || false
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/style/variate.scss";
.page-aside{
  position: fixed;
  top: 0px;
  left: 0;
  bottom: 0;
  width: 200px;
  z-index: 1025;
  background: #15102E;
  overflow-y: auto;
  color: rgb(191, 203, 217);
  transition: 0.3s all
}
.idbear-logo{
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #090524;
  img{
    height: 26px;
    width: 123px;
  }
}
.industry-box{
  text-align: center;
  line-height: 1;
  margin-top: 10px;
}
.idbear-logo-small{
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #090524;
  img{
    width: 46px;
    height: 37px;
  }
}
  .el-menu{
    border-right: 0px;
  }
.company-logo{
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  padding: 39px 0 56px 0;
  justify-content: center;
  img{
    width: 60px;
    height: 60px;
    margin-bottom: 15px;
    border-radius: 50% 50%;
    overflow: hidden;
    font-size: 0;
  }
  .pick-robot{
    color: #B9B9B9;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    .text{
      display: inline-block;
      max-width: 100px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .el-icon-arrow-down{
    }
  }
}
  .company-logo-small{
    width: 100%;
    text-align: center;
    padding: 30px 0;
    img{
      width: 60%;
      border-radius: 50% 50%;
    }
  }
  .iconfont{
    font-size: 18px;
    vertical-align: middle;
    margin-right: 5px;
    width: 24px;
    text-align: center;
    display: inline-block;
  }
  .menu-icon{
    margin-right: 15px;
    font-size: 16px;
  }
  .dropdown-item.is-active{
    color: $blue;
  }
</style>
