import { objToHashStr } from '../utils/common'

export default {
  data () {
    return {}
  },
  computed: {
  },
  methods: {
    goto (url, data) {
      if (data) {
        this.$router.push({
          path: url + `#${objToHashStr(data)}`
        })
      } else {
        this.$router.push({
          path: url
        })
      }
    },
    openWindow (url) {
      window.open(url)
    },
    /**
     * desc: 解析JSON
     * */
    parseJSON (str) {
      let obj = ''
      try {
        obj = JSON.parse(str)
      } catch (e) {
        obj = ''
      }
      return obj
    }
  }
}
