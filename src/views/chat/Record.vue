<template>
<div class="is-content-block">
  <div class="record-search">
    <div class="record-search-filter">
      <el-form :model="tableInfo" :inline="true" style="display: flex; flex-wrap: wrap;" size="small">
        <el-form-item label="">
          <el-select @change="filterList" v-model="tableInfo.filterInfo.status" style="width: 110px;margin-right: 10px;">
            <el-option
              :label="'全部问答'"
              :value="''"
            ></el-option>
            <el-option
              v-for="item in chatOkStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select @change="filterList" v-model="tableInfo.filterInfo.chat_type" style="width: 110px;margin-right: 10px;">
            <el-option
              :label="'全部渠道'"
              :value="''"
            ></el-option>
            <el-option
              v-for="item in chatTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" style="flex-grow: 1;">
          <el-date-picker
            v-model="tableInfo.filterInfo.date"
            type="daterange"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            :clearable="true"
            @change="filterList"
            style="width: 250px;"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item style="margin-right: 0">
          <div class="font-size-zero">
            <el-input @keydown.enter.native="searchList" v-model="tableInfo.searchInfo.key" placeholder="根据问题、答案、用户名搜索" size="small" style="width: 240px;"></el-input>
            <el-button @click.native="searchList" type="primary" size="small" style="margin-left: 20px">搜索</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="record-search-key">
    </div>
  </div>
  <div class="record-list" v-loading="tableInfo.loading">
    <div v-if="chatList.length != 0" v-for="(item) in chatList" :key="item.id">
      <UserChatItem :item="item" :userInfo="item.from_wechat_user || {}" @on-optimize="optimizeCorpus"></UserChatItem>
    </div>
    <div v-if="chatList.length == 0">
      <p class="null-text">
        该时间段内没有对话
      </p>
    </div>
    <el-pagination
      class="list-pagination"
      layout="total, sizes, prev, pager, next, jumper"
      background
      :current-page="tableInfo.page"
      :page-size="tableInfo.length"
      :page-sizes="[10, 20, 50, 100]"
      :total="tableInfo.count"
      @current-change="pageChange"
      @size-change="handleSizeChange"
     >
    </el-pagination>
  </div>
  <AddOrEditCorpusDialog
    :visible.sync="addCorpusInfo.visible"
    :corpusObjectId="addCorpusInfo.corpusObjectId"
    :default-question="addCorpusInfo.question"
    :default-answer="addCorpusInfo.answer"
    @on-success="addOrEditCorpusSuccess"
  ></AddOrEditCorpusDialog>
</div>
</template>

<script>
import UserChatItem from '@/components/userChatItem'
import { mapGetters } from 'vuex'
import { checkRobotListExist } from '../../lib/modules/user'
import dateMixin from '@/mixins/date'
import { chatTypeList } from '../../lib/config'
import { replyTypeList, chatOkStatusList } from '../../lib/config/chat'
import AddOrEditCorpusDialog from '@/components/dialog/addOrEditCorpusDialog'
import { getHashParamter, toUrlHash } from '@/utils/common'
export default {
  components: {
    UserChatItem,
    AddOrEditCorpusDialog
  },
  mixins: [dateMixin],
  data () {
    return {
      chatTypeList,
      replyTypeList,
      chatOkStatusList,
      materialTypeMap: {
        'good': {
          label: '商品',
          title_field: 'title',
          img_field: 'picture'
        },
        'article': {
          label: '文章',
          title_field: 'title',
          img_field: 'thumb_url'
        },
        'store': {
          label: '微主页',
          title_field: 'chs_name',
          img_field: 'logo_url'
        }
      },
      tableInfo: {
        page: 1,
        count: 0,
        length: 20,
        loading: false,
        filterInfo: {
          date: '',
          status: '',
          chat_type: '',
          from_wechat_user__generaluser__id: ''
        },
        searchInfo: {
          key: ''
        }
      },
      chatList: [],
      addCorpusInfo: {
        visible: false,
        corpusObjectId: '',
        optimizeChatId: '',
        question: [],
        answer: {}
      }
    }
  },
  computed: {
    ...mapGetters([
      'nowRobotInfo'
    ]),
    params () {
      let params = {
        page: this.tableInfo.page,
        page_size: this.tableInfo.length,
        search: this.tableInfo.searchInfo.key,
        chat_type: this.tableInfo.filterInfo.chat_type,
        add_time_gte: this.tableInfo.filterInfo.date && this.tableInfo.filterInfo.date[0],
        add_time_lte: this.tableInfo.filterInfo.date && this.tableInfo.filterInfo.date[1],
        status: this.tableInfo.filterInfo.status,
        from_wechat_user__generaluser__id: this.tableInfo.filterInfo.from_wechat_user__generaluser__id
      }
      return params
    }
  },
  created () {
    this.initHash()
    checkRobotListExist(this.init)
  },
  methods: {
    init () {
      this.getChatRecordList()
    },
    initHash () {
      let hashParams = getHashParamter()
      this.tableInfo.length = hashParams.page_size ? parseInt(hashParams.page_size) : 20
      this.tableInfo.page = hashParams.page ? parseInt(hashParams.page) : 1
      this.tableInfo.count = hashParams.count ? parseInt(hashParams.count) : 0
      this.tableInfo.searchInfo.key = hashParams.search || ''
      this.tableInfo.filterInfo.status = hashParams.status ? parseInt(hashParams.status) : ''
      this.tableInfo.filterInfo.from_wechat_user__generaluser__id = hashParams.from_wechat_user__generaluser__id || ''
      // if (hashParams.is_ok === 'true') {
      //   this.tableInfo.filterInfo.is_ok = true
      // } else if (hashParams.is_ok === 'false') {
      //   this.tableInfo.filterInfo.is_ok = false
      // }
      this.tableInfo.filterInfo.chat_type = hashParams.chat_type || ''
      if (hashParams.add_time_gte && hashParams.add_time_lte) {
        this.tableInfo.filterInfo.date = []
        this.tableInfo.filterInfo.date[0] = hashParams.add_time_gte
        this.tableInfo.filterInfo.date[1] = hashParams.add_time_lte
      }
    },
    addUrlHash () {
      let params = JSON.parse(JSON.stringify(this.params))
      params.count = this.tableInfo.count
      toUrlHash(params)
    },
    getChatRecordList () {
      this.tableInfo.loading = true
      this.chatList = []
      let params = JSON.parse(JSON.stringify(this.params))
      params.add_time_lte = params.add_time_lte ? params.add_time_lte + ' 23:59:59' : ''
      if (params.status === 1) {
        params.is_satisfy = '2'
      } else if (params.status === 2) {
        params.is_satisfy = ['0', '1']
        params.is_ok = false
      } else if (params.status === 3) {
        params.is_satisfy = ['0', '1']
        params.is_ok = true
      }
      this.$api.chat.getChatRecordList(params)
        .then((data) => {
          this.tableInfo.count = data.count
          this.addUrlHash()
          data.results.map((item) => {
            try {
              item.parse_reply_msg = JSON.parse(item.reply_msg)
            } catch (e) {
              item.parse_reply_msg = ''
            }
            return item
          })
          this.chatList = data.results
          this.tableInfo.loading = false
        })
    },
    searchList () {
      this.tableInfo.page = 1
      this.getChatRecordList()
    },
    filterList () {
      this.tableInfo.page = 1
      this.getChatRecordList()
    },
    pageChange (page) {
      this.tableInfo.page = page
      this.getChatRecordList()
    },
    handleSizeChange (length) {
      this.tableInfo.page = 1
      this.tableInfo.length = length
      this.getChatRecordList()
    },
    addOrEditCorpusSuccess (corpusObjectInfo) {
      let item = this.chatList.find(item => item.id === this.addCorpusInfo.optimizeChatId)
      let params = {
        is_ok: true,
        id: item.id,
        corpus_id: corpusObjectInfo.id
      }
      this.$api.chat.updateChatRecord(params)
        .then((data) => {
          item.is_ok = true
          item.corpus_id = corpusObjectInfo.id
          this.$message({
            type: 'success',
            message: '优化成功，已成功添加至默认语料库'
          })
        })
    },
    optimizeCorpus (obj) {
      this.addCorpusInfo.optimizeChatId = obj.id
      this.addCorpusInfo.corpusObjectId = obj.corpus_id
      this.addCorpusInfo.answer = {
        text_answer: '',
        img_answer: obj.parse_reply_msg.img_reply,
        material_answer: [],
        material_answer_obj: []
      }
      if (obj.parse_reply_msg.content_reply && obj.parse_reply_msg.content_reply.length > 0) {
        this.addCorpusInfo.answer.text_answer = obj.parse_reply_msg.content_reply[0]
      }
      let fieldList = ['store_reply', 'goods_reply', 'article_reply']

      fieldList.forEach((key) => {
        if (obj.parse_reply_msg[key].length > 0) {
          obj.parse_reply_msg[key].forEach((item) => {
            let temp = {
              id: item.material_id,
              type: item.type
            }
            this.addCorpusInfo.answer.material_answer.push(temp)
          })
        }
      })
      fieldList.forEach((key) => {
        if (obj.parse_reply_msg[key].length > 0) {
          obj.parse_reply_msg[key].forEach((item) => {
            let temp = {
              type: item.type,
              id: item.material_id,
              info: {
                id: item.material_id,
                type: item.type
              }
            }
            temp.info[this.materialTypeMap[item.type].title_field] = item.title
            temp.info[this.materialTypeMap[item.type].img_field] = item.image
            this.addCorpusInfo.answer.material_answer_obj.push(temp)
          })
        }
      })
      this.addCorpusInfo.answer.material_answer.splice(4)
      this.addCorpusInfo.answer.material_answer_obj.splice(4)
      this.addCorpusInfo.question = [obj.ask_msg]
      this.addCorpusInfo.visible = true
    }
  },
  watch: {}
}
</script>

<style scoped lang="scss">
.null-text{
  text-align: center;
  padding: 200px;
}
  .list-pagination{
    text-align: center;
  }
</style>
