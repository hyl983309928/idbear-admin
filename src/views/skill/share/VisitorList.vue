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
      <div class="table-search">
        <div class="table-search-add-btn">
          <button @click="handleStatusChange('')" class="idbear-btn btn-small" :class="{'is-active': tableInfo.filterInfo.user_status == ''}" style="spadding: 9px 15px;">
            全部
          </button>
          <el-tooltip effect="dark" placement="top" v-for="(item, index) in wechatUserStatus" :key="index">
            <div slot="content" style="max-width: 120px;text-align: justify;">{{item.rule_desc}}</div>
            <button @click="handleStatusChange(item.value)" class="idbear-btn btn-small" :class="{'is-active': tableInfo.filterInfo.user_status == item.value}"  style="margin-left: 20px;padding: 9px 15px;">
              {{item.value}}
            </button>
          </el-tooltip>
        </div>
        <div class="table-search-input font-size-zero">
          <el-input @keydown.enter.native="handleSearchList" v-model="tableInfo.searchInfo.key" placeholder="根据用户名称搜索" size="small" style="width: 240px;">
          </el-input>
          <el-button @click.native="handleSearchList" type="primary" slot="append" size="small" style="margin-left: 20px">搜索</el-button>
        </div>
      </div>
    </div>
    <template>
      <el-table-column
        prop="user.id"
        label="ID"
        width="60"
      >
      </el-table-column>
      <el-table-column
        prop="user.nickname"
        label="名称"
        min-width="50"
      >
      </el-table-column>
      <el-table-column
        prop="user.headimgurl"
        label="头像"
        width="60"
      >
        <template slot-scope="scope">
          <img :src="scope.row.user.headimgurl" style="width: 28px;height: 28px;border-radius: 50% 50%;" />
        </template>
      </el-table-column>
      <el-table-column
        label="地区"
        width="110"
      >
        <template slot-scope="scope">
          {{scope.row.user.province + scope.row.user.city}}
        </template>
      </el-table-column>
      <el-table-column
        prop="user.chat_count"
        label="对话数"
        width="70"
      >
        <template slot-scope="scope">
          {{scope.row.user.chat_count ? scope.row.user.chat_count : 0}}
        </template>
      </el-table-column>
      <el-table-column
        prop="user.mobile"
        label="手机号"
        width="110"
      >
      </el-table-column>
      <el-table-column
      prop="create_time"
      label="首次访问时间"
      width="155"
      >
        <template slot-scope="scope">
        {{formatDate(scope.row.create_time)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="user.points"
        label="积分"
        width="90"
      >
        <template slot-scope="scope">
          {{scope.row.user.points ? scope.row.user.points : 0}}
        </template>
      </el-table-column>
      <el-table-column
        prop="user.hot_search"
        label="TA的热搜"
        :formatter="formatterHotSearch"
        min-width="100"
      >
      </el-table-column>
      <el-table-column
        prop="user.user_status"
        label="活跃度"
        width="70"
      >
        <template slot-scope="scope">
          <span :style="{color: wechatUserStatusMap[scope.row.user.user_status].color}">{{scope.row.user.user_status}}</span>
        </template>
      </el-table-column>
    </template>
  </BasicTable>
</div>
</template>

<script>
import BasicTable from '@/components/basicTable'
import { formatDate } from '@/utils/date'
import { wechatUserStatus, wechatUserStatusMap } from '@/lib/config'
import { checkRobotListExist } from '@/lib/modules/user'
import { getHashParamter, toUrlHash } from '@/utils/common'
export default {
  components: {
    BasicTable
  },
  mixins: [],
  data () {
    return {
      wechatUserStatus,
      wechatUserStatusMap,
      id: '',
      tableInfo: {
        page: 1,
        length: 20,
        count: 0,
        loading: false,
        searchInfo: {
          key: ''
        },
        filterInfo: {
          user_status: ''
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
        user__user_status: this.tableInfo.filterInfo.user_status
      }
      return params
    }
  },
  created () {
    this.id = this.$route.params.id
    this.initHash()
    checkRobotListExist(this.init)
  },
  mounted () {
  },
  methods: {
    formatDate,
    init () {
      this.getVisitorUserList()
    },
    formatterHotSearch (row) {
      if (row.user.parse_hot_search) {
        return row.user.parse_hot_search.join('；')
      } else {
        return ''
      }
    },
    initHash () {
      let hashParams = getHashParamter()
      this.tableInfo.length = hashParams.page_size ? parseInt(hashParams.page_size) : 20
      this.tableInfo.page = hashParams.page ? parseInt(hashParams.page) : 1
      this.tableInfo.count = hashParams.count ? parseInt(hashParams.count) : 0
      this.tableInfo.searchInfo.key = hashParams.search || ''
      this.tableInfo.filterInfo.user_status = hashParams.user__user_status || ''
    },
    addUrlHash () {
      let params = JSON.parse(JSON.stringify(this.params))
      params.count = this.tableInfo.count
      toUrlHash(params)
    },
    getVisitorUserList () {
      this.tableInfo.loading = true
      this.tableInfo.list = []
      let params = JSON.parse(JSON.stringify(this.params))
      params.share_user__share = this.id
      this.$api.skill.getShareUserVisitorList(params)
        .then((data) => {
          data.results.map((item) => {
            item.user.parse_hot_search = item.user.hot_search ? JSON.parse(item.user.hot_search) : []
            return item
          })
          this.tableInfo.count = data.count
          this.addUrlHash()
          this.tableInfo.list = data.results
          this.tableInfo.loading = false
        })
    },
    handlePageChange (page) {
      this.tableInfo.page = page
      this.getVisitorUserList()
    },
    handleSizeChange (length) {
      this.tableInfo.page = 1
      this.tableInfo.length = length
      this.getVisitorUserList()
    },
    handleSearchList () {
      this.tableInfo.page = 1
      this.getVisitorUserList()
    },
    handleStatusChange (value) {
      this.tableInfo.filterInfo.user_status = value
      this.tableInfo.page = 1
      this.getVisitorUserList()
    },
    handleRowClick (data) {
      this.$router.push(`/wechatUser/detail/${data.user.id}`)
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
  .table-search{
    display: flex;
    line-height: 1;
    .table-search-add-btn{
      flex-grow: 1;
      display: flex;
      align-items: center;
    }
  }
</style>
