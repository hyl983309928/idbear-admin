<template>
  <div>
    <el-dialog
      :visible="showBindWechatSuccessDialog"
      width="650px"
      :close-on-click-modal="false"
      @close="setShowBindWechatSuccessDialog(false)"
      center
    >
      <div class="bind-wechat-success-box">
        <div class="bind-wechat-success-title">恭喜你授权成功！</div>
        <div class="bind-wechat-success-desc font-size-h3">你还可以把AI机器人添加至微信H5、有赞店铺、公众号菜单哦</div>
        <div class="bind-wechat-success-btn">
          <el-button class="wechat-btn" size="medium" type="primary" @click.native="goSetting" style="margin-right: 20px;">去看看</el-button>
          <el-button class="wechat-btn text-color-minor" size="medium" @click.native="setShowBindWechatSuccessDialog(false)">以后再说</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import commonMixin from '@/mixins/common'
export default {
  components: {},
  mixins: [commonMixin],
  data () {
    return {}
  },
  computed: {
    ...mapGetters([
      'showBindWechatSuccessDialog'
    ])
  },
  created () {},
  methods: {
    ...mapActions([
      'setShowBindWechatSuccessDialog'
    ]),
    goSetting () {
      this.setShowBindWechatSuccessDialog(false)
      this.goto('/setting/index')
    }
  },
  watch: {}
}
</script>

<style scoped lang="scss">
.bind-wechat-success-box{
  min-height: 315px;
  text-align: center;
  .bind-wechat-success-title{
    font-size: 24px;
    margin-bottom: 40px;
    padding-top: 45px;
  }
  .bind-wechat-success-desc{
    margin-bottom: 80px;
  }
}
</style>
