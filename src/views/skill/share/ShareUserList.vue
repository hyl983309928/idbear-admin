<template>
<div class="is-content-block">
  <BasicTable
    :list="tableInfo.list"
    :loading="tableInfo.loading"
    :page.sync="tableInfo.page"
    :total="tableInfo.count"
    :length="tableInfo.length"
    @current-change="handlePageChange"
    @size-change="handleSizeChange"
    @sort-change="handleSortChange"
    :default-sort="{prop: tableInfo.order_field, order: tableInfo.order}"
  >
    <div slot="search">
      <div class="table-search border-two">
        <div class="table-search-option">
          <div class="table-search-left">
            <div class="table-search-item">
              <div class="table-search-item-label">是否满足激励条件：</div>
              <div class="table-search-item-content">
                <el-select @change="handleFilterList" v-model="tableInfo.filterInfo.is_condition" size="small" style="width: 80px;">
                  <el-option
                    v-for="item in switchList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="table-search-item">
              <div class="table-search-item-label">是否有手机号码：</div>
              <div class="table-search-item-content">
                <el-select @change="handleFilterList" v-model="tableInfo.filterInfo.is_phone" size="small" style="width: 80px;">
                  <el-option
                    v-for="item in switchList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="table-search-input font-size-zero">
            <el-input @keydown.enter.native="handleSearchList" v-model="tableInfo.searchInfo.key" placeholder="请输入名称/手机号" size="small" style="width: 240px;">
            </el-input>
            <el-button @click.native="handleSearchList" type="primary" slot="append" size="small" style="margin-left: 20px">搜索</el-button>
          </div>
        </div>
        <div>
          <div class="table-search-item">
            <div class="table-search-item-label">分享用户：</div>
            <div class="table-search-item-content">{{tableInfo.count}}人</div>
          </div>
        </div>
      </div>
    </div>
    <template>
      <el-table-column
        prop="user.id"
        label="ID"
        width="80"
      >
      </el-table-column>
      <el-table-column
        prop="user.nickname"
        label="分享用户名称"
      >
        <template slot-scope="scope">
          <a @click="goto(`/wechatUser/detail/${scope.row.user.id}`)">{{scope.row.user.nickname}}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="user.headimgurl"
        label="头像"
        width="80"
      >
        <template slot-scope="scope">
          <img :src="scope.row.user.headimgurl" style="width: 28px;height: 28px;border-radius: 50% 50%;" />
        </template>
      </el-table-column>
      <el-table-column
        prop="user.mobile"
        label="手机号"
      >
      </el-table-column>
      <el-table-column
        prop="visitor_count"
        label="活动期间访客人数"
        sortable="custom"
      >
        <template slot-scope="scope">
          <a @click.stop.prevent="showVisitorDialog(scope.row)">{{scope.row.visitor_count ? scope.row.visitor_count : 0}}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="session_count"
        label="累计访客人数"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{scope.row.session_count ? scope.row.session_count : 0}}
        </template>
      </el-table-column>
      <el-table-column
        prop="interact_count"
        label="访客互动总量"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{scope.row.interact_count ? scope.row.interact_count : 0}}
        </template>
      </el-table-column>
    </template>
  </BasicTable>
  <el-dialog
    :visible.sync="visitorInfo.visible"
    center
    width="998px"
    :close-on-click-modal="false"
    custom-class="scroll-body-dialog height-600"
  >
    <BasicTable
      :list="visitorInfo.list"
      :loading="visitorInfo.loading"
      :page="visitorInfo.page"
      :total="visitorInfo.count"
      :length="visitorInfo.length"
      :rowClassName="'cursor-pointer'"
      @current-change="handleVisitorPageChange"
      @size-change="handleVisitorSizeChange"
      @row-click="handleVisitorRowClick"
    >
      <div slot="search">
        <div class="table-search-option">
          <div class="table-search-left font-size-title">
            {{visitorInfo.title}}
          </div>
          <div class="table-search-input font-size-zero">
            <el-input @keydown.enter.native="handleVisitorSearchList" v-model="visitorInfo.searchInfo.key" placeholder="根据用户名称/ID查询/手机号码" size="small" style="width: 240px;">
            </el-input>
            <el-button @click.native="handleVisitorSearchList" type="primary" slot="append" size="small" style="margin-left: 20px">搜索</el-button>
          </div>
        </div>
      </div>
      <template>
        <el-table-column
          prop="user.id"
          label="ID"
          width="80"
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
          prop="user.nickname"
          label="用户名"
          min-width="110"
        >
          <template slot-scope="scope">
            <span>{{scope.row.user.nickname}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="user.mobile"
          label="手机号"
        >
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="首次访问时间"
        >
          <template slot-scope="scope">
            {{formatDate(scope.row.create_time)}}
          </template>
        </el-table-column>
      </template>
    </BasicTable>
  </el-dialog>
</div>
</template>

<script>
import BasicTable from '@/components/basicTable'
import { formatDate } from '@/utils/date'
import { filterOrderMap } from '@/lib/config'
import { checkRobotListExist } from '@/lib/modules/user'
import { getHashParamter, toUrlHash } from '@/utils/common'
import commonMixin from '@/mixins/common'
export default {
  components: {
    BasicTable
  },
  mixins: [commonMixin],
  data () {
    return {
      id: '',
      switchList: [
        {
          value: '',
          label: '全部'
        },
        {
          value: false,
          label: '否'
        },
        {
          value: true,
          label: '是'
        }
      ],
      tableInfo: {
        page: 1,
        length: 20,
        count: 0,
        loading: false,
        order: '',
        order_field: '',
        searchInfo: {
          key: ''
        },
        filterInfo: {
          is_phone: '',
          is_condition: ''
        },
        list: []
      },
      visitorInfo: {
        visible: false,
        title: '',
        active: '',
        page: 1,
        count: 0,
        length: 20,
        loading: false,
        searchInfo: {
          key: ''
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
        order_field: this.tableInfo.order_field,
        order: this.tableInfo.order,
        is_phone: this.tableInfo.filterInfo.is_phone,
        is_condition: this.tableInfo.filterInfo.is_condition
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
    initHash () {
      let hashParams = getHashParamter()
      this.tableInfo.length = hashParams.page_size ? parseInt(hashParams.page_size) : 20
      this.tableInfo.page = hashParams.page ? parseInt(hashParams.page) : 1
      this.tableInfo.count = hashParams.count ? parseInt(hashParams.count) : 0
      this.tableInfo.searchInfo.key = hashParams.search || ''
      this.tableInfo.order = hashParams.order || ''
      this.tableInfo.order_field = hashParams.order_field || ''
      if (hashParams.is_phone === 'true') {
        this.tableInfo.filterInfo.is_phone = true
      } else if (hashParams.is_phone === 'false') {
        this.tableInfo.filterInfo.is_phone = false
      }
      if (hashParams.is_condition === 'true') {
        this.tableInfo.filterInfo.is_condition = true
      } else if (hashParams.is_condition === 'false') {
        this.tableInfo.filterInfo.is_condition = false
      }
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
      params.share = this.id
      params.ordering = params.order_field ? filterOrderMap[params.order] + params.order_field : ''
      this.$api.skill.getShareUserList(params)
        .then((data) => {
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
    handleFilterList () {
      this.tableInfo.page = 1
      this.getVisitorUserList()
    },
    handleSearchList () {
      this.tableInfo.page = 1
      this.getVisitorUserList()
    },
    handleSortChange (data) {
      this.tableInfo.order_field = data.prop
      this.tableInfo.order = data.order
      this.tableInfo.page = 1
      this.getVisitorUserList()
    },
    showVisitorDialog (item) {
      this.visitorInfo.active = item.id
      this.visitorInfo.title = `分享用户${item.user.nickname}的访客列表`
      this.visitorInfo.page = 1
      this.visitorInfo.length = 20
      this.visitorInfo.searchInfo.key = ''
      this.visitorInfo.visible = true
      this.getVisitorList()
    },
    handleVisitorPageChange (page) {
      this.visitorInfo.page = page
      this.getVisitorList()
    },
    handleVisitorSizeChange (length) {
      this.visitorInfo.length = length
      this.visitorInfo.page = 1
      this.getVisitorList()
    },
    handleVisitorRowClick (data) {
      this.openWindow(`/wechatUser/detail/${data.user.id}`)
    },
    handleVisitorFilterList () {
      this.visitorInfo.page = 1
      this.getVisitorList()
    },
    handleVisitorSearchList () {
      this.visitorInfo.page = 1
      this.getVisitorList()
    },
    getVisitorList () {
      this.visitorInfo.loading = true
      this.visitorInfo.list = []
      let params = {
        page: this.visitorInfo.page,
        page_size: this.visitorInfo.length,
        search: this.visitorInfo.searchInfo.key,
        share_user: this.visitorInfo.active,
        share_user__share: this.id
      }
      this.$api.skill.getShareUserVisitorList(params)
        .then((data) => {
          this.visitorInfo.count = data.count
          this.visitorInfo.list = data.results
          this.visitorInfo.loading = false
        })
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
  .table-search{
    padding: 20px 10px;
  }
  .table-search-option{
    display: flex;
    line-height: 1;
    margin-bottom: 20px;
    .table-search-left{
      flex-grow: 1;
      display: flex;
      align-items: center;
    }
  }
  .table-search-item{
    display: inline-block;
    .table-search-item-label{
      display: inline-block;
    }
    .table-search-item-content{
      display: inline-block;
    }
  }
  .table-search-item + .table-search-item{
    margin-left: 40px;
  }
</style>
