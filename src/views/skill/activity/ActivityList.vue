<template>
<div class="is-content-block" style="padding: 0;">
  <div class="content-header" style="padding: 28px 20px;">
    <div class="item-icon-box" :style="{background: colorCompany.blue}">
      <i :class="skillInfo.icon"></i>
    </div>
    <div class="item-info">
      <div class="item-info-title font-size-title text-color-primary">
        <span>{{skillInfo.title}}</span>
      </div>
      <div class="item-info-desc font-size-smaller text-color-minor">{{skillInfo.detail}}</div>
    </div>
  </div>
  <div class="content-main" style="padding: 0 20px 28px 20px">
    <BasicTable
      :list="tableInfo.list"
      :loading="tableInfo.loading"
      :page="tableInfo.page"
      :total="tableInfo.count"
      :length="tableInfo.length"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      @sort-change="handleSortChange"
      :default-sort="{prop: tableInfo.order_field, order: tableInfo.order}"
    >
      <div slot="search">
        <div class="table-search">
          <div class="table-search-add-btn">
            <el-button size="small" @click="handleBeforeAddOrEditActivity">创建活动</el-button>
          </div>
          <div class="table-search-input font-size-zero">
            <el-select @change="handleFilterList" v-model="tableInfo.filterInfo.status" style="width: 110px;margin-right: 20px;" size="small">
              <el-option
                :label="'全部状态'"
                :value="''"
              ></el-option>
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.title"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input @keydown.enter.native="handleSearchList" v-model="tableInfo.searchInfo.key" placeholder="根据活动名称或内容进行搜索" size="small" style="width: 240px;">
            </el-input>
            <el-button @click.native="handleSearchList" type="primary" slot="append" size="small" style="margin-left: 20px">搜索</el-button>
          </div>
        </div>
      </div>
      <template>
        <!--<el-table-column-->
          <!--prop="id"-->
          <!--label="消息序号"-->
          <!--width="100"-->
        <!--&gt;-->
        <!--</el-table-column>-->
        <el-table-column
          prop="title"
          label="活动名称"
          min-width="50"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="80"
        >
          <template slot-scope="scope">
            <span :style="{color: statusMap[scope.row.status].color}">{{statusMap[scope.row.status].title}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="descp"
          label="活动内容"
          align="left"
          min-width="100"
        >
          <template slot-scope="scope">
            <div v-html="parseEmojiCode(newline2br(scope.row.parse_descp.text_answer))"></div>
          </template>
        </el-table-column>
        <el-table-column
          prop="start_time"
          label="开始时间"
          width="160"
          sortable="custom"
        >
          <template slot-scope="scope">
            {{formatDate(scope.row.start_time)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="end_time"
          label="结束时间"
          width="160"
          sortable="custom"
        >
          <template slot-scope="scope">
            {{formatDate(scope.row.end_time)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="push_count"
          label="推送人数"
          width="110"
          sortable="custom"
        >
        </el-table-column>
        <el-table-column
          prop="look_count"
          label="查看人数"
          width="110"
          sortable="custom"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="90"
          align="left"
        >
          <template slot-scope="scope">
            <div class="option-box">
              <a @click="handleBeforeAddOrEditActivity(scope.row)" class="color-blue">{{scope.row.status == 'C' ? '查看':'编辑'}}</a>
              <a v-if="scope.row.status == 'A'" class="color-red" @click="handleDeleteActivity(scope.row, scope.$index)">删除</a>
              <a v-if="scope.row.status == 'B'" class="color-yellow" @click="handlePauseActivity(scope.row, scope.$index)">暂停</a>
            </div>
          </template>
        </el-table-column>
      </template>
    </BasicTable>
  </div>

  <el-dialog
    :visible="addActivityInfo.visible"
    :title="addActivityInfo.type=='add'?'创建活动':'编辑活动'"
    width="740px"
    @close="closeAddDialog"
  >
    <div class="add-share-plan-content">
      <el-form
        :model="addActivityInfo"
        :rules="addActivityInfo.rule"
        ref="addActivityForm"
        label-position="left"
        label-width="80px"
        size="medium"
        :disabled="addActivityInfo.disabled"
      >
        <el-form-item label="活动名称" prop="title">
          <el-input v-model="addActivityInfo.title" placeholder="发现清华人"></el-input>
        </el-form-item>
        <el-form-item label="活动时间" prop="time">
          <el-date-picker
            :disabled="addActivityInfo.type === 'edit' && addActivityInfo.active_item.status === 'B'"
            v-model="addActivityInfo.time[0]"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            style="width:200px;"
            placeholder="开始时间">
          </el-date-picker>
          <span style="padding: 10px;">至</span>
          <el-date-picker
            v-model="addActivityInfo.time[1]"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:200px;"
            :picker-options="pickerOptions"
            placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动内容" prop="descp">
          <BasicAnswer
            @on-change="changeAnswer"
            :answerInfo="addActivityInfo.descp"
            :disabled="addActivityInfo.disabled"
          >
          </BasicAnswer>
        </el-form-item>
        <el-form-item label="推送设置" prop="push_config">
          <div>
            <el-radio v-model="addActivityInfo.push_config" :label="1">单次推送<span class="text-color-minor">（针对活动期间的活跃客户，即时推送一次。）</span></el-radio>
          </div>
          <div>
            <el-radio v-model="addActivityInfo.push_config" :label="2">反复推送<span class="text-color-minor">（针对活动期间的活跃客户，即时推送，每天只推送一次）</span></el-radio>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button :loading="addActivityInfo.loading" @click.native="closeAddDialog" size="small">取消</el-button>
      <el-button :loading="addActivityInfo.loading" @click.native="submitAddOrEditActivity" :disabled="addActivityInfo.disabled" size="small" type="primary">确定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import BasicTable from '@/components/basicTable'
import { checkRobotListExist } from '@/lib/modules/user'
import commonMixin from '@/mixins/common'
import { formatDate } from '@/utils/date'
import { industryInfoMap, filterOrderMap } from '@/lib/config/index'
import { getHashParamter, toUrlHash, list2map, newline2br } from '@/utils/common'
import { colorCompany } from '../../../style/variate'
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
import { trimInputValue } from '../../../utils/input'
import BasicAnswer from '@/components/basicAnswer'
import emojiMixin from '@/mixins/emoji'

export default {
  components: {
    BasicTable,
    BasicAnswer
  },
  mixins: [commonMixin, emojiMixin],
  data () {
    let statusList = [
      { value: 'A', title: '未开始', color: colorCompany.textCommon },
      { value: 'B', title: '进行中', color: colorCompany.yellow },
      { value: 'C', title: '已结束', color: colorCompany.green }
    ]
    let timeValidator = (rule, value, callback) => {
      if (value[0] && value[1]) {
        let sT = dayjs(value[0])
        let eT = dayjs(value[1])
        if (sT.isBefore(eT) && eT.isAfter(dayjs())) {
          callback()
        } else {
          callback(new Error('开始时间必须小于结束时间且结束时间必须晚于当前时间'))
        }
      } else {
        callback(new Error('请填写开始时间和结束时间'))
      }
    }
    return {
      colorCompany,
      skillId: 9,
      skillInfo: {},
      statusList,
      statusMap: list2map(statusList, 'value'),
      tableInfo: {
        page: 1,
        count: 0,
        length: 20,
        loading: false,
        order: '',
        order_field: '',
        list: [],
        searchInfo: {
          key: ''
        },
        filterInfo: {
          status: ''
        }
      },
      addActivityInfo: {
        visible: false,
        type: 'add',
        disabled: false,
        active_item: '',
        loading: false,
        title: '',
        time: ['', ''],
        descp: null,
        push_config: '',
        rule: {
          title: [
            { required: true, message: '请输入活动名称', trigger: 'blur' }
          ],
          time: [
            {required: true, validator: timeValidator, trigger: 'blur'}
          ],
          descp: [
            { required: true, message: '请输入活动内容', trigger: 'blur' }
          ],
          push_config: [
            { required: true, message: '请选择推送方式', trigger: 'change' }
          ]
        }
      }
    }
  },
  computed: {
    params () {
      let params = {
        page: this.tableInfo.page,
        page_size: this.tableInfo.length,
        search: this.tableInfo.searchInfo.key,
        order_field: this.tableInfo.order_field,
        order: this.tableInfo.order,
        status: this.tableInfo.filterInfo.status
      }
      return params
    },
    ...mapGetters(['nowRobotInfo', 'nowRobot']),
    pickerOptions () {
      return {
        disabledDate (time) {
          let nowDate = dayjs().format('YYYY/MM/DD')
          let nowTime = new Date(nowDate).getTime()
          return time.getTime() < nowTime
        }
      }
    }
  },
  created () {
    this.initHash()
    checkRobotListExist(this.init)
  },
  mounted () {
  },
  methods: {
    newline2br,
    trimInputValue,
    formatDate,
    init () {
      let skillMap = industryInfoMap[this.nowRobotInfo.industry].skillMap
      this.skillInfo = skillMap[this.skillId]
      this.getActivityList()
    },
    initHash () {
      let hashParams = getHashParamter()
      this.tableInfo.length = hashParams.page_size ? parseInt(hashParams.page_size) : 20
      this.tableInfo.page = hashParams.page ? parseInt(hashParams.page) : 1
      this.tableInfo.count = hashParams.count ? parseInt(hashParams.count) : 0
      this.tableInfo.searchInfo.key = hashParams.search || ''
    },
    addUrlHash () {
      let params = JSON.parse(JSON.stringify(this.params))
      params.count = this.tableInfo.count
      toUrlHash(params)
    },
    handlePageChange (page) {
      this.tableInfo.page = page
      this.getActivityList()
    },
    handleSizeChange (length) {
      this.tableInfo.length = length
      this.tableInfo.page = 1
      this.getActivityList()
    },
    handleSortChange (data) {
      this.tableInfo.order_field = data.prop
      this.tableInfo.order = data.order
      this.tableInfo.page = 1
      this.getActivityList()
    },
    handleSearchList () {
      this.tableInfo.page = 1
      this.getActivityList()
    },
    handleFilterList () {
      this.tableInfo.page = 1
      this.getActivityList()
    },
    getActivityList () {
      let params = JSON.parse(JSON.stringify(this.params))
      params.ordering = params.order_field ? filterOrderMap[params.order] + params.order_field : ''
      this.$api.skill.getActivityList(params)
        .then((data) => {
          this.tableInfo.loading = false
          data.results.forEach((item) => {
            item.parse_descp = JSON.parse(item.descp)
          })
          this.tableInfo.count = data.count
          this.tableInfo.list = data.results
          this.addUrlHash()
        })
        .catch(() => {
          this.tableInfo.loading = false
          this.$message({
            type: 'error',
            message: '获取失败，请刷新重试'
          })
        })
    },
    handlePauseActivity (item, index) {
      let params = {
        id: item.id,
        status: 'C'
      }
      this.$api.skill.updateActivity(params)
        .then((data) => {
          item.status = 'C'
          this.$message({
            type: 'success',
            message: '暂停成功'
          })
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '暂停失败，请重试'
          })
        })
    },
    handleDeleteActivity (item, index) {
      this.$confirm('是否删除该活动？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.skill.delActivity(item.id)
          .then((data) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.tableInfo.list.splice(index, 1)
            this.tableInfo.count -= 1
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '删除失败，请重试'
            })
          })
      })
    },
    handleBeforeAddOrEditActivity (obj) {
      if (obj.id) {
        this.addActivityInfo.type = 'edit'
        this.addActivityInfo.active_item = obj
        if (obj.status === 'C') {
          this.addActivityInfo.disabled = true
        } else {
          this.addActivityInfo.disabled = false
        }
        this.addActivityInfo.title = obj.title
        this.addActivityInfo.time = [obj.start_time, obj.end_time]
        this.addActivityInfo.descp = obj.parse_descp
        this.addActivityInfo.push_config = obj.push_config
        this.addActivityInfo.visible = true
      } else {
        this.addActivityInfo.type = 'add'
        this.addActivityInfo.disabled = false
        this.addActivityInfo.visible = true
      }
    },
    closeAddDialog () {
      this.$refs.addActivityForm.resetFields()
      this.addActivityInfo.title = ''
      this.addActivityInfo.time = ['', '']
      this.addActivityInfo.descp = null
      this.addActivityInfo.disabled = false
      this.addActivityInfo.visible = false
    },
    submitAddOrEditActivity () {
      this.$refs.addActivityForm.validate((validate) => {
        if (validate) {
          let descp = JSON.parse(JSON.stringify(this.addActivityInfo.descp))
          descp.material_answer = descp.material_answer_obj.map(item => { return { id: item.id, type: item.type } })
          let params = {
            title: this.addActivityInfo.title,
            descp: JSON.stringify(descp),
            start_time: this.formatDate(this.addActivityInfo.time[0]),
            end_time: this.formatDate(this.addActivityInfo.time[1]),
            push_config: this.addActivityInfo.push_config,
            robot: this.nowRobot
          }
          this.addActivityInfo.loading = true
          if (this.addActivityInfo.type === 'add') {
            this.$api.skill.addActivity(params)
              .then((data) => {
                data.parse_descp = JSON.parse(data.descp)
                this.tableInfo.list.unshift(data)
                this.addActivityInfo.loading = false
                this.closeAddDialog()
                this.$message({
                  type: 'success',
                  message: '创建成功'
                })
              })
              .catch((e) => {
                this.addActivityInfo.loading = false
                this.$message({
                  type: 'error',
                  message: '创建失败，请重试'
                })
              })
          } else {
            params.id = this.addActivityInfo.active_item.id
            this.$api.skill.updateActivity(params)
              .then((data) => {
                this.addActivityInfo.active_item.title = data.title
                this.addActivityInfo.active_item.time = [data.start_time, data.end_time]
                this.addActivityInfo.active_item.descp = data.descp
                this.addActivityInfo.active_item.parse_descp = JSON.parse(data.descp)
                this.addActivityInfo.active_item.push_config = data.push_config
                this.addActivityInfo.loading = false
                this.closeAddDialog()
                this.$message({
                  type: 'success',
                  message: '修改成功'
                })
              })
              .catch((e) => {
                this.addActivityInfo.loading = false
                this.$message({
                  type: 'error',
                  message: '创建失败，请重试'
                })
              })
          }
        }
      })
    },
    changeAnswer (obj) {
      this.addActivityInfo.descp = obj
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
  .table-search{
    display: flex;
    .table-search-add-btn{
      flex-grow: 1;
    }
  }
  .content-header{
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    border-bottom:1px solid #F0F2F5;
    .item-icon-box{
      width: 50px;
      height: 50px;
      margin-right: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50% 50%;
      i{
        font-size: 32px;
        color: #fff;
      }
    }
    .item-btn{
      flex-grow: 0;
    }
    .item-info{
      flex-grow: 1;
      .item-info-title{
        line-height: 1;
        margin-bottom: 10px;
      }
      .item-info-desc{
        line-height: 1;
      }
    }
    .item-status{
      margin-right: 30px;
    }
  }
  .option-box{
    a + a {
      margin-left: 5px;
    }
  }
</style>
