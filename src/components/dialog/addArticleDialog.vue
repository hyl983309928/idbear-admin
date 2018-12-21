<template>
  <div>
    <el-dialog
      :visible="addArticleInfo.visible"
      :title="addArticleInfo.type === 'add' ? '新建文章' : '修改文章'"
      width="600px"
      @close="closeAddArticle"
      append-to-body
    >
      <div class="add-article-content">
        <!--<div class="add-article-thumb_url">-->
          <!--<CropperImage v-model="addArticleInfo.thumb_url" :width="450" :height="250">-->
            <!--<div class="plus-icon-box border-radius-4" style="width: 180px;height: 100px;line-height:132px;position: relative;">-->
              <!--<img v-if="addArticleInfo.thumb_url" :src="addArticleInfo.thumb_url" class="uploader-img">-->
              <!--<div v-else>-->
                <!--<i class="el-icon-plus plue-icon"></i>-->
                <!--<span class="upload-icon-text font-size-smaller">上传图片</span>-->
              <!--</div>-->
            <!--</div>-->
          <!--</CropperImage>-->
          <!--<BasicError :show="addArticleInfo.thumbErr" errorMsg="请上传文章封面"></BasicError>-->
        <!--</div>-->
        <div class="add-article-info">
          <el-form :model="addArticleInfo" :rules="addArticleInfo.rule" ref="addArticleForm" label-width="90px" label-position="right" size="medium">
            <el-form-item label="文章封面" prop="thumb_url">
              <CropperImage v-model="addArticleInfo.thumb_url" :width="400" :height="300">
                <div class="plus-icon-box border-radius-4" style="width: 132px;height: 99px;line-height:99px;position: relative;">
                  <img v-if="addArticleInfo.thumb_url" :src="addArticleInfo.thumb_url" class="uploader-img">
                  <div v-else>
                    <i class="el-icon-plus plue-icon"></i>
                    <span class="upload-icon-text font-size-smaller">上传图片</span>
                  </div>
                </div>
              </CropperImage>
            </el-form-item>
            <el-form-item label="文章名称" prop="title">
              <el-input v-model="addArticleInfo.title" placeholder="请输入文章名称"></el-input>
            </el-form-item>
            <el-form-item label="文章链接" prop="url">
              <el-input v-model="addArticleInfo.url" placeholder="请输入文章链接"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer">
        <el-button :loading="addArticleInfo.loading" @click.native="closeAddArticle" size="small">取消</el-button>
        <el-button :loading="addArticleInfo.loading" @click.native="submitAddOrEditArticle" size="small" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validateUrl } from '../../utils/validate'
import { complementUrl } from '@/utils/common'
import CropperImage from '@/components/cropperImage'
import BasicError from '@/components/basicError'
export default {
  components: {
    CropperImage,
    BasicError
  },
  data () {
    return {
      addArticleInfo: {
        type: 'add',
        activeItem: {},
        visible: false,
        thumbErr: false,
        loading: false,
        thumb_url: '',
        title: '',
        url: '',
        rule: {
          thumb_url: [
            { required: true, message: '请上传文章封面', trigger: 'blur' }
          ],
          title: [
            { required: true, message: '请输入文章标题', trigger: 'blur' }
          ],
          url: [
            { required: true, validator: validateUrl, trigger: 'blur' }
          ]
        }
      }
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    activeItem: Object
  },
  computed: {
  },
  created () {},
  methods: {
    submitAddOrEditArticle () {
      // if (!this.addArticleInfo.thumb_url) {
      //   this.addArticleInfo.thumbErr = true
      //   return
      // }
      this.$refs.addArticleForm.validate((validate) => {
        if (validate) {
          let params = {
            title: this.addArticleInfo.title,
            url: complementUrl(this.addArticleInfo.url),
            thumb_url: this.addArticleInfo.thumb_url,
            article_type: 0
          }
          this.addArticleInfo.loading = true
          if (this.addArticleInfo.type === 'add') {
            this.$api.skill.addArticle(params)
              .then((data) => {
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
                this.addArticleInfo.loading = false
                this.addArticleInfo.visible = false
                this.$emit('on-success', data)
              })
              .catch(() => {
                this.$message({
                  type: 'error',
                  message: '添加失败，请重试'
                })
                this.addArticleInfo.loading = false
              })
          } else {
            params.id = this.addArticleInfo.activeItem.id
            this.$api.skill.updateArticleInfo(params)
              .then((data) => {
                this.$message({
                  type: 'success',
                  message: '修改成功'
                })
                this.addArticleInfo.loading = false
                this.addArticleInfo.visible = false
                this.$emit('on-success', data)
              })
              .catch(() => {
                this.$message({
                  type: 'error',
                  message: '修改失败，请重试'
                })
                this.addArticleInfo.loading = false
              })
          }
        }
      })
    },
    closeAddArticle () {
      this.clearArticleInfo()
      this.$refs.addArticleForm.clearValidate()
      this.addArticleInfo.visible = false
    },
    clearArticleInfo () {
      this.addArticleInfo.thumbErr = false
      this.addArticleInfo.thumb_url = ''
      this.addArticleInfo.title = ''
      this.addArticleInfo.url = ''
      this.addArticleInfo.activeItem = {}
    }
  },
  watch: {
    'addArticleInfo.visible': function (val) {
      this.$emit('update:visible', val)
    },
    'addArticleInfo.thumb_url': function (val) {
      this.$refs.addArticleForm.clearValidate(['thumb_url'])
    },
    visible: function (value) {
      this.addArticleInfo.visible = value
      if (value) {
        if (this.activeItem && this.activeItem.id) {
          this.addArticleInfo.type = 'edit'
          this.addArticleInfo.thumb_url = this.activeItem.thumb_url
          this.addArticleInfo.title = this.activeItem.title
          this.addArticleInfo.url = this.activeItem.url
          this.addArticleInfo.activeItem = this.activeItem
        } else {
          this.addArticleInfo.type = 'add'
          this.clearArticleInfo()
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .add-article-content{
    display: flex;
    align-items: center;
    .el-form-item{
      &:last-child{
        margin-bottom: 0;
      }
    }
    .add-article-thumb_url{
      flex-grow: 0;
      position: relative;
    }
    .add-article-info{
      flex-grow: 1;
    }
  }
  .upload-icon-text{
    position: absolute;
    text-align: center;
    display: inline-block;
    left: 0;
    right: 0;
    bottom:18px;
    line-height: 1;
  }
</style>
