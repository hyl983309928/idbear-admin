import { mapGetters } from 'vuex'
export default {
  data () {
    return {}
  },
  computed: {
    ...mapGetters([
      'nowRobot'
    ])
  },
  methods: {
    authWechat () {
      let url = ''
      let redirectUrl = window.location.origin + window.location.pathname + `#wechatSuccessAuth=1&active=wechat`
      if (process.env.NODE_ENV === 'production') {
        url = `http://wechat.xxm3.id-bear.com/wechat/open?robot_id=${this.activeRobot}&return_url=${encodeURIComponent(encodeURIComponent(redirectUrl))}`
      } else {
        url = `http://test.id-bear.com/wechat/open?robot_id=${this.activeRobot}&return_url=${encodeURIComponent(encodeURIComponent(redirectUrl))}`
      }
      window.location.href = url
    },
    getH5Url () {
      if (process.env.NODE_ENV === 'production') {
        return `http://wechat.xxm3.id-bear.com/wechat/web_auth?robot_id=${window.localStorage.getItem('nowRobot')}&appid=wx54b7efc6223c6973`
      } else {
        return `http://test.id-bear.com/wechat/web_auth?robot_id=${window.localStorage.getItem('nowRobot')}&appid=wxc59b077d6c26e6ff`
      }
    },
    authPriaseStore () {
      let redirectUrl = window.location.origin + window.location.pathname + `#storeSuccessAuth=1&active=praise`
      if (process.env.NODE_ENV === 'production') {
        window.location.href = `https://open.youzan.com/oauth/authorize?client_id=d4680388e3bbcf496c&response_type=code&state=${this.activeRobot}|${encodeURIComponent(encodeURIComponent(redirectUrl))}&redirect_uri=http://xxm3.id-bear.com:6004/praise/callback/`
      } else {
        window.location.href = `https://open.youzan.com/oauth/authorize?client_id=0f9cd1ad538f44ec17&response_type=code&state=${this.activeRobot}|${encodeURIComponent(encodeURIComponent(redirectUrl))}&redirect_uri=http://xxm3.test.id-bear.com:6004/praise/callback/`
      }
    }
  }
}
