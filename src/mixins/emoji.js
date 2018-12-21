import { base64Emoji } from '@/lib/config/base64Emoji'
export default {
  data () {
    return {}
  },
  computed: {
  },
  methods: {
    parseEmojiCode (text) {
      if (!text) {
        return ''
      }
      let temp = text.replace(/\[[^[]+]/g, function (matchText) {
        return `<img src="${base64Emoji[matchText.replace(/\[|]/g, '')]}" width="25px" height="25px" style="vertical-align: top;" />`
      })
      let html = `${temp}`
      return html
    }
  }
}
