/**
* desc: 上传弹窗组件
* */
<template>
<div>
  <el-dialog
    :visible="showUploadDialog"
    :close-on-click-modal="false"
    width="500px"
    :title="uploadTitle"
    append-to-body
    :show-close="false"
    :close-on-press-escape="false"
  >
    <div class="dialog-center">
      <i class="el-icon-loading"></i>
      <span>正在上传（{{parseInt(uploadProgress)}}%）</span>
      <span v-if="uploadProgress==100">上传成功，系统正在处理，请稍等</span>
    </div>
    <div slot="footer" class="dialog-footer" >
      <el-popover
        placement="top"
        width="200"
        v-model="visible">
        <p  style="text-align: center;line-height: 30px;">是否终止导入？</p>
        <div style="text-align: center; margin: 0">
          <el-button size="mini" @click="visible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="close">确定</el-button>
        </div>
        <el-button slot="reference" :disabled="uploadProgress==100" style="width: 60%;">取消</el-button>
      </el-popover>
    </div>
  </el-dialog>
</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {},
  data () {
    return {
      visible: false
    }
  },
  computed: {
    ...mapGetters([
      'showUploadDialog',
      'uploadProgress',
      'uploadTitle',
      'source'
    ])
  },
  created () {},
  methods: {
    ...mapActions([
      'setShowUploadDialog',
      'setUploadProgress',
      'setUploadTitle',
      'setSource'
    ]),
    close () {
      this.visible = false
      this.source.cancel('手动取消请求')
      this.setSource()
      this.setShowUploadDialog(false)
      this.$message({
        type: 'success',
        message: '取消成功'
      })
    }
  },
  watch: {
    uploadProgress (value) {
      if (value === 100) {
        this.visible = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.dialog-footer{
  text-align: center;
}
  .dialog-center{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    span{
      font-size: 16px;
      display: inline-block;
      margin-top: 10px;
    }
    i{
      font-size: 30px;
    }
  }
</style>
