import { mapGetters, mapActions } from 'vuex'
import { isRealNum } from '../utils/common'
import { getRobotList } from '../lib/modules/user'
import commonMixin from './common'
import urlMixin from './url'
export default {
  data () {
    return {}
  },
  mixins: [commonMixin, urlMixin],
  computed: {
    ...mapGetters([
      'activeRobot',
      'nowRobot',
      'nowRobotInfo'
    ])
  },
  methods: {
    ...mapActions([
      'setActiveRobot',
      'setShowBindWechatDialog',
      'setShowActivateServiceDialog'
    ]),
    bindWechat (id) {
      let robot = ''
      if (isRealNum(id)) {
        robot = id
      } else {
        robot = this.nowRobot
      }
      window.localStorage.setItem('nowRobot', robot)
      this.setActiveRobot(robot)
      this.authWechat()
    },
    showActivateService (id) {
      let robot = ''
      if (isRealNum(id)) {
        robot = id
      } else {
        robot = this.nowRobot
      }
      this.setActiveRobot(robot)
      this.setShowActivateServiceDialog(true)
    },
    cancelWechatAuth (callBack) {
      this.$confirm('解绑微信公众号后文章将会清空, 是否继续?', '解绑微信公众号', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: this.nowRobotInfo.wechataccount[0].id,
          robot: ''
        }
        this.$api.user.updateWechatAccounts(params)
          .then(() => {
            this.$message({
              type: 'success',
              message: '解绑成功'
            })
            getRobotList(true)
              .then(() => {
                callBack && callBack()
              })
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '解绑失败，请重试'
            })
          })
      }).catch(() => {})
    },
    showBindPraise (id) {
      let robot = ''
      if (isRealNum(id)) {
        robot = id
      } else {
        robot = this.nowRobot
      }
      window.localStorage.setItem('nowRobot', robot)
      this.setActiveRobot(robot)
      this.authPriaseStore()
    }
  }
}
