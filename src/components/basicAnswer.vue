<template>
  <div>
    <div class="dialog-corpus-answer-content">
      <div class="dialog-corpus-answer-tabs font-size-zero">
        <button class="btn btn-medium" @click.stop.prevent="active='text'" :class="[active=='text'?'active':'']">文字</button>
        <button class="btn btn-medium" @click.stop.prevent="active='image'" :class="[active=='image'?'active':'']">图片</button>
        <button v-if="showMaterial" class="btn btn-medium" @click.stop.prevent="active='content'" :class="[active=='content'?'active':'']">图文素材{{answer_list.material_answer_obj.length===0?'':`(${answer_list.material_answer_obj.length})`}}</button>
      </div>
      <div class="dialog-corpus-answer-pane">
        <div id="answer-text" v-show="active == 'text'">
          <el-input
            type="textarea"
            ref="textarea"
            v-model="answer_list.text_answer"
            :autosize="{ minRows: 5, maxRows: 8}"
            placeholder="请输入内容"
            resize="none"
            :maxlength="512"
            @blur="answerTextBlur"
          >
          </el-input>
          <div style="margin-top: 10px;">
            <AddLinkDialog
              :visible.sync="showAddLinkDialog"
              @on-success="addLinkToCorpus"
            ></AddLinkDialog>
            <AddEmojiDialog
              @click-emoji="addEmojiToCorpus"
              style="margin-left: 10px;"
            ></AddEmojiDialog>
          </div>
        </div>
        <div v-show="active == 'image'">
          <div class="img-list">
            <CropperImage @upload-success="handleUploadAnswerImgSuccess" :isCropper="false" :disabled="disabled">
              <div class="border-radius-4 cursor-pointer img-item" :style="{cursor: disabled ? 'not-allowed' : '', color: disabled ? '#c0c4cc' : '', borderColor: disabled ? '#c0c4cc' : ''}" v-if="answer_list.img_answer[0] && answer_list.img_answer[0].url" style="display: inline-block;">
                <img :src="answer_list.img_answer[0].url" class="uploader-img" style="height: 156px;">
                <i @click.stop.prevent="handleDelAnswerImg(0)" class="iconfont icon-shanchu img-delete-icon text-color-common"></i>
              </div>
              <div class="plus-icon-box" :style="{cursor: disabled ? 'not-allowed' : '', color: disabled ? '#c0c4cc' : '', borderColor: disabled ? '#c0c4cc' : ''}" v-else style="height: 156px;width: 156px;">
                <i class="el-icon-plus plue-icon" ></i>
              </div>
            </CropperImage>
          </div>
        </div>
        <div v-show="active == 'content'">
          <BasicTable
            :list="answer_list.material_answer_obj"
            :isSearch="false"
            :isPagination="false"
          >
            <el-table-column
              prop="id"
              label="ID"
              width="100px"
            >
            </el-table-column>
            <el-table-column
              prop="title"
              label="素材名称"
            >
              <template slot-scope="scope">
                <p class="answer-comm-title"><span v-if="scope.row.is_display === 0" class="answer-comm-title-discard">(已失效)</span>{{scope.row.info[materialTypeMap[scope.row.type].title_field]}}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="picture"
              label="素材图片"
              width="80px"
            >
              <template slot-scope="scope">
                <img :src="scope.row.info[materialTypeMap[scope.row.type].img_field]" width="40" height="40"/>
              </template>
            </el-table-column>
            <el-table-column
              prop="type"
              label="素材类型"
              width="80px"
            >
              <template slot-scope="scope">
                <span>{{materialTypeMap[scope.row.type].label}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="160px"
            >
              <template slot-scope="scope">
                <a @click="moveSelectComm(scope.$index, 'up')" class="color-blue">上移</a>
                <a @click="moveSelectComm(scope.$index, 'down')" class="color-green" style="margin-left: 5px;">下移</a>
                <a @click="delSelectComm(scope.$index)" class="color-red" style="margin-left: 5px;">删除</a>
              </template>
            </el-table-column>
          </BasicTable>
          <div class="add-Commodity-btn">
            <el-button @click.native="showContentPick = true" plain size="medium" type="primary" icon="el-icon-plus">添加素材</el-button>
          </div>
        </div>
      </div>
    </div>
    <ContentPick
      v-model="showContentPick"
      @select="selectedMaterial"
      :selectedList="answer_list.material_answer_obj"
    >
    </ContentPick>
  </div>
</template>

<script>
import CropperImage from '@/components/cropperImage'
import ContentPick from '@/components/contentPick'
import BasicTable from '@/components/basicTable'
import { getInputCursorPosition, insertString, setInputCursorPosition, complementUrl } from '@/utils/common'
import AddLinkDialog from '@/components/dialog/addLinkDialog'
import AddEmojiDialog from '@/components/dialog/addEmojiDialog'
import { materialTypeMap } from '../lib/config/answer'

export default {
  components: {
    CropperImage,
    ContentPick,
    AddLinkDialog,
    AddEmojiDialog,
    BasicTable
  },
  mixins: [],
  data () {
    return {
      materialTypeMap,
      active: 'text',
      showAddLinkDialog: false,
      cursorPosition: '',
      showContentPick: false,
      answer_list: {
        text_answer: '',
        img_answer: [{
          url: '',
          wx_url: '',
          media_id: ''
        }],
        material_answer: [], // 素材id的数组
        material_answer_obj: [] // 素材对象的数组
      }
    }
  },
  props: {
    answerInfo: Object,
    showMaterial: {
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
    // this.answer_list = this.answerInfo
  },
  mounted () {},
  methods: {
    selectedMaterial (selectedComm) {
      this.answer_list.material_answer_obj = selectedComm
    },
    answerTextBlur () {
      this.cursorPosition = getInputCursorPosition(this.$refs.textarea.$refs.textarea)
    },
    addLinkToCorpus (data) {
      let insertStr = `<a href="${complementUrl(data.linkUrl)}">${data.linkText}</a>`
      this.answer_list.text_answer = insertString(this.answer_list.text_answer, insertStr, this.cursorPosition)
      setInputCursorPosition(this.$refs.textarea.$refs.textarea, this.cursorPosition + insertStr.length)
    },
    addEmojiToCorpus (emoji) {
      let insertStr = `[${emoji}]`
      this.answer_list.text_answer = insertString(this.answer_list.text_answer, insertStr, this.cursorPosition)
      setInputCursorPosition(this.$refs.textarea.$refs.textarea, this.cursorPosition + insertStr.length)
    },
    handleUploadAnswerImgSuccess (url) {
      if (this.answer_list.img_answer[0]) {
        this.answer_list.img_answer[0].url = url
      } else {
        let item = {
          url: url,
          wx_url: '',
          media_id: ''
        }
        this.answer_list.img_answer.push(item)
      }
    },
    handleDelAnswerImg (index) {
      this.answer_list.img_answer.splice(index, 1)
    },
    moveSelectComm (index, type) {
      if (type === 'down') {
        if (index === this.answer_list.material_answer_obj.length - 1) {
          return false
        }
        this.answer_list.material_answer_obj.splice(index + 2, 0, this.answer_list.material_answer_obj[index])
        this.answer_list.material_answer_obj.splice(index, 1)
      } else if (type === 'up') {
        if (index === 0) {
          return false
        }
        this.answer_list.material_answer_obj.splice(index - 1, 0, this.answer_list.material_answer_obj[index])
        this.answer_list.material_answer_obj.splice(index + 1, 1)
      }
    },
    delSelectComm (index) {
      this.answer_list.material_answer_obj.splice(index, 1)
    }
  },
  watch: {
    answer_list: {
      handler: function (val) {
        this.$emit('on-change', val)
      },
      deep: true
    },
    answerInfo: {
      handler: function (val) {
        if (val) {
          this.answer_list = val
        } else {
          this.answer_list = {
            text_answer: '',
            img_answer: [{
              url: '',
              wx_url: '',
              media_id: ''
            }],
            material_answer: [], // 素材id的数组
            material_answer_obj: [] // 素材对象的数组
          }
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped lang="scss">
  @import "@/style/variate.scss";
  .active{
    background: $blue !important;
    color: #fff;
  }
  .dialog-corpus-answer-content{
    .btn{
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      background: #fff;
      border: 1px solid $border-color-one;
      border-color: $border-color-one;
      color: #606266;
      -webkit-appearance: none;
      text-align: center;
      box-sizing: border-box;
      outline: none;
      margin: 0;
      transition: .1s;
      font-weight: 500;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      padding: 10px 20px;
      font-size: 14px;
      border-radius: 4px;
      margin-right: 20px;
      &:hover{
        background: $blue;
        color: #fff;
      }
    }
    .active{
      background: $blue !important;
      color: #fff;
    }
    .dialog-corpus-answer-pane{
      margin-top: 20px;
      .add-Commodity-btn{
        margin-top: 15px;
      }
      .answer-text-link{
        font-size: 24px;
        &:active{
          color: $blue;
        }
      }
      .img-list{
        padding: 0px 0;
        .img-item{
          display: inline-block;
          height: 156px;
          margin-right: 10px;
          position: relative;
          border: 1px solid #fff;
          &:hover{
            border: 1px solid $blue;
          }
          .img-delete-icon{
            cursor: pointer;
            font-size: 14px;
            position: absolute;
            right: 6px;
            top: 6px;
            &:hover{
              color: #999;
            }
          }
          img{
            height: 100%;
          }
        }
      }
    }
  }
</style>
