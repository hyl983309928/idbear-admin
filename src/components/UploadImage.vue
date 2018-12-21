<template>
<div class="component-upload-image">
  <el-upload
    action="http://aip.id-bear.com:8000/generalfileupload/"
    list-type="picture-card"
    :on-success="handleUploadSuccess"
    :before-upload="handleBeforeUpload"
    :on-error="handleUploadError"
    name="files"
    :show-file-list="false"
    :headers="{ Authorization: 'JWT ' + token }"
    style="display: inline-block;vertical-align: top;"
  >
    <img v-if="value" :src="value" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      token: window.localStorage.getItem('token')
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {},
  created () {},
  methods: {
    handleUploadSuccess (data) {
      this.$emit('input', data[0].url)
      this.loading.close()
    },
    handleBeforeUpload () {
      this.loading = this.$loading({
        lock: true,
        text: '上传中',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    handleUploadError () {
      this.$message({
        type: 'error',
        message: '上传失败'
      })
      this.loading.close()
    }
  },
  watch: {}
}
</script>

<style scoped lang="scss">
  @import "@/style/variate.scss";
  .component-upload-image{
  }
.avatar{
  width: 100%;
  height: 100%;
}
</style>
