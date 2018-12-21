<template>
<div>
  <el-dialog
    :visible="addGoodInfo.visible"
    :title="addGoodInfo.type=='add'?'新建商品':'修改商品'"
    width="600px"
    @close="closeAddGood"
    append-to-body
  >
    <div class="add-good-content">
      <!--<div class="add-good-picture">-->
        <!--<CropperImage v-model="addGoodInfo.picture" :width="450" :height="250">-->
          <!--<div class="plus-icon-box border-radius-4" style="width: 180px;height: 100px;line-height:132px;position: relative;">-->
            <!--<img v-if="addGoodInfo.picture" :src="addGoodInfo.picture" class="uploader-img">-->
            <!--<div v-else>-->
              <!--<i class="el-icon-plus plue-icon"></i>-->
              <!--<span class="upload-icon-text font-size-smaller">上传图片</span>-->
            <!--</div>-->
          <!--</div>-->
        <!--</CropperImage>-->
        <!--<BasicError :show="addGoodInfo.pictureErr" errorMsg="请上传商品图片"></BasicError>-->
      <!--</div>-->
      <div class="add-good-info">
        <el-form :model="addGoodInfo" :rules="addGoodInfo.rule" ref="addGoodForm" label-width="90px" label-position="right" size="medium">
          <el-form-item label="商品封面" prop="picture">
            <CropperImage v-model="addGoodInfo.picture" :width="400" :height="300">
              <div class="plus-icon-box border-radius-4" style="width: 132px;height: 99px;line-height:99px;position: relative;">
                <img v-if="addGoodInfo.picture" :src="addGoodInfo.picture" class="uploader-img">
                <div v-else>
                  <i class="el-icon-plus plue-icon"></i>
                  <span class="upload-icon-text font-size-smaller">上传图片</span>
                </div>
              </div>
            </CropperImage>
          </el-form-item>
          <el-form-item label="商品名称" prop="title">
            <el-input v-model="addGoodInfo.title" placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="price">
            <el-input v-model.number="addGoodInfo.price" placeholder="请输入商品价格（最多两位小数）">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品链接" prop="detail_url">
            <el-input v-model="addGoodInfo.detail_url" placeholder="请输入商品链接"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div slot="footer">
      <el-button :loading="addGoodInfo.loading" @click.native="closeAddGood" size="small">取消</el-button>
      <el-button :loading="addGoodInfo.loading" @click.native="submitAddOrEditGood" size="small" type="primary">确定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import { validateUrl } from '../../utils/validate'
import { complementUrl } from '@/utils/common'
import CropperImage from '@/components/cropperImage'
import BasicError from '@/components/basicError'
import { numMulti } from '../../utils/common'

export default {
  components: {
    CropperImage,
    BasicError
  },
  data () {
    let validateInteger = function (rule, value, callback) {
      let price = numMulti(value, 100)
      if (price > 1000000000) {
        callback(new Error('价格最大为一千万元'))
      }
      if (typeof price === 'number' && parseInt(price) === price) {
        callback()
      } else {
        callback(new Error('价格最多为2位小数'))
      }
    }
    return {
      addGoodInfo: {
        type: 'add',
        activeItem: {},
        visible: this.visible,
        pictureErr: false,
        loading: false,
        picture: '',
        title: '',
        price: 0,
        detail_url: '',
        rule: {
          picture: [
            { required: true, message: '请上传商品封面', trigger: 'blur' }
          ],
          title: [
            { required: true, message: '请输入商品名称', trigger: 'blur' }
          ],
          detail_url: [
            { required: true, validator: validateUrl, trigger: 'blur' }
          ],
          price: [
            { required: true, message: '请输入商品价格', trigger: 'blur' },
            { type: 'number', message: '商品价格必须为数字' },
            { type: 'number', min: 0, message: '商品价格不能为负数' },
            { validator: validateInteger, trigger: 'blur' }
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
    submitAddOrEditGood () {
      // if (!this.addGoodInfo.picture) {
      //   this.addGoodInfo.pictureErr = true
      //   return
      // }
      this.$refs.addGoodForm.validate((validate) => {
        if (validate) {
          let params = {
            title: this.addGoodInfo.title,
            price: numMulti(this.addGoodInfo.price, 100),
            detail_url: complementUrl(this.addGoodInfo.detail_url),
            picture: this.addGoodInfo.picture
          }
          this.addGoodInfo.loading = true
          if (this.addGoodInfo.type === 'add') {
            this.$api.skill.addGood(params)
              .then((data) => {
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
                this.addGoodInfo.loading = false
                this.addGoodInfo.visible = false
                this.$emit('on-success', data)
              })
              .catch(() => {
                this.$message({
                  type: 'error',
                  message: '添加失败，请重试'
                })
                this.addGoodInfo.loading = false
              })
          } else {
            params.id = this.addGoodInfo.activeItem.id
            this.$api.skill.updateGoodInfo(params)
              .then((data) => {
                this.$message({
                  type: 'success',
                  message: '修改成功'
                })
                this.addGoodInfo.loading = false
                this.addGoodInfo.visible = false
                this.$emit('on-success', data)
              })
              .catch(() => {
                this.$message({
                  type: 'error',
                  message: '修改失败，请重试'
                })
                this.addGoodInfo.loading = false
              })
          }
        }
      })
    },
    closeAddGood () {
      this.clearGoodsInfo()
      this.$refs.addGoodForm.clearValidate()
      this.addGoodInfo.visible = false
    },
    clearGoodsInfo () {
      this.addGoodInfo.pictureErr = false
      this.addGoodInfo.picture = ''
      this.addGoodInfo.title = ''
      this.addGoodInfo.price = 0
      this.addGoodInfo.detail_url = ''
      this.addGoodInfo.activeItem = {}
    }
  },
  watch: {
    'addGoodInfo.visible': function (val) {
      this.$emit('update:visible', val)
    },
    'addGoodInfo.picture': function (val) {
      this.$refs.addGoodForm.clearValidate(['picture'])
    },
    visible: function (value) {
      this.addGoodInfo.visible = value
      if (value) {
        if (this.activeItem && this.activeItem.id) {
          this.addGoodInfo.type = 'edit'
          this.addGoodInfo.picture = this.activeItem.picture
          this.addGoodInfo.title = this.activeItem.title
          this.addGoodInfo.price = this.activeItem.price / 100
          this.addGoodInfo.detail_url = this.activeItem.detail_url
          this.addGoodInfo.activeItem = this.activeItem
        } else {
          this.addGoodInfo.type = 'add'
          this.clearGoodsInfo()
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .add-good-content{
    display: flex;
    align-items: center;
    .el-form-item{
      &:last-child{
        margin-bottom: 0;
      }
    }
    .add-good-picture{
      flex-grow: 0;
      position: relative;
    }
    .add-good-info{
      flex-grow: 1;
    }
  }
  .upload-icon-text{
    position: absolute;
    text-align: center;
    display: inline-block;
    left: 0;
    right: 0;
    bottom: 18px;
    line-height: 1;
  }
</style>
