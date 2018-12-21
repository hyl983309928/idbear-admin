<template>
<div class="component-cropper-image">
  <div @click="startupUploadImg">
    <slot>
      <!--<div class="cropper-icon-box">-->
        <!--<img v-if="value" :src="value" class="uploader-img">-->
        <!--<i v-else class="el-icon-plus uploader-icon"></i>-->
      <!--</div>-->
      <div>
        <div class="border-radius-4 img-box cursor-pointer" :style="{cursor: disabled ? 'not-allowed' : '', color: disabled ? '#c0c4cc' : '', borderColor: disabled ? '#c0c4cc' : ''}" v-if="value" style="display: inline-block;">
          <img :src="value" class="uploader-img" :style="{ height: iconHeight + 'px'}">
          <i v-if="isDelImg" @click.stop.prevent="delImg" class="iconfont icon-shanchu img-delete-icon text-color-common"></i>
        </div>
        <div class="plus-icon-box" v-else :style="{ height: iconHeight + 'px', width: iconWidth + 'px', cursor: disabled ? 'not-allowed' : '', color: disabled ? '#c0c4cc' : '', borderColor: disabled ? '#c0c4cc' : ''}">
          <i  class="el-icon-plus plue-icon" ></i>
        </div>
      </div>
    </slot>
    <input @change="uploadImg" type="file" ref="upload" accept="image/png, image/jpeg, image/jpg, image/bmp" style="display: none;" />
  </div>
  <transition name="dialog-fade">
  <div class="cropper-box-wrapper"  v-show="cropperInfo.visible">
    <div class="cropper-box box-shadow">
      <div class="cropper-body">
        <vueCropper
          ref="cropper"
          :img="uploadImgUrl"
          :outputSize="0.7"
          outputType="jpeg"
          :autoCrop="true"
          :fixed="true"
          :fixedNumber="[width, height]"
          centerBox
          :autoCropWidth="width"
          :autoCropHeight="height"
        ></vueCropper>
      </div>
      <div class="cropper-header">
        <div class="cropper-header-left">
          <el-button class="btn" @click="rotateCropper('left')" size="small">左转</el-button>
          <el-button class="btn" @click="rotateCropper('right')" size="small">右转</el-button>
        </div>
        <div class="cropper-header-right">
          <el-button class="btn" @click="cancelCropper" size="small">取消</el-button>
          <el-button class="btn" @click="submitUpload" type="primary" size="small">确定</el-button>
        </div>
      </div>
    </div>
  </div>
  </transition>
</div>
</template>

<script>
import VueCropper from 'vue-cropper'
import { photoCompress } from '@/utils/changeImgSize'
export default {
  components: {
    VueCropper
  },
  data () {
    return {
      uploadImgUrl: '',
      cropperInfo: {
        visible: false
      }
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 200
    },
    isCropper: {
      type: Boolean,
      default: true
    },
    iconWidth: {
      type: Number,
      default: 100
    },
    iconHeight: {
      type: Number,
      default: 100
    },
    isDelImg: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  created () {
  },
  methods: {
    startupUploadImg () {
      if (!this.disabled) {
        this.$refs.upload.click()
      }
    },
    uploadImg (e) {
      var file = e.target.files[0]
      if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp' || file.type === 'image/jpg') {
      } else {
        this.$message({
          type: 'error',
          message: '上传图片只能为JPG|PNG|BMP格式'
        })
        e.target.value = ''
        return
      }
      if (this.isCropper) {
        var reader = new FileReader()
        reader.onload = (e) => {
          let data
          if (typeof e.target.result === 'object') {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]))
          } else {
            data = e.target.result
          }
          this.uploadImgUrl = data
          this.cropperInfo.visible = true
        }
        // 转化为base64
        // reader.readAsDataURL(file)
        // 转化为blob
        reader.readAsDataURL(file)
      } else {
        if (file.size / 1024 > 10 * 1024) {
          this.$message({
            type: 'error',
            message: '上传图片大小不能超过10M'
          })
          e.target.value = ''
          return
        }
        this.uploadFile(file)
      }
    },
    rotateCropper (type) {
      if (type === 'left') {
        this.$refs.cropper.rotateLeft()
      } else if (type === 'right') {
        this.$refs.cropper.rotateRight()
      }
    },
    cancelCropper () {
      this.cropperInfo.visible = false
      this.$refs.upload.value = ''
    },
    submitUpload () {
      this.$refs.cropper.getCropBlob((data) => {
        this.uploadFile(data)
      })
    },
    uploadFile (file) {
      this.loading = this.$loading({
        lock: true,
        text: '上传中',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (file.size / 1024 > 0.5 * 1024) {
        let quality = 0.65
        if (file.size / 1024 > 6 * 1024) {
          quality = 0.2
        } else if (file.size / 1024 > 3 * 1024) {
          quality = 0.3
        } else if (file.size / 1024 > 1 * 1024) {
          quality = 0.5
        }
        photoCompress(file, {quality: quality}, (blob) => {
          this.$refs.upload.value = ''
          this.$api.upload(blob)
            .then((data) => {
              this.loading.close()
              this.cropperInfo.visible = false
              this.$emit('input', data[0].url)
              this.$emit('upload-success', data[0].url)
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '上传失败'
              })
              this.loading.close()
            })
        })
      } else {
        this.$refs.upload.value = ''
        this.$api.upload(file)
          .then((data) => {
            this.loading.close()
            this.cropperInfo.visible = false
            this.$emit('input', data[0].url)
            this.$emit('upload-success', data[0].url)
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '上传失败'
            })
            this.loading.close()
          })
      }
    },
    photoCompressTo500K (flie, callback) {
    },
    delImg () {
      this.$confirm('是否确认删除该照片, 是否继续?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('input', '')
        this.$emit('on-delete', '')
      }).catch(() => {})
    }
  },
  watch: {
    'cropperInfo.visible': (val) => {
      if (val) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/style/variate.scss';
  .img-box{
    overflow: hidden;
    position: relative;
    border: 1px solid #fff;
    &:hover{
      border: 1px solid $blue;
    }
  }
  .img-delete-icon{
    cursor: pointer;
    line-height: 1;
    font-size: 14px;
    position: absolute;
    right: 6px;
    top: 6px;
    &:hover{
      color: #999;
    }
  }
  .component-cropper-image{
    display: inline-block;
    vertical-align: top;
    .uploader-img{
      height: 100%;
    }
    .cropper-box-wrapper{
      z-index: 2003;
      background: rgba(0, 0, 0, 0.4);
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cropper-box{
      background: #fff;
      width: 600px;
      min-height: 552px;
      position: relative;
      padding: 24px;
      .cropper-body{
        width: 100%;
        height: 452px;
        margin-bottom: 20px;
      }
      .cropper-header{
        display: flex;
        .cropper-header-left{
          flex-grow: 1;
          font-size: 0;
          height: 32px;
        }
        .cropper-header-right{
          flex-grow: 0;
          font-size: 0;
          height: 32px;
        }
      }

    }
  }

</style>
