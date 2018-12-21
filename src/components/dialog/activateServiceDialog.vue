<template>
<div>
  <el-dialog
    :visible="showActivateServiceDialog"
    :title="`你正在为${activeRobotInfo.title}机器人升级/续费`"
    :close-on-click-modal="false"
    width="500px"
    @close="closeDialog"
    @open="initData"
  >
    <div>
      <el-input v-model="activateServiceInfo.code" placeholder="请输入激活码"></el-input>
      <!--<div style="text-align: right;" ><a @click="buyCode">购买激活码>></a></div>-->
    </div>
    <span slot="footer">
      <el-button @click="closeDialog" size="small">取消</el-button>
      <el-button type="primary" @click="activateService" size="small">激活</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import { getRobotList } from 'lib/modules/user.js'
import { mapGetters, mapActions } from 'vuex'
import { handleAuthRouters } from '../../router/handleAuthRouter'

export default {
  components: {},
  data () {
    return {
      activateServiceInfo: {
        code: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'showActivateServiceDialog',
      'activeRobot',
      'robotList'
    ]),
    activeRobotInfo () {
      let item = this.robotList.find(item => item.id === this.activeRobot)
      return item || {}
    }
  },
  created () {},
  methods: {
    ...mapActions([
      'setShowActivateServiceDialog'
    ]),
    initData () {
      this.activateServiceInfo = {
        code: ''
      }
    },
    closeDialog () {
      this.setShowActivateServiceDialog(false)
      this.initData()
    },
    activateService () {
      this.$api.user.upgrade(this.activeRobot, this.activateServiceInfo.code)
        .then((data) => {
          this.$message({
            type: 'success',
            message: '升级成功'
          })
          this.closeDialog()
          getRobotList(true)
            .then(() => {
              handleAuthRouters()
            })
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: '升级失败，请检查激活码'
          })
        })
    },
    buyCode () {
      window.open('https://h5.youzan.com/v2/goods/3nvgcd5e4nu0w')
    }
  },
  watch: {}
}
</script>

<style scoped lang="scss">

</style>
