<template>
<div>
  <el-dialog
    custom-class="scroll-body-dialog"
    :visible.sync="showAddCorpus"
    :close-on-click-modal="false"
    width="740px"
    :title="addCorpusInfo.type=='add'?'添加语料':'编辑语料'"
  >
    <div class="dialog-corpus-main">
      <div class="dialog-corpus-issue">
        <div class="dialog-corpus-issue-item" v-for="(item,index) in addCorpusInfo.question_list" :key="index">
          <label class="dialog-corpus-issue-item-label">{{index==0?'问题':`问法${index+1}`}}</label>
          <el-input class="dialog-corpus-issue-item-input" v-model="addCorpusInfo.question_list[index]" :maxlength="64" :placeholder="index==0?'请输入访客可能提出的问题，最多64字符':'请输入相似问法，最多64字符'"></el-input>
          <i @click="delCorpusQuestion(index)" class="dialog-corpus-issue-item-del el-icon-circle-close-outline cursor-pointer" :style="{ 'visibility': index!=0? '':'hidden'}"></i>
        </div>
        <div class="dialog-corpus-add-issue">
          <a v-if="addCorpusInfo.question_list.length < 10" @click="addCorpusInfo.question_list.push('')">+添加更多问法</a>
        </div>
      </div>
      <div class="dialog-corpus-answer">
        <label class="dialog-corpus-answer-label">答案</label>
        <BasicAnswer
          v-if="showAddCorpus"
          @on-change="changeAnswer"
          class="dialog-corpus-answer-content"
          :answerInfo="addCorpusInfo.answer_list"
        ></BasicAnswer>
      </div>
    </div>
    <div slot="footer" class="dialog-corpus-footer">
      <el-button :loading="addCorpusInfo.loading" @click.native="showAddCorpus = false" size="small">取消</el-button>
      <el-button :loading="addCorpusInfo.loading" @click.native="submitHandleCorpusItem" type="primary" size="small">确定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import compact from 'lodash/compact'
import BasicAnswer from '@/components/basicAnswer'
export default {
  components: {
    BasicAnswer
  },
  data () {
    return {
      showAddCorpus: this.visible,
      addCorpusInfo: { // 添加或修改语料弹窗信息
        loading: false,
        corpusInfo: {},
        type: 'add',
        question_list: [''],
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
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    corpusObjectId: [String, Number],
    batchId: [String, Number],
    defaultQuestion: Array,
    defaultAnswer: Object
  },
  computed: {},
  created () {},
  methods: {
    // 删除语料的问法
    delCorpusQuestion (index) {
      this.addCorpusInfo.question_list.splice(index, 1)
    },
    // 提交添加或修改单条语料
    changeAnswer (obj) {
      this.addCorpusInfo.answer_list = obj
    },
    submitHandleCorpusItem () {
      if (!this.addCorpusInfo.answer_list.text_answer && !this.addCorpusInfo.answer_list.img_answer[0].url && this.addCorpusInfo.answer_list.material_answer_obj.length === 0) {
        this.$message({
          type: 'error',
          message: '请填写一个答案'
        })
        return
      } else if (compact(this.addCorpusInfo.question_list).length === 0) {
        this.$message({
          type: 'error',
          message: '请填写问题'
        })
        return
      }
      this.addCorpusInfo.answer_list.material_answer = this.handleMaterialAnswer(this.addCorpusInfo.answer_list.material_answer_obj)
      let answerList = {
        material_answer: this.addCorpusInfo.answer_list.material_answer,
        img_answer: this.addCorpusInfo.answer_list.img_answer,
        text_answer: this.addCorpusInfo.answer_list.text_answer
      }
      let params = {
        question_list: JSON.stringify(compact(this.addCorpusInfo.question_list)),
        answer_list: JSON.stringify(answerList),
        corpus_batch: this.batchId
      }
      this.addCorpusInfo.loading = true
      if (this.addCorpusInfo.type === 'edit') {
        params.id = this.addCorpusInfo.corpusInfo.id
        this.$api.corpus.updateCorpusObject(params)
          .then((data) => {
            this.showAddCorpus = false
            this.addCorpusInfo.loading = false
            this.$emit('on-success', data)
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '修改失败，请重试'
            })
            this.addCorpusInfo.loading = false
          })
      } else if (this.addCorpusInfo.type === 'add') {
        this.$api.corpus.addCorpusObject(this.batchId || '', params)
          .then((data) => {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.showAddCorpus = false
            this.$emit('on-success', data)
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '添加失败，请重试'
            })
            this.addCorpusInfo.loading = false
          })
      }
    },
    // 处理商品回答的列表，把对象中的item_id提取出来
    handleMaterialAnswer (list) {
      let temp = []
      list.forEach((item) => {
        let addItem = {
          id: item.id,
          type: item.type
        }
        temp.push(addItem)
      })
      return temp
    },
    // 通过id数组得到素材列表
    getMaterials (id) {
      let list = this.addCorpusInfo.answer_list.material_answer
      if (!list || list.length === 0) {
        return
      }
      this.$api.corpus.getMaterialList(id, list)
        .then((data) => {
          data.material_answer.forEach(item => {
            item.info = item.obj
          })
          this.addCorpusInfo.answer_list.material_answer_obj = data.material_answer
        })
    },
    // 添加或修改单条语料
    handleCorpusData (type) {
      this.addCorpusInfo = {
        corpusInfo: {},
        loading: false,
        type: 'add',
        question_list: [''],
        answer_list: {
          text_answer: '',
          img_answer: [
            {
              url: '',
              wx_url: '',
              media_id: ''
            }
          ],
          material_answer: [],
          material_answer_obj: []
        }
      }
      if (type === 'add') {
        if (this.defaultQuestion && this.defaultQuestion.length > 0) {
          this.addCorpusInfo.question_list = this.defaultQuestion
        }
        if (this.defaultAnswer) {
          if (this.defaultAnswer.img_answer[0] && this.defaultAnswer.img_answer[0].url) {
            this.addCorpusInfo.answer_list.img_answer = this.defaultAnswer.img_answer
          }
          if (this.defaultAnswer.material_answer.length > 0) {
            this.addCorpusInfo.answer_list.material_answer = this.defaultAnswer.material_answer
            this.addCorpusInfo.answer_list.material_answer_obj = this.defaultAnswer.material_answer_obj
          }
          this.addCorpusInfo.answer_list.text_answer = this.defaultAnswer.text_answer
        }
      } else if (type === 'edit') {
        this.addCorpusInfo.type = 'edit'
        this.$api.corpus.getSingleCorpusObject(this.corpusObjectId)
          .then((data) => {
            if (data.results[0]) {
              data.results[0].parse_question_list = JSON.parse(data.results[0].question_list)
              data.results[0].parse_answer_list = JSON.parse(data.results[0].answer_list)
              this.addCorpusInfo.corpusInfo = data.results[0]
              this.addCorpusInfo.question_list = data.results[0].parse_question_list
              this.addCorpusInfo.answer_list = {
                text_answer: data.results[0].parse_answer_list.text_answer,
                img_answer: data.results[0].parse_answer_list.img_answer || [],
                material_answer: data.results[0].parse_answer_list.material_answer || [],
                material_answer_obj: data.results[0].parse_answer_list.material_answer_obj || []
              }
              this.getMaterials(data.results[0].id)
            } else {
              this.addCorpusInfo.type = 'add'
            }
          })
      }
    }
  },
  watch: {
    showAddCorpus: function (val) {
      this.$emit('update:visible', val)
    },
    visible: function (value) {
      this.showAddCorpus = value
      if (value) {
        if (this.corpusObjectId) {
          this.handleCorpusData('edit')
        } else {
          this.handleCorpusData('add')
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
  @import "@/style/variate.scss";
  .dialog-corpus-main{
    .dialog-corpus-issue{
      margin-bottom: 20px;
      .dialog-corpus-issue-item{
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        .dialog-corpus-issue-item-label{
          width: 40px;
          flex-grow: 0;
          flex-shrink: 0;
        }
        .dialog-corpus-issue-item-input{
          flex-grow: 1;
        }
        .dialog-corpus-issue-item-del{
          flex-grow: 0;
          margin-left: 5px;
          color: #999;
        }
      }
      .dialog-corpus-add-issue{
        text-align: right;
      }
    }
    .dialog-corpus-answer{
      display: flex;
      .dialog-corpus-answer-label{
        width: 40px;
        line-height: 40px;
        flex-shrink: 0;
        flex-grow: 0;
      }
      .dialog-corpus-answer-content{
        flex-grow: 1;
      }
    }
  }
</style>
