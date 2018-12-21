<template>
<div class="is-content-block">
  <BasicTable
    :list="storeList"
    :loading="tableInfo.loading"
    :page="tableInfo.page"
    :total="tableInfo.count"
    :length="tableInfo.length"
    @current-change="changePage"
    @size-change="handleSizeChange"
  >
    <div slot="search">
      <div class="table-search">
        <div class="table-search-add-btn">
          <el-button @click.native="goto('/skill/addStore')" size="small">添加微主页</el-button>
        </div>
        <div class="table-search-input font-size-zero">
          <el-input @keydown.enter.native="searchRecord" v-model="searchInfo.key" placeholder="根据微主页名称搜索" size="small" style="width: 240px;">
          </el-input>
          <el-button @click.native="searchRecord" type="primary" slot="append" size="small" style="margin-left: 20px">搜索</el-button>
        </div>
      </div>
    </div>
    <template>
      <el-table-column
        prop="id"
        label="ID"
        width="80"
      >
      </el-table-column>
      <el-table-column
        prop="logo_url"
        label="LOGO"
        width="80"
      >
        <template slot-scope="scope">
          <img class="table-item-logo" alt="" :src="scope.row.logo_url" />
        </template>
      </el-table-column>
      <el-table-column
        prop="chs_name"
        label="微主页名称"
        align="left"
      >
      </el-table-column>
      <el-table-column
        prop="location"
        label="地理位置"
        align="left"
      >
      </el-table-column>
      <el-table-column
        prop="business_time"
        label="营业时间"
      >
      </el-table-column>
      <el-table-column
        prop="phone"
        label="电话"
      >
      </el-table-column>
      <el-table-column
        label="主体标签"
      >
        <template slot-scope="scope">
          <span>{{scope.row.expand && parseJSON(scope.row.expand).length!=0 ? parseJSON(scope.row.expand).join('、') : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <a @click="goto(`/skill/addStore/${scope.row.id}`)" style="margin-right: 5px">编辑</a>
          <a @click="delStore(scope.row, scope.$index)" class="color-red">删除</a>
        </template>
      </el-table-column>
    </template>
  </BasicTable>
</div>
</template>

<script>
import BasicTable from '@/components/basicTable'
import { checkRobotListExist } from '@/lib/modules/user'
import mixin from '@/mixins'
import { getHashParamter, toUrlHash } from '@/utils/common'
export default {
  components: {
    BasicTable
  },
  mixins: [mixin],
  data () {
    return {
      tableInfo: {
        page: 1,
        count: 0,
        length: 20,
        loading: false
      },
      searchInfo: {
        key: ''
      },
      storeList: []
    }
  },
  computed: {
    params () {
      let params = {
        page: this.tableInfo.page,
        page_size: this.tableInfo.length,
        search: this.searchInfo.key
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
      this.getStoreList()
    },
    initHash () {
      let hashParams = getHashParamter()
      this.tableInfo.length = hashParams.page_size ? parseInt(hashParams.page_size) : 20
      this.tableInfo.page = hashParams.page ? parseInt(hashParams.page) : 1
      this.tableInfo.count = hashParams.count ? parseInt(hashParams.count) : 0
      this.searchInfo.key = hashParams.search || ''
    },
    addUrlHash () {
      let params = JSON.parse(JSON.stringify(this.params))
      params.count = this.tableInfo.count
      toUrlHash(params)
    },
    getStoreList () {
      this.tableInfo.loading = true
      this.storeList = []
      this.$api.skill.getStoreList(this.params)
        .then((data) => {
          this.tableInfo.count = data.count
          this.storeList = data.results
          this.addUrlHash()
          this.tableInfo.loading = false
        })
    },
    handleSizeChange (length) {
      this.tableInfo.page = 1
      this.tableInfo.length = length
      this.getStoreList()
    },
    changePage (page) {
      this.tableInfo.page = page
      this.getStoreList()
    },
    searchRecord () {
      this.tableInfo.page = 1
      this.getStoreList()
    },
    delStore (item, index) {
      this.$confirm('是否删除该微主页?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: item.id,
          chs_name: item.chs_name,
          is_validate: false
        }
        this.$api.skill.delStoreInfo(params)
          .then((data) => {
            this.storeList.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          })
          .catch((e) => {
            this.$message({
              type: 'error',
              message: '删除失败，请重试'
            })
          })
      })
    }
  },
  watch: {}
}
</script>

<style scoped lang="scss">
.table-search{
  display: flex;
  .table-search-add-btn{
    flex-grow: 1;
  }
}
  .table-item-logo{
    width: 28px;
    height: 28px;
    border-radius: 50% 50%;
  }
</style>
