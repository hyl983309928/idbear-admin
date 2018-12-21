// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import api from 'lib/api/api.js'
import ElementUI from 'element-ui'
import '@/style/element.scss'
import '@/style/index.scss'
import '@/assets/iconfont/iconfont.css'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import Cookies from 'js-cookie'
import { clearRobotList } from './lib/modules/user'
import { getHashParamter, toUrlHash } from './utils/common'
import { getRobotList } from 'lib/modules/user.js'
import { handleAuthRouters } from './router/handleAuthRouter'
import exportExcel from '@/plugins/exportExcel'
if (process.env.NODE_ENV === 'development') {
  // import('./mock/index')
}

window.Promise = Promise
NProgress.configure()// NProgress Configuration

Vue.use(exportExcel)
Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.$api = api
Vue.prototype.$http = axios
Vue.prototype.$cookies = Cookies
Vue.prototype.$bus = new Vue()

window.signOut = function () {
  this.$router.push('/login')
}
let hashParams = getHashParamter()

if (hashParams.storeSuccessAuth) {
  Vue.prototype.$notify({
    type: 'success',
    title: '有赞店铺授权成功',
    message: '我们需要几分钟来初始化您的商品数据，请耐心等待。',
    duration: 10000
  })
  hashParams.storeSuccessAuth = ''
  toUrlHash(hashParams)
}
if (hashParams.wechatSuccessAuth) {
  store.commit('SET_SHOWBINDWECHATSUCCESSDIALOG', true)
  Vue.prototype.$notify({
    type: 'success',
    title: '微信公众号授权成功',
    message: '获取您的公众号信息需要一些时间，请耐心等待！',
    duration: 0
  })
  hashParams.wechatSuccessAuth = ''
  toUrlHash(hashParams)
}
router.beforeEach((to, from, next) => {
  store.commit('SET_LOADING', false)
  NProgress.start()
  if (window.localStorage.getItem('token') || to.meta.noAuth) {
    // 判断当前是否登入（token是否存在），或者进入的页面是不需要授权的（login页等），否则进入login页
    if (window.localStorage.getItem('token') && !store.getters.isRequestRobot) {
      // 如果当前已经登入，并且重未请求过robotList，那么进入该条件
      let loading = Vue.prototype.$loading({
        lock: true,
        text: '加载中',
        background: 'rgba(255, 255, 255, 0.7)'
      })
      getRobotList(true)
        .then(() => {
          loading.close()
          handleAuthRouters()
          if (window.localStorage.getItem('token') && !store.getters.nowRobot && !to.meta.noRobot && !to.meta.noAuth) {
            // 当前已经登入，但是没有创建机器人，然后进入的页面不是没有机器人和没有登入能进入的
            store.commit('SET_SHOWPROMPTCREATEROBOTDIALOG', true)
            NProgress.done()
            next({
              path: '/',
              query: {}
            })
          } else {
            NProgress.done()
            next({
              path: from.path.indexOf('/login') !== -1 ? '/' : window.location.pathname + window.location.search + window.location.hash
            })
          }
        })
        .catch((e) => {
          loading.close()
          NProgress.done()
          Vue.prototype.$notify({
            type: 'error',
            title: '请求失败',
            message: '当前网络异常，请刷新重试！',
            duration: 0
          })
          next(false)
        })
    } else {
      // 当前已经登入，robotList也已经请求
      if (window.localStorage.getItem('token') && !store.getters.nowRobot && !to.meta.noRobot && !to.meta.noAuth) {
        // 当前已经登入，但是没有创建机器人，然后进入的页面不是没有机器人和没有登入能进入的
        store.commit('SET_SHOWPROMPTCREATEROBOTDIALOG', true)
        NProgress.done()
        next({
          path: '/',
          query: {}
        })
      } else {
        next()
      }
    }
  } else {
    NProgress.done()
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
})
router.afterEach(() => {
  NProgress.done() // finish progress bar
})
window.authUser = function () {
  store.commit('SET_TOKEN', '')
  window.localStorage.removeItem('token')
  clearRobotList()
  router.push('/login')
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
