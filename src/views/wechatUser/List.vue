<template>
<div class="is-content-block">
  <BasicTable
    :list="tableInfo.list"
    :loading="tableInfo.loading"
    :page.sync="tableInfo.page"
    :total="tableInfo.count"
    :length="tableInfo.length"
    :rowClassName="'cursor-pointer'"
    @current-change="handlePageChange"
    @size-change="handleSizeChange"
    @row-click="handleRowClick"
  >
    <div slot="search">
      <div class="table-search border-two">
        <el-row :gutter="0">
          <el-col :span="11" class="table-search-box" style="width: 42.5%;">
            <div class="table-search-item-label">活跃度：</div>
            <div class="table-search-item-content font-size-zero">
              <button @click="tableInfo.filterInfo.user_status = ''" class="idbear-btn btn-small" :class="{'is-active': tableInfo.filterInfo.user_status == ''}" style="spadding: 9px 15px;">
                全部
              </button>
              <el-tooltip effect="dark" placement="top" v-for="(item, index) in wechatUserStatus" :key="index">
                <div slot="content" style="max-width: 120px;text-align: justify;">{{item.rule_desc}}</div>
                <button @click="tableInfo.filterInfo.user_status = item.value" class="idbear-btn btn-small" :class="{'is-active': tableInfo.filterInfo.user_status == item.value}"  style="margin-left: 20px;padding: 9px 15px;">
                  {{item.value}}
                </button>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6" style="width: 22.5%;">
            <div class="table-search-item-label">对话数：</div>
            <div class="table-search-item-content">
              <BasicNumScopeInput
                :scope-list.sync="tableInfo.filterInfo.chat_count"
              >
              </BasicNumScopeInput>
            </div>
          </el-col>
          <el-col :span="7" style="width: 35%;">
            <div class="table-search-item-label">购买次数：</div>
            <div class="table-search-item-content">
              <BasicNumScopeInput
                :scope-list.sync="tableInfo.filterInfo.trade_count"
              >
              </BasicNumScopeInput>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="11" style="width: 42.5%;">
            <div class="table-search-item-label">地区：</div>
            <div class="table-search-item-content">
              <el-cascader
                :options="chinaArea"
                v-model="tableInfo.filterInfo.area"
                size="small"
                clearable
              >
              </el-cascader>
            </div>
          </el-col>
          <el-col :span="6" style="width: 22.5%;">
            <div class="table-search-item-label">积分：</div>
            <div class="table-search-item-content">
              <BasicNumScopeInput
                :scope-list.sync="tableInfo.filterInfo.points"
              >
              </BasicNumScopeInput>
            </div>
          </el-col>
          <el-col :span="7" style="width: 35%;">
            <div class="table-search-item-label" style="width: 80px;">关键词：</div>
            <div class="table-search-item-content">
              <el-input v-model="tableInfo.searchInfo.key" placeholder="请输入手机号/名称/热搜" size="small" style="width: 235px;"></el-input>
            </div>
          </el-col>
        </el-row>
        <div class="table-search-option">
          <div class="table-search-option-total">
            <div class="table-search-item-label">用户：</div>
            <div class="table-search-item-content">{{tableInfo.count}}人</div>
          </div>
          <div class="table-search-option-btns">
            <el-button @click="handleFilterList" type="primary" size="small">筛选</el-button>
            <el-button @click="handleClearFilter" size="small">清空筛选</el-button>
            <el-button size="small" @click="exportExcel">导出Excel</el-button>
          </div>
        </div>
        <!--<div class="table-search-input font-size-zero">-->
          <!--<el-input @keydown.enter.native="searchList" v-model="tableInfo.searchInfo.key" placeholder="根据用户名称搜索" size="small" style="width: 240px;"></el-input>-->
          <!--<el-button @click.native="searchList" type="primary" slot="append" size="small" style="margin-left: 20px">搜索</el-button>-->
        <!--</div>-->
      </div>
    </div>
    <template>
      <el-table-column
        prop="id"
        label="ID"
        width="60"
      >
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="名称"
        min-width="50"
      >
      </el-table-column>
      <el-table-column
        prop="headimgurl"
        label="头像"
        width="60"
      >
        <template slot-scope="scope">
          <img :src="scope.row.headimgurl" style="width: 28px;height: 28px;border-radius: 50% 50%;" />
        </template>
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="地区"
        width="110"
      >
        <template slot-scope="scope">
          {{scope.row.province + scope.row.city}}
        </template>
      </el-table-column>
      <el-table-column
        prop="chat_count"
        label="对话数"
        width="70"
      >
        <template slot-scope="scope">
          {{scope.row.chat_count ? scope.row.chat_count : 0}}
        </template>
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="手机号"
        width="110"
      >
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="is_member"-->
        <!--label="用户身份"-->
        <!--width="90"-->
      <!--&gt;-->
        <!--<template slot-scope="scope">-->
          <!--<span v-if="scope.row.is_member" class="color-green">会员</span>-->
          <!--<span v-else>非会员</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column
        prop="points"
        label="积分"
        width="90"
      >
        <template slot-scope="scope">
          {{scope.row.points ? scope.row.points : 0}}
        </template>
      </el-table-column>
      <el-table-column
        prop="trade_count"
        label="购买次数"
        width="90"
      >
        <template slot-scope="scope">
          {{scope.row.trade_count ? scope.row.trade_count : 0}}
        </template>
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="start_call"-->
        <!--label="首次呼叫时间"-->
        <!--width="155"-->
      <!--&gt;-->
        <!--<template slot-scope="scope">-->
          <!--{{formatDate(scope.row.start_call)}}-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--prop="end_call"-->
        <!--label="最后呼叫时间"-->
        <!--width="155"-->
      <!--&gt;-->
        <!--<template slot-scope="scope">-->
          <!--{{formatDate(scope.row.end_call)}}-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column
        prop="hot_search"
        label="TA的热搜"
        :formatter="formatterHotSearch"
        min-width="100"
      >
      </el-table-column>
      <el-table-column
        prop="user_status"
        label="活跃度"
        width="70"
      >
        <template slot-scope="scope">
          <span :style="{color: wechatUserStatusMap[scope.row.user_status].color}">{{scope.row.user_status}}</span>
        </template>
      </el-table-column>
    </template>
  </BasicTable>
</div>
</template>

<script>
import BasicTable from '@/components/basicTable'
import { formatDate } from '../../utils/date'
import { wechatUserStatus, wechatUserStatusMap } from '@/lib/config'
import { checkRobotListExist } from '@/lib/modules/user'
import { getHashParamter, toUrlHash } from '@/utils/common'
import BasicNumScopeInput from '@/components/basicNumScopeInput'
import { chinaArea } from '../../lib/config/chinaSiteJson'

export default {
  components: {
    BasicTable,
    BasicNumScopeInput
  },
  data () {
    return {
      chinaArea,
      wechatUserStatus,
      wechatUserStatusMap,
      tableInfo: {
        page: 1,
        length: 20,
        count: 0,
        loading: false,
        searchInfo: {
          key: ''
        },
        filterInfo: {
          user_status: '',
          chat_count: ['', ''],
          trade_count: ['', ''],
          points: ['', ''],
          area: []
        },
        list: []
      }
    }
  },
  computed: {
    params () {
      let params = {
        page: this.tableInfo.page,
        page_size: this.tableInfo.length,
        search: this.tableInfo.searchInfo.key,
        user_status: this.tableInfo.filterInfo.user_status,
        province__startswith: this.tableInfo.filterInfo.area[0] || '',
        city__startswith: this.tableInfo.filterInfo.area[1] || '',
        chat_count_gte: this.tableInfo.filterInfo.chat_count[0],
        chat_count_lte: this.tableInfo.filterInfo.chat_count[1],
        trade_count_gte: this.tableInfo.filterInfo.trade_count[0],
        trade_count_lte: this.tableInfo.filterInfo.trade_count[1],
        points_gte: this.tableInfo.filterInfo.points[0],
        points_lte: this.tableInfo.filterInfo.points[1]
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
      this.getWechatUserList()
    },
    initHash () {
      let hashParams = getHashParamter()
      this.tableInfo.length = hashParams.page_size ? parseInt(hashParams.page_size) : 20
      this.tableInfo.page = hashParams.page ? parseInt(hashParams.page) : 1
      this.tableInfo.count = hashParams.count ? parseInt(hashParams.count) : 0
      this.tableInfo.searchInfo.key = hashParams.search || ''
      this.tableInfo.filterInfo.user_status = hashParams.user_status || ''
      if (hashParams.province__startswith && hashParams.city__startswith) {
        this.tableInfo.filterInfo.area = [hashParams.province__startswith, hashParams.city__startswith]
      }
      this.tableInfo.filterInfo.chat_count = [hashParams.chat_count_gte, hashParams.chat_count_lte]
      this.tableInfo.filterInfo.trade_count = [hashParams.trade_count_gte, hashParams.trade_count_lte]
      this.tableInfo.filterInfo.points = [hashParams.points_gte, hashParams.points_lte]
    },
    addUrlHash () {
      let params = JSON.parse(JSON.stringify(this.params))
      params.count = this.tableInfo.count
      toUrlHash(params)
    },
    formatDate,
    formatterHotSearch (row) {
      if (row.parse_hot_search) {
        return row.parse_hot_search.join('；')
      } else {
        return ''
      }
    },
    handleScopeParams () {
      let scopeField = ['chat_count', 'trade_count', 'points']
      for (let i = 0; i < scopeField.length; i++) {
        if (this.tableInfo.filterInfo[scopeField[i]][0] && this.tableInfo.filterInfo[scopeField[i]][1]) {
          let littleNum = parseInt(this.tableInfo.filterInfo[scopeField[i]][0])
          let largeNum = parseInt(this.tableInfo.filterInfo[scopeField[i]][1])
          if (littleNum > largeNum) {
            this.tableInfo.filterInfo[scopeField[i]] = [largeNum, littleNum]
            // this.tableInfo.filterInfo[scopeField[i]][1] = littleNum
          }
        }
      }
    },
    getWechatUserList () {
      this.handleScopeParams()
      this.tableInfo.loading = true
      this.tableInfo.list = []
      let params = JSON.parse(JSON.stringify(this.params))
      params.province__startswith = params.province__startswith.replace(/省|市/g, '')
      params.city__startswith = params.city__startswith.replace(/省|市/g, '')
      this.$api.wechatUser.getWechatUsersList(params)
        .then((data) => {
          data.results.map((item) => {
            item.parse_hot_search = item.hot_search ? JSON.parse(item.hot_search) : []
            return item
          })
          this.tableInfo.count = data.count
          this.addUrlHash()
          this.tableInfo.list = data.results
          this.tableInfo.loading = false
        })
    },
    handleFilterList () {
      this.tableInfo.page = 1
      this.getWechatUserList()
    },
    handleClearFilter () {
      this.tableInfo.searchInfo.key = ''
      this.tableInfo.filterInfo = {
        user_status: '',
        chat_count: ['', ''],
        trade_count: ['', ''],
        points: ['', ''],
        area: []
      }
      this.tableInfo.page = 1
      this.getWechatUserList()
    },
    handlePageChange (page) {
      this.tableInfo.page = page
      this.getWechatUserList()
    },
    handleSizeChange (length) {
      this.tableInfo.page = 1
      this.tableInfo.length = length
      this.getWechatUserList()
    },
    handleRowClick (data) {
      this.$router.push(`/wechatUser/detail/${data.id}`)
    },
    exportExcel () {
      let params = JSON.parse(JSON.stringify(this.params))
      params.page = 1
      params.page_size = 9999999
      this.$api.wechatUser.getWechatUsersList(params)
        .then((res) => {
          let data = res.results.map((item) => {
            let parseHotSearch = item.hot_search ? JSON.parse(item.hot_search) : []
            item.hot_search_string = parseHotSearch.join(';')
            item.area_string = item.province + item.city
            item.points_string = item.points || '0'
            item.trade_count_string = item.trade_count || '0'
            item.chat_count_string = item.chat_count || '0'
            return item
          })
          let columns = [
            {
              label: '姓名',
              prop: 'nickname'
            },
            {
              label: '手机号',
              prop: 'mobile'
            },
            {
              label: '地区',
              prop: 'area_string'
            },
            {
              label: '对话数',
              prop: 'chat_count_string'
            },
            {
              label: '积分',
              prop: 'points_string'
            },
            {
              label: '购买次数',
              prop: 'trade_count_string'
            },
            {
              label: 'TA的热搜',
              prop: 'hot_search_string'
            }
          ]
          let info = {
            title: '用户列表',
            columns: columns,
            data: data
          }
          this.$export.excel(info)
        })
    }
  },
  watch: {
    // 'tableInfo.filterInfo.user_status': function (val) {
    //   this.tableInfo.page = 1
    //   this.getWechatUserList()
    // }
  }
}
</script>

<style scoped lang="scss">
  @import "@/style/variate.scss";
.table-search{
  padding: 20px 0;
  .el-row{
    margin-bottom: 20px;
    &:last-child{
      margin-bottom: 0;
    }
  }
  .table-search-item-label{
    display: inline-block;
    min-width: 75px;
    text-align: right;
    padding-right: 10px;
  }
  .table-search-item-content{
    display: inline-block;
  }
  .table-search-option{
    display: flex;
    .table-search-option-total{
      flex-grow: 1;
      .table-search-item-content{
        line-height: 32px;
      }
    }
    .table-search-option-btns{
      padding-right: 20px;
    }
  }
}
</style>
