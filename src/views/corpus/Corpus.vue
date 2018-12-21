/**
* desc: 机器人管理-私有语料库
* */
<template>
<div class="is-content-block">
  <div class="corpus-box" v-if="corpusList.length !== 0">
    <div class="corpus-tabs font-size-zero">
      <div class="corpus-tab-item" v-for="(item) in corpusList" :key="item.id">
        <button size="small" @click="changeCorpusActive(item.id)" class="idbear-btn btn-blue" :class="{'is-active': item.id == corpusActive}">
          {{item.corpus_batch_name}}<i @click.stop.prevent="handleTabRemove(item.id)" class="el-icon-close corpus-btn-close" v-if="!item.is_sys_batch"></i>
        </button>
      </div>
      <div class="corpus-tab-item">
        <button @click="addCorpus" size="small" class="idbear-btn btn-white">
          <i class="el-icon-plus corpus-btn-puls"></i>添加语料库
        </button>
      </div>
    </div>

    <div class="corpus-list-content">
      <div class="tab-pane-box" v-for="(item) in corpusList" :key="item.id" v-if="item.id == corpusActive">
        <BasicTable
          :list="item.list"
          :loading="item.loading"
          :total="item.count"
          :page="item.page"
          :length="item.length"
          pagination-align="right"
          :ref="'corpusTable'+item.id"
          :rowClassName="'cursor-pointer'"
          :searchStype="{ 'padding': '15px 0', }"
          :default-sort="{prop: item.order_field, order: order2orderMap[item.order]}"
          @current-change="changePage($event, item)"
          @size-change="changeTabelLength($event, item)"
          @sort-change="handleSortChange($event, item)"
          @select-all="handleSelectionAll($event, item)"
          @select="handleSelection($event, item)"
          @row-click="addOrEditCorpusItem($event, 'edit')"
        >
          <template slot="search">
            <el-button icon="el-icon-plus" size="small" @click.native="addOrEditCorpusItem(item, 'add')">新增语料</el-button>
            <el-button icon="el-icon-plus" size="small" @click.native="showImportCorpus=true;">批量导入</el-button>
            <el-button size="small" @click.native="exportExcel">导出Excel</el-button>
            <div style="float: right;" class="font-size-zero">
              <el-input @keydown.enter.native="searchCorpus(item)" v-model="item.searchKey" placeholder="根据问题、答案搜索" style="width: 300px;" size="small"></el-input>
              <el-button @click.native="searchCorpus(item)" type="primary" slot="append" size="small" style="margin-left: 20px" >搜索</el-button>
            </div>
          </template>
          <template>
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="status"
              label="状态"
              width="70"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.is_enable">已启用</span>
                <span class="text-color-placeholder" v-else>已停用</span>
              </template>
            </el-table-column>
            <el-table-column
              label="问题"
              min-width="150"
              align="left"
            >
              <template slot-scope="scope">
                {{scope.row.parse_question_list[0]}}
              </template>
            </el-table-column>
            <el-table-column
              label="答案"
              align="left"
              min-width="300"
            >
              <template slot-scope="scope">
                <span @click="eventStop" style="line-height: 25px;" v-html="parseEmojiCode(newline2br(scope.row.parse_answer_list.text_answer))"></span>
              </template>
            </el-table-column>
            <el-table-column
              label="类型"
              :formatter="countCorpusType"
              width="150"
            >
            </el-table-column>
            <el-table-column
              prop="update_time"
              label="修改时间"
              sortable="custom"
              width="160"
            >
              <template slot-scope="scope">
                <template v-if="scope.row.update_time">
                  {{formatDate(scope.row.update_time, 'YYYY-MM-DD HH:mm')}}
                </template>
              </template>
            </el-table-column>
          </template>
          <template slot="footerLeft">
            <span>已选择{{item.selectionList.length}}条语料：</span>
            <a @click="delCorpusObject(item)" style="margin-left: 5px">删除</a>
            <a @click="openOrCloseCorpusObject(item, 'open')" style="margin-left: 5px;" class="color-yellow">启用</a>
            <a @click="openOrCloseCorpusObject(item, 'close')" style="margin-left: 5px" class="color-red">停用</a>
          </template>
        </BasicTable>
      </div>
    </div>
  </div>
  <div class="corpus-null" v-else>
    <div class="corpus-null-label font-size-title">您还没有语料库，快来创建一个吧</div>
    <el-button icon="el-icon-plus" @click="addCorpus">
      添加语料库
    </el-button>
  </div>
  <AddOrEditCorpusDialog
    :visible.sync="showAddCorpus"
    :corpusObjectId="addCorpusInfo.corpusObjectId"
    :batchId="corpusActive"
    @on-success="addOrEditCorpusSuccess"
  ></AddOrEditCorpusDialog>
  <el-dialog
    :visible="showImportCorpus"
    :close-on-click-modal="false"
    width="500px"
    title="批量导入语料"
    @close="closeImportCorpus"
    @open="uploadFile.showError=false;"
  >
    <div class="dialog-import-corpus">
      <p>
        请点击<a href="/static/doc/语料仓库模板.xlsx" download="语料库模板.xlsx" target="_blank">语料库模板</a>下载文档模板，按格式填写后提交
      </p>
      <div style="text-align: center;margin-top: 20px;position: relative;">
        <el-button @click.native="chooseFile" class="file-btn" style="width: 50%;overflow: hidden;text-overflow: ellipsis;">{{uploadFile.selectFile.name?uploadFile.selectFile.name: '选择文件'}}</el-button>
        <div class="color-gray font-size-smaller">注意：文件最大支持20M</div>
        <BasicError :show="uploadFile.showError" :errorMsg="uploadFile.errorMsg"></BasicError>
      </div>
      <input @change="selectFileChange" type="file" id="file" name="file" style="display: none" />
    </div>
    <div slot="footer" class="dialog-corpus-footer">
      <el-button @click.native="showImportCorpus = false" size="small">取消</el-button>
      <el-button @click.native="importCorpus" type="primary" size="small">确定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import BasicTable from '@/components/basicTable'
import BasicError from '@/components/basicError'
import ContentPick from '@/components/contentPick'
import trim from 'lodash/trim'
import findIndex from 'lodash/findIndex'
import pullAllBy from 'lodash/pullAllBy'
import { mapActions } from 'vuex'
import { formatDate } from '../../utils/date'
import { checkRobotListExist } from '@/lib/modules/user'
import { order2orderMap } from '@/lib/config/index'
import AddOrEditCorpusDialog from '@/components/dialog/addOrEditCorpusDialog'
import emojiMixin from '@/mixins/emoji'
import { newline2br } from '../../utils/common'
import { getHashParamter, toUrlHash } from '@/utils/common'

export default {
  components: {
    BasicTable,
    ContentPick,
    AddOrEditCorpusDialog,
    BasicError
  },
  mixins: [emojiMixin],
  data () {
    return {
      order2orderMap,
      tableInfo: {
        page: 1,
        total: 0,
        length: 20
      },
      corpusActive: '', // 当前选中的语料库
      showAddCorpus: false, // 是否展示添加语料弹窗
      showImportCorpus: false, // 是否展示批量导入语料弹窗
      uploadFile: { // 批量导入语料信息哦
        showError: false,
        errorMsg: '上传文件类型错误',
        selectFile: ''
      },
      addCorpusInfo: { // 添加或修改语料弹窗信息
        corpusObjectId: ''
      },
      corpusList: [] // 语料库list
    }
  },
  computed: {
    activeItem () {
      let item = this.corpusList.find((x) => {
        return x.id === this.corpusActive
      })
      return item
    }
  },
  created () {
    let hashParams = getHashParamter()
    this.corpusActive = hashParams.corpusActive ? parseInt(hashParams.corpusActive) : ''
    checkRobotListExist(this.init)
  },
  mounted () {},
  methods: {
    init () {
      this.getAllCorpus()
    },
    initHash (item) {
      let hashParams = getHashParamter()
      item.length = hashParams.page_size ? parseInt(hashParams.page_size) : 20
      item.page = hashParams.page ? parseInt(hashParams.page) : 1
      item.count = hashParams.count ? parseInt(hashParams.count) : 0
      item.searchKey = hashParams.search || ''
      item.order = hashParams.order || ''
      item.order_field = hashParams.order_field || ''
    },
    addUrlHash () {
      let item = this.activeItem
      let params = {
        'corpusActive': this.corpusActive,
        'page': item.page,
        'page_size': item.length,
        'search': item.searchKey,
        'order': item.order,
        'order_field': item.order_field,
        'count': item.count
      }
      toUrlHash(params)
    },
    newline2br,
    formatDate,
    countCorpusType (row) {
      let typeList = []
      if (row.parse_answer_list.text_answer && row.parse_answer_list.text_answer.length) {
        typeList.push('文本')
      }
      if (row.parse_answer_list.img_answer && row.parse_answer_list.img_answer.length !== 0 && row.parse_answer_list.img_answer[0].url) {
        typeList.push('图片')
      }
      if (row.parse_answer_list.material_answer && row.parse_answer_list.material_answer.length !== 0) {
        typeList.push('图文素材')
      }
      return typeList.join('/')
    },
    changeCorpusActive (val) {
      if (this.corpusActive === val) {
        return
      }
      this.corpusActive = val
      this.addUrlHash()
      this.getCorpusObject()
    },
    // 得到所有的语料库
    getAllCorpus () {
      this.$api.corpus.getAllCorpus()
        .then((data) => {
          let corpusList = this.handleCorpus(data)
          if (corpusList.length !== 0) {
            let item = corpusList.find(item => item.id === this.corpusActive)
            if (item) {
              this.corpusActive = item.id
              this.initHash(item)
            } else {
              this.corpusActive = data[0].id
            }
            this.corpusList = corpusList
            this.getCorpusObject()
          }
        })
    },
    // 初始化语料库
    handleCorpus (obj) {
      if (Object.prototype.toString.call(obj) === '[object Array]') {
        obj.map((item) => {
          item.selectionList = []
          item.loading = false
          item.page = this.tableInfo.page
          item.count = this.tableInfo.total
          item.length = this.tableInfo.length
          item.list = []
          item.searchKey = ''
          item.order = ''
          item.order_field = ''
          return item
        })
        return obj
      } else {
        obj.selectionList = []
        obj.loading = false
        obj.page = this.tableInfo.page
        obj.count = this.tableInfo.total
        obj.length = this.tableInfo.length
        obj.list = []
        obj.searchKey = ''
        obj.order = ''
        obj.order_field = ''
        return obj
      }
    },
    // 添加语料库
    addCorpus () {
      var _this = this
      this.$prompt('', '添加语料库', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputErrorMessage: '语料库名称支持1-10个字符且不能重复',
        inputPlaceholder: '请输入语料库名称',
        inputValidator (value) {
          let temp = trim(value)
          let flag = _this.corpusList.some((item) => {
            return item.corpus_batch_name === temp
          })
          if (temp && temp.length > 0 && temp.length <= 10 && !flag) {
            return true
          } else {
            return false
          }
        }
      }).then(({value}) => {
        let parmas = {
          corpus_batch_name: trim(value),
          robot: window.localStorage.getItem('nowRobot'),
          is_sys_batch: false
        }
        this.$api.corpus.createCorpus(parmas)
          .then((data) => {
            let corpusItem = this.handleCorpus(data)
            this.corpusList.push(corpusItem)
            this.corpusActive = corpusItem.id
          })
          .catch((data) => {
            this.$message.error({
              message: '添加失败，请重试！'
            })
          })
      }).catch(() => {})
    },
    // 删除语料库
    handleTabRemove (id) {
      this.$confirm('是否删除该语料库?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.corpus.delCorpus(id)
          .then(() => {
            this.corpusList = this.corpusList.filter((item) => {
              return item.id !== parseInt(id)
            })
            if (id === this.corpusActive && this.corpusList.length !== 0) {
              this.corpusActive = this.corpusList[0].id
            }
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
      }).catch(() => {})
    },
    // 处理表格选中
    handleSelection (row, corpusItem) {
      let index = findIndex(corpusItem.selectionList, (item) => { return item.id === row.id })
      if (index === -1) {
        corpusItem.selectionList.push(row)
      } else {
        corpusItem.selectionList.splice(index, 1)
      }
    },
    // 处理表格点击全选
    handleSelectionAll (val, corpusItem) {
      if (val.length === 0) {
        let temp = corpusItem.selectionList.concat([])
        pullAllBy(temp, corpusItem.list, 'id')
        corpusItem.selectionList = temp.concat([])
      } else {
        val.forEach((item) => {
          let index = findIndex(corpusItem.selectionList, (selectitem) => { return selectitem.id === item.id })
          if (index === -1) {
            corpusItem.selectionList.push(item)
          }
        })
      }
    },
    // 处理表格翻页
    changePage (page, corpusItem) {
      corpusItem.page = page
      this.getCorpusObject(corpusItem)
    },
    changeTabelLength (length, corpusItem) {
      corpusItem.page = 1
      corpusItem.length = length
      this.getCorpusObject(corpusItem)
    },
    handleSortChange (data, corpusItem) {
      corpusItem.order_field = data.prop
      corpusItem.order = this.order2orderMap[data.order]
      corpusItem.page = 1
      this.getCorpusObject(corpusItem)
    },
    // 得到某一个语料库下所有语料
    getCorpusObject () {
      let item = this.activeItem
      let params = {
        'batch_id': item.id,
        'page': item.page,
        'page_size': item.length,
        'search': item.searchKey,
        'order': item.order,
        'order_field': item.order_field
      }
      item.list = []
      item.loading = true
      this.$api.corpus.getCorpusObject(params)
        .then((data) => {
          data.results.map((x) => {
            x.parse_question_list = JSON.parse(x.question_list)
            x.parse_answer_list = JSON.parse(x.answer_list)
            return x
          })
          item.list = data.results
          item.count = data.count
          this.addUrlHash()
          item.loading = false
          this.$nextTick(() => {
            this.toggleRowSelection(item)
          })
        })
    },
    // 查询某一个语料库下的语料
    searchCorpus (item) {
      item.page = 1
      this.getCorpusObject(item)
    },
    // 处理翻页时的单列选中状态
    toggleRowSelection (corpusItem) {
      corpusItem.list.forEach((item) => {
        corpusItem.selectionList.find((selectitem) => {
          if (item.id === selectitem.id) {
            this.$refs['corpusTable' + corpusItem.id][0].$refs.basicTable.toggleRowSelection(item)
            return true
          }
        })
      })
    },
    // 选择文件
    chooseFile () {
      document.getElementById('file').click()
    },
    // 选择文件成功后处理
    selectFileChange (event) {
      var file = event.currentTarget.files[0]
      if (!file.name.match(/(.xlsx|.xls)$/)) {
        this.uploadFile.showError = true
        this.uploadFile.errorMsg = '上传文件类型错误'
        return false
      } else if (file.size > 20 * 1024 * 1024) {
        this.uploadFile.showError = true
        this.uploadFile.errorMsg = '上传文件太大，请上传20M以内的文件'
        return false
      } else {
        this.uploadFile.showError = false
        this.uploadFile.selectFile = file
      }
    },
    ...mapActions([
      'setShowUploadDialog',
      'setLoading'
    ]),
    closeImportCorpus () {
      this.uploadFile.selectFile = ''
      document.getElementById('file').value = ''
      this.showImportCorpus = false
    },
    // 文件上传成功确认更改
    importCorpus () {
      if (this.uploadFile.selectFile) {
        this.$api.upload(this.uploadFile.selectFile)
          .then((data) => {
            let item = this.corpusList.find((x) => {
              return String(x.id) === String(this.corpusActive)
            })
            this.$api.corpus.corpusBatch(item, data[0].url)
              .then((data) => {
                this.setShowUploadDialog(false)
                this.showImportCorpus = false
                this.$message({
                  type: 'success',
                  message: '导入成功!'
                })
                item.page = 1
                this.getCorpusObject(item)
              })
              .catch(() => {
                this.setShowUploadDialog(false)
                this.$message({
                  type: 'error',
                  message: '导入失败，请检查文件格式后重试'
                })
              })
          })
        this.setShowUploadDialog(true)
      } else {
        this.uploadFile.showError = true
        this.uploadFile.errorMsg = '尚未选择上传文件，无法上传'
      }
    },
    // 添加或修改单条语料
    addOrEditCorpusItem (item, type) {
      if (type === 'add') {
        this.addCorpusInfo = {
          corpusObjectId: ''
        }
        this.showAddCorpus = true
      } else if (type === 'edit') {
        this.addCorpusInfo = {
          corpusObjectId: item.id
        }
        this.showAddCorpus = true
      }
    },
    // 批量删除语料
    delCorpusObject (item) {
      if (item.selectionList.length === 0) {
        return
      }
      this.$confirm('是否删除该语料?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = this.$loading({
          lock: true,
          text: '删除中',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        let ids = []
        item.selectionList.forEach((item) => {
          ids.push(item.id)
        })
        this.recursionDelCorpusObject(ids, 0, item)
      })
    },
    recursionDelCorpusObject (list, index = 0, corpusItem) {
      if (index === list.length) {
        this.loading.close()
        this.$message({
          type: 'success',
          message: '删除完成'
        })
        corpusItem.page = 1
        corpusItem.searchKey = ''
        corpusItem.selectionList = []
        this.getCorpusObject(corpusItem)
        return false
      }
      this.$api.corpus.delCorpusObject(list[index], corpusItem.id)
        .then((data) => {
          this.recursionDelCorpusObject(list, index + 1, corpusItem)
        })
        .catch(() => {
          this.recursionDelCorpusObject(list, index + 1, corpusItem)
        })
    },
    // 启用或禁用语料库
    openOrCloseCorpusObject (item, type) {
      if (item.selectionList.length === 0) {
        return
      }
      this.loading = this.$loading({
        lock: true,
        text: '处理中',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.recursionOpenOrCloseCorpusObject(item.selectionList, 0, type)
    },
    // 通过list递归启用或禁用语料库
    recursionOpenOrCloseCorpusObject (selectionList, index = 0, type) {
      if (selectionList.length === index) {
        this.loading.close()
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        return
      }
      // 当为开启语料的时候flag为true
      let flag = false
      if (type === 'open') {
        flag = true
      }
      // 判断当前是否为开启（关闭）状态，是则跳过
      if (selectionList[index].is_enable === flag) {
        this.recursionOpenOrCloseCorpusObject(selectionList, index + 1, type)
      } else {
        selectionList[index].is_enable = flag
        this.$api.corpus.updateCorpusObject(selectionList[index])
          .then(() => {
            this.recursionOpenOrCloseCorpusObject(selectionList, index + 1, type)
          })
          .catch(() => {
            this.recursionOpenOrCloseCorpusObject(selectionList, index + 1, type)
          })
      }
    },
    addOrEditCorpusSuccess (data) {
      if (this.corpusObjectId) {
        this.activeItem.page = 1
        this.activeItem.searchKey = ''
        this.getCorpusObject()
      } else {
        this.activeItem.page = 1
        this.activeItem.searchKey = ''
        this.getCorpusObject()
      }
    },
    eventStop (event) {
      if (event.target.tagName === 'A') {
        event.stopPropagation()
      }
    },
    exportExcel () {
      this.$confirm('是否确认导出Excel?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        let columns = [
          {
            label: '问题【必填】',
            prop: 'question0'
          },
          {
            label: '相似问法1【选填】',
            prop: 'question1'
          },
          {
            label: '相似问法2【选填】',
            prop: 'question2'
          },
          {
            label: '相似问法3【选填】',
            prop: 'question3'
          },
          {
            label: '相似问法4【选填】',
            prop: 'question4'
          },
          {
            label: '相似问法5【选填】',
            prop: 'question5'
          },
          {
            label: '相似问法6【选填】',
            prop: 'question6'
          },
          {
            label: '相似问法7【选填】',
            prop: 'question7'
          },
          {
            label: '相似问法8【选填】',
            prop: 'question8'
          },
          {
            label: '相似问法9【选填】',
            prop: 'question9'
          },
          {
            label: '文本答案【必填】',
            prop: 'text_answer'
          },
          {
            label: '答案商品URL1【选填】',
            prop: 'goods1'
          },
          {
            label: '答案商品URL2【选填】',
            prop: 'goods2'
          },
          {
            label: '答案商品URL3【选填】',
            prop: 'goods3'
          },
          {
            label: '答案商品URL4【选填】',
            prop: 'goods4'
          },
          {
            label: '答案商品URL5【选填】',
            prop: 'goods5'
          }
        ]
        let info = {
          title: this.activeItem.corpus_batch_name,
          columns: columns,
          data: [],
          preHeader: [['请不要删除该行，否则再次导入会缺失一条语料']]
        }
        let item = this.activeItem
        let params = {
          'batch_id': item.id,
          'page': 1,
          'page_size': 999999,
          'search': item.searchKey,
          'order': item.order,
          'order_field': item.order_field
        }
        this.$api.corpus.getCorpusObject(params)
          .then((data) => {
            let list = data.results
            list.map((x) => {
              x.parse_question_list = JSON.parse(x.question_list)
              x.parse_answer_list = JSON.parse(x.answer_list)
              return x
            })
            let tableData = []
            list.forEach((item) => {
              let temp = {}
              for (let i = 0; i < 10; i++) {
                temp[`question${i}`] = item.parse_question_list[i] || ''
              }
              temp['text_answer'] = item.parse_answer_list.text_answer
              tableData.push(temp)
            })
            info.data = tableData
            this.$export.excel(info)
          })
      }).catch(() => {
      })
    }
  },
  watch: {
    // 当语料库切换时检测是否请求过该语料库的数据，没有则请求
    // corpusActive (val) {
    //   if (val) {
    //     this.addUrlHash()
    //     if (this.activeItem && this.activeItem.list && this.activeItem.list.length !== 0) {
    //     } else {
    //       this.getCorpusObject()
    //     }
    //   }
    // }
  }
}
</script>

<style scoped lang="scss">
@import "@/style/variate.scss";
.corpus-null{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 400px;
  .corpus-null-label{
    margin-bottom: 20px;
  }
}
.corpus-box{
  .corpus-search{
    padding: 15px 0;
  }
  .corpus-tabs{
    .corpus-tab-item{
      display: inline-block;
      margin-right: 20px;
      margin-bottom: 10px;
      .corpus-btn-close{
        font-size: 12px;
        margin-left: 10px;
        border-radius: 50% 50%;
        &:hover{
          color: #333;
        }
      }
    }
  }
}
  .answer-comm-title{
    position: relative;
    line-height: 1.4em;
    max-height: 2.8em;
    overflow: hidden;
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .answer-comm-title-discard{
    color: $red;
  }
</style>
