<template>
<div class="add-link-component">
  <div class="icon-box">
    <slot>
      <i @click="show = true" class="iconfont icon-lianjie1 cursor-pointer icon"></i>
    </slot>
  </div>
  <el-dialog
    :visible.sync="show"
    append-to-body
    width="400px"
    title="插入链接"
  >
    <el-form ref="addLinkForm" :rules="addLinkRule" :model="addLinkInfo">
      <el-form-item label="文本内容" prop="linkText">
        <el-input v-model="addLinkInfo.linkText" placeholder="请输入文本内容"></el-input>
      </el-form-item>
      <el-form-item label="链接地址" prop="linkUrl">
        <el-input v-model="addLinkInfo.linkUrl" placeholder="请输入链接地址"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-corpus-footer">
      <el-button @click.native="show = false" size="small">取消</el-button>
      <el-button @click.native="submit" type="primary" size="small">确定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import { validateUrl } from '@/utils/validate'
export default {
  components: {},
  data () {
    return {
      show: false,
      addLinkRule: {
        linkUrl: [
          { required: true, message: '请输入链接内容', trigger: 'blur' },
          { validator: validateUrl, trigger: 'blur' }
        ],
        linkText: [
          { required: true, message: '请输入文本内容', trigger: 'blur' }
        ]
      },
      addLinkInfo: {
        linkUrl: '',
        linkText: ''
      }
    }
  },
  computed: {
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  created () {
    this.show = this.visible
  },
  methods: {
    submit () {
      this.$refs.addLinkForm.validate((validate) => {
        if (validate) {
          this.$emit('on-success', this.addLinkInfo)
          this.show = false
          this.$refs.addLinkForm.resetFields()
        }
      })
    }
  },
  watch: {
    show: function (val) {
      this.$emit('update:visible', val)
    },
    visible: function (value) {
      this.show = value
      if (value && this.$refs.addLinkForm) {
        this.$refs.addLinkForm.resetFields()
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/style/variate.scss";
.add-link-component{
  display: inline-block;
}
.icon-box{
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50% 50%;
  overflow: hidden;
  background: $blue;
  text-align: center;
  line-height: 20px;
  .icon{
    font-size: 12px;
    color: #fff;
  }
}

</style>
