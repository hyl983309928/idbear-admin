<template>
  <div>
    <el-dialog
      :visible="showPromptCreateRobotDilaog"
      width="362px"
      :close-on-click-modal="false"
      @close="setShowPromptCreateRobotDilaog(false)"
      center
    >
      <div class="text-center">
        <div class="label font-size-h2">
          您还没创建机器人呢
        </div>
        <div class="btn-box">
          <el-button type="primary" round @click.native="createRobot">
            立即创建
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {},
  data () {
    return {}
  },
  computed: {
    ...mapGetters([
      'showPromptCreateRobotDilaog'
    ])
  },
  created () {},
  methods: {
    ...mapActions([
      'setShowPromptCreateRobotDilaog',
      'setShowAddRobotDialog'
    ]),
    createRobot () {
      this.setShowPromptCreateRobotDilaog(false)
      this.setShowAddRobotDialog(true)
    }
  },
  watch: {}
}
</script>

<style scoped lang="scss">
  .label{
    margin-bottom: 40px;
  }
  .btn-box{
    padding-bottom: 30px;
  }
</style>
