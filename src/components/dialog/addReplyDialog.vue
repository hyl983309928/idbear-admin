<template>
<div>
  <el-dialog
    :visible="addReplyInfo.visible"
    :title="addReplyInfo.type === 'add' ? '添加回复' : '修改回复'"
    width="600px"
    @close="closeDialog"
    append-to-body
  >
    <div class="add-reply-content">
      <el-form :model="addReplyInfo.replyInfo" :rules="addReplyInfo.rule" ref="addReplyForm">
        <el-form-item prop="text">
          <el-input
            type="textarea"
            ref="textarea"
            v-model="addReplyInfo.replyInfo.text"
            :autosize="{ minRows: 5, maxRows: 8}"
            placeholder="请输入回复内容"
            resize="none"
            :maxlength="512"
            @blur="answerTextBlur"
          >
          </el-input>
        </el-form-item>
        <div>
          <AddLinkDialog
            @on-success="addLinkToCorpus"
          ></AddLinkDialog>
          <AddEmojiDialog
            @click-emoji="addEmojiToCorpus"
            style="margin-left: 10px;"
          ></AddEmojiDialog>
        </div>
      </el-form>
    </div>
    <div slot="footer">
      <el-button :loading="addReplyInfo.loading" @click.native="closeDialog" size="small">取消</el-button>
      <el-button :loading="addReplyInfo.loading" @click.native="submitAddOrEditReply" size="small" type="primary">确定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import { getInputCursorPosition, insertString, setInputCursorPosition, complementUrl } from '@/utils/common'
import AddLinkDialog from '@/components/dialog/addLinkDialog'
import AddEmojiDialog from '@/components/dialog/addEmojiDialog'
export default {
  components: {
    AddLinkDialog,
    AddEmojiDialog
  },
  mixins: [],
  data () {
    return {
      addReplyInfo: {
        type: 'add',
        activeItem: {},
        visible: false,
        loading: false,
        replyInfo: {
          text: ''
        },
        rule: {
          text: [
            { required: true, message: '请输入回复文本', trigger: 'blur' }
          ]
        },
        cursorPosition: 0
      }
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    replyInfo: Object
  },
  computed: {},
  created () {
  },
  mounted () {
  },
  methods: {
    closeDialog () {
      this.$refs.addReplyForm.clearValidate()
      this.addReplyInfo.visible = false
    },
    answerTextBlur () {
      this.addReplyInfo.cursorPosition = getInputCursorPosition(this.$refs.textarea.$refs.textarea)
    },
    addLinkToCorpus (data) {
      let insertStr = `<a href="${complementUrl(data.linkUrl)}">${data.linkText}</a>`
      this.addReplyInfo.replyInfo.text = insertString(this.addReplyInfo.replyInfo.text, insertStr, this.addReplyInfo.cursorPosition)
      setInputCursorPosition(this.$refs.textarea.$refs.textarea, this.addReplyInfo.cursorPosition + insertStr.length)
    },
    addEmojiToCorpus (emoji) {
      let insertStr = `[${emoji}]`
      this.addReplyInfo.replyInfo.text = insertString(this.addReplyInfo.replyInfo.text, insertStr, this.addReplyInfo.cursorPosition)
      setInputCursorPosition(this.$refs.textarea.$refs.textarea, this.addReplyInfo.cursorPosition + insertStr.length)
    },
    submitAddOrEditReply () {
      this.$refs.addReplyForm.validate((validate) => {
        if (validate) {
          this.$emit('on-success', this.addReplyInfo.replyInfo)
          this.closeDialog()
        }
      })
    }
  },
  watch: {
    'addReplyInfo.visible': function (val) {
      this.$emit('update:visible', val)
    },
    visible: function (val) {
      this.addReplyInfo.visible = val
      if (this.replyInfo && this.replyInfo.text) {
        this.addReplyInfo.type = 'edit'
        this.addReplyInfo.replyInfo.text = this.replyInfo.text
      } else {
        this.addReplyInfo.type = 'add'
        this.addReplyInfo.replyInfo.text = ''
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
