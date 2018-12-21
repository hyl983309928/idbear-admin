<template>
  <div class="is-content-block" style="padding: 0;">
    <div class="skill-header" style="padding: 28px 20px;">
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
    <div style="padding: 0 20px 28px 20px">
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
              <el-button @click.native="handleShowAddOrEditPlan" size="small">新建分享激励计划</el-button>
            </div>
            <div class="table-search-input font-size-zero">
              <el-input @keydown.enter.native="handleSearchList" v-model="tableInfo.searchInfo.key" placeholder="根据推送内容搜索" size="small" style="width: 240px;">
              </el-input>
              <el-button @click.native="handleSearchList" type="primary" slot="append" size="small" style="margin-left: 20px">搜索</el-button>
            </div>
          </div>
        </div>
        <template>
          <el-table-column
            prop="id"
            label="分享序号"
            width="80"
          >
          </el-table-column>
          <el-table-column
            prop="descp"
            label="分享激励内容"
          >
            <template slot-scope="scope">
              <div class="text-overflow-ellipsis">{{scope.row.descp}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="90"
          >
            <template slot-scope="scope">
                <span v-if="scope.row.status == 'A'">未开始</span>
                <span class="color-yellow" v-else-if="scope.row.status == 'B'">进行中</span>
                <span class="color-green" v-else-if="scope.row.status == 'C'">已完成</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="start_time"
            label="开始时间"
            width="155"
          >
            <template slot-scope="scope">
              {{formatDate(scope.row.start_time)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="end_time"
            label="结束时间"
            width="155"
          >
            <template slot-scope="scope">
              {{formatDate(scope.row.end_time)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="sharing_count"
            label="参与分享人数"
            width="130"
            sortable="custom"
          >
            <template slot-scope="scope">
              <a v-if="scope.row.sharing_count" @click="goto(`/skill/share/shareUser/${scope.row.id}`)">{{scope.row.sharing_count}}</a>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="session_count"
            label="访客人数"
            width="130"
            sortable="custom"
          >
            <template slot-scope="scope">
              <a v-if="scope.row.session_count" @click="goto(`/skill/share/visitor/${scope.row.id}`)">{{scope.row.session_count}}</a>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="130"
          >
            <template slot-scope="scope">
              <div class="option-box">
                <a @click="handleShowAddOrEditPlan(scope.row)" class="color-blue">{{scope.row.status == 'A' ? '编辑':'查看'}}</a>
                <a v-if="scope.row.status == 'A'" class="color-red" @click="handleDeletePlan(scope.row, scope.$index)">删除</a>
                <a v-if="scope.row.status == 'B'" class="color-red" @click="handlePausePlan(scope.row, scope.$index)">停止</a>
              </div>
            </template>
          </el-table-column>
        </template>
      </BasicTable>
    </div>
    <el-dialog
      :visible="addSharePlanInfo.visible"
      :title="addSharePlanInfo.type=='add'?'新建分享激励':'修改分享激励'"
      width="600px"
      @close="closeAddPlanDialog"
    >
      <div class="add-share-plan-content">
        <el-form
          :model="addSharePlanInfo"
          :rules="addSharePlanInfo.rule"
          ref="addPlanForm"
          label-position="left"
          label-width="80px"
          size="medium"
          :disabled="addSharePlanInfo.disabled"
        >
          <el-form-item label="激励时间" prop="time">
            <el-date-picker
              v-model="addSharePlanInfo.time[0]"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
              style="width:200px;"
              placeholder="开始时间">
            </el-date-picker>
            <span style="padding: 10px;">至</span>
            <el-date-picker
              v-model="addSharePlanInfo.time[1]"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:200px;"
              :picker-options="pickerOptions"
              placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="激励条件" prop="num_count">
            <div class="text-color-minor">(活动期间，访问满足人数设定，用于筛选满足条件的分享用户)</div>
            <el-input v-model.number="addSharePlanInfo.num_count" @keydown.native="trimInputValue" style="width: 120px">
              <template slot="append">人</template>
            </el-input>
          </el-form-item>
          <el-form-item label="激励规则" prop="descp">
            <el-input
              type="textarea"
              :rows="5"
              resize="none"
              placeholder="10月1日至10月31日期间，累计达到20个好友访问，即可到售楼处领取精美礼品一份。"
              v-model="addSharePlanInfo.descp">
            </el-input>
          </el-form-item>
          <el-form-item label="咨询电话" prop="mobile">
            <el-input v-model="addSharePlanInfo.mobile" @keydown.native="trimInputValue" placeholder="0755-8888888"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button :loading="addSharePlanInfo.loading" @click.native="closeAddPlanDialog" size="small">取消</el-button>
        <el-button :loading="addSharePlanInfo.loading" @click.native="submitAddOrEditPlan" :disabled="addSharePlanInfo.disabled" size="small" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { checkRobotListExist } from '@/lib/modules/user'
import { industryInfoMap, filterOrderMap } from '@/lib/config/index'
import { colorCompany } from '@/style/variate'
import { mapGetters } from 'vuex'
import BasicTable from '@/components/basicTable'
import commonMixin from '@/mixins/common'
import { getHashParamter, toUrlHash } from '@/utils/common'
import dayjs from 'dayjs'
import { trimInputValue } from '@/utils/input'
import { validatePhone } from '@/utils/validate'
import { formatDate } from '@/utils/date'

export default {
  components: {
    BasicTable
  },
  mixins: [commonMixin],
  data () {
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
    let numValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请填写激励条件'))
      }
      console.log(value)
      if (parseInt(value) === value && value > 0) {
        callback()
      } else {
        callback(new Error('该值必须为正整数'))
      }
    }
    return {
      colorCompany,
      skillId: 12,
      skillInfo: {},
      tableInfo: {
        page: 1,
        count: 3,
        length: 20,
        loading: false,
        order: '',
        order_field: '',
        searchInfo: {
          key: ''
        },
        filterInfo: {
          status: ''
        },
        list: []
      },
      addSharePlanInfo: {
        visible: false,
        type: 'add',
        disabled: false,
        action_item: '',
        loading: false,
        time: ['', ''],
        num_count: '',
        descp: '',
        mobile: '',
        rule: {
          time: [
            {required: true, validator: timeValidator, trigger: 'blur'}
          ],
          num_count: [
            { type: 'number', message: '必须为数字' },
            { required: true, validator: numValidator, trigger: 'blur' }
          ],
          descp: [
            { required: true, message: '请输入激励规则', trigger: 'blur' }
          ],
          mobile: [
            {required: true, validator: validatePhone, trigger: 'blur'}
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters(['nowRobotInfo', 'nowRobot']),
    pickerOptions () {
      return {
        disabledDate (time) {
          let nowDate = dayjs().format('YYYY/MM/DD')
          let nowTime = new Date(nowDate).getTime()
          return time.getTime() < nowTime
        }
      }
    },
    params () {
      let params = {
        page: this.tableInfo.page,
        page_size: this.tableInfo.length,
        search: this.tableInfo.searchInfo.key,
        order_field: this.tableInfo.order_field,
        order: this.tableInfo.order
      }
      return params
    }
  },
  created () {
    this.initHash()
    checkRobotListExist(this.init)
  },
  mounted () {
  },
  methods: {
    trimInputValue,
    formatDate,
    init () {
      let skillMap = industryInfoMap[this.nowRobotInfo.industry].skillMap
      this.skillInfo = skillMap[this.skillId]
      this.getList()
    },
    initHash () {
      let hashParams = getHashParamter()
      this.tableInfo.length = hashParams.page_size ? parseInt(hashParams.page_size) : 20
      this.tableInfo.page = hashParams.page ? parseInt(hashParams.page) : 1
      this.tableInfo.count = hashParams.count ? parseInt(hashParams.count) : 0
      this.tableInfo.searchInfo.key = hashParams.search || ''
      this.tableInfo.order = hashParams.order || ''
      this.tableInfo.order_field = hashParams.order_field || ''
    },
    addUrlHash () {
      let params = JSON.parse(JSON.stringify(this.params))
      params.count = this.tableInfo.count
      toUrlHash(params)
    },
    handlePageChange (page) {
      this.tableInfo.page = page
      this.getList()
    },
    handleSizeChange (length) {
      this.tableInfo.length = length
      this.tableInfo.page = 1
      this.getList()
    },
    handleSortChange (data) {
      this.tableInfo.order_field = data.prop
      this.tableInfo.order = data.order
      this.tableInfo.page = 1
      this.getList()
    },
    handleFilterList () {
      this.tableInfo.page = 1
      this.getList()
    },
    handleSearchList () {
      this.tableInfo.page = 1
      this.getList()
    },
    getList () {
      this.tableInfo.loading = true
      this.tableInfo.list = []
      let params = JSON.parse(JSON.stringify(this.params))
      params.ordering = params.order_field ? filterOrderMap[params.order] + params.order_field : ''
      this.$api.skill.getShareList(params)
        .then((data) => {
          this.tableInfo.loading = false
          this.tableInfo.count = data.count
          this.tableInfo.list = data.results
          this.addUrlHash()
        })
        .catch(() => {
          this.tableInfo.loading = false
          this.$message({
            type: 'error',
            message: '获取失败，请重试'
          })
        })
    },
    handleShowAddOrEditPlan (obj) {
      if (obj.id) {
        if (obj.status !== 'A') {
          this.addSharePlanInfo.disabled = true
        }
        this.addSharePlanInfo.type = 'edit'
        this.addSharePlanInfo.action_item = obj
        this.addSharePlanInfo.time = [obj.start_time, obj.end_time]
        this.addSharePlanInfo.num_count = obj.num_count
        this.addSharePlanInfo.descp = obj.descp
        this.addSharePlanInfo.mobile = obj.mobile
        this.addSharePlanInfo.visible = true
      } else {
        if (this.tableInfo.list.some((item) => { return item.status === 'A' || item.status === 'B' })) {
          this.$alert('未开始和进行中的计划仅能存在一条，请删除或停止该计划后在尝试添加', '提示', {
            confirmButtonText: '我知道了',
            callback: action => {
            }
          })
          return
        }
        this.addSharePlanInfo.type = 'add'
        this.addSharePlanInfo.visible = true
      }
    },
    closeAddPlanDialog () {
      this.$refs.addPlanForm.resetFields()
      this.addSharePlanInfo.time = ['', '']
      this.addSharePlanInfo.num_count = ''
      this.addSharePlanInfo.descp = ''
      this.addSharePlanInfo.mobile = ''
      this.addSharePlanInfo.visible = false
      this.addSharePlanInfo.disabled = false
    },
    submitAddOrEditPlan () {
      this.$refs.addPlanForm.validate((validate) => {
        if (validate) {
          let params = {
            start_time: this.addSharePlanInfo.time[0],
            end_time: this.addSharePlanInfo.time[1],
            num_count: this.addSharePlanInfo.num_count,
            mobile: this.addSharePlanInfo.mobile,
            descp: this.addSharePlanInfo.descp
          }
          this.addSharePlanInfo.loading = true
          if (this.addSharePlanInfo.type === 'add') {
            params.robot = this.nowRobot
            this.$api.skill.addShare(params)
              .then(() => {
                this.addSharePlanInfo.loading = false
                this.closeAddPlanDialog()
                this.getList()
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
              })
              .catch((e) => {
                this.addSharePlanInfo.loading = false
                this.$message({
                  type: 'error',
                  message: '添加失败，请重试'
                })
              })
          } else {
            params.id = this.addSharePlanInfo.action_item.id
            this.$api.skill.updateShare(params)
              .then((data) => {
                this.addSharePlanInfo.action_item.descp = data.descp
                this.addSharePlanInfo.action_item.start_time = data.start_time
                this.addSharePlanInfo.action_item.end_time = data.end_time
                this.addSharePlanInfo.action_item.num_count = data.num_count
                this.addSharePlanInfo.action_item.mobile = data.mobile
                this.addSharePlanInfo.loading = false
                this.closeAddPlanDialog()
                this.$message({
                  type: 'success',
                  message: '修改成功'
                })
              })
              .catch((e) => {
                this.addSharePlanInfo.loading = false
                this.$message({
                  type: 'error',
                  message: '修改失败，请重试'
                })
              })
          }
        }
      })
    },
    handleDeletePlan (item, index) {
      this.$confirm('是否删除该分享计划？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.skill.delShare(item.id)
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
    handlePausePlan (obj) {
      let params = {
        id: obj.id,
        status: 'C'
      }
      this.$api.skill.updateShare(params)
        .then((data) => {
          obj.status = 'C'
          this.$message({
            type: 'success',
            message: '停用成功'
          })
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '停用失败，请重试'
          })
        })
    }
  },
  watch: {}
}
</script>

<style scoped lang="scss">
  .skill-header{
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
  .table-search{
    display: flex;
    line-height: 1;
    .table-search-add-btn{
      flex-grow: 1;
      display: flex;
      align-items: center;
    }
  }
  .option-box{
    a + a {
      margin-left: 5px;
    }
  }
</style>
