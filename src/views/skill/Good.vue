<template>
<div class="good-page">
  <div class="page-tabs">
    <div
      @click="changeActive(key)" class="page-tab-item border-radius-4 "
      :class="{'is-active': active == key}"
      v-for="(value, key) in tabMap"
      :key="key"
    >
      {{value.label}}
    </div>
  </div>
  <div class="is-content-block" v-show="active == 'custom'">
    <BasicTable
      :list="customInfo.list"
      :loading="customInfo.tableInfo.loading"
      :page="customInfo.tableInfo.page"
      :total="customInfo.tableInfo.count"
      :length="customInfo.tableInfo.length"
      @current-change="changePage"
      @size-change="handleSizeChange"
      @sort-change="handleSortChange"
      :default-sort="{prop: customInfo.tableInfo.order_field, order: this.order2orderMap[customInfo.tableInfo.order]}"
    >
      <div slot="search">
        <div class="table-search">
          <div class="table-search-add-btn">
            <el-button @click.native="addGoodInfo.visible = true;addGoodInfo.activeItem={};addGoodInfo.type='add'" size="small">添加商品</el-button>
          </div>
          <div class="table-search-input font-size-zero">
            <el-input @keydown.enter.native="searchList" v-model="customInfo.searchInfo.key" placeholder="根据标题搜索" size="small" style="width: 240px;">
            </el-input>
            <el-button @click.native="searchList" type="primary" slot="append" size="small" style="margin-left: 20px">搜索</el-button>
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
          prop="title"
          label="标题"
          align="left"
          min-width="200"
        >
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格(元)"
        >
          <template slot-scope="scope">
            {{scope.row.price / 100}}
          </template>
        </el-table-column>

        <el-table-column
          prop="business_time"
          label="商品标签"
        >
          <template slot-scope="scope">
            <div @click="beforeAddLabel(scope.row)">
              <el-tooltip effect="dark" content="点击修改" placement="top">
                <span>
                  <span class="label-icon" v-if="scope.row.tags && parseJSON(scope.row.tags).length!=0" name="tag">
                    {{parseJSON(scope.row.tags).join('、')}}
                  </span>
                  <i class="iconfont icon-shuru label-icon" v-else name="tag"></i>
                </span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <!--<el-table-column-->
          <!--prop="phone"-->
          <!--label="拓展标签"-->
        <!--&gt;-->
          <!--<template slot-scope="scope">-->
            <!--<div @click="beforeAddLabel(scope.row)">-->
              <!--<el-tooltip effect="dark" content="点击修改" placement="top">-->
                <!--<i class="iconfont icon-shuru label-icon"></i>-->
              <!--</el-tooltip>-->
            <!--</div>-->
          <!--</template>-->
        <!--</el-table-column>-->

        <el-table-column
          prop="update_time"
          label="修改时间"
          sortable="custom"
          width="200"
        >
          <template slot-scope="scope">
            {{formatDate(scope.row.update_time)}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <a @click="emitCustomGood(scope.row, scope.$index)" style="margin-right: 5px">编辑</a>
            <a @click="delCustomGood(scope.row, scope.$index)" class="color-red">删除</a>
          </template>
        </el-table-column>
      </template>
    </BasicTable>
  </div>
  <div class="is-content-block" v-show="active == 'praise'">
    <BasicTable
      :list="praiseInfo.list"
      :loading="praiseInfo.tableInfo.loading"
      :page="praiseInfo.tableInfo.page"
      :total="praiseInfo.tableInfo.count"
      :length="praiseInfo.tableInfo.length"
      :default-sort="{prop: praiseInfo.tableInfo.order_field, order: this.order2orderMap[praiseInfo.tableInfo.order]}"
      @current-change="changePage"
      @size-change="handleSizeChange"
      @sort-change="handleSortChange"
    >
      <div slot="search">
        <div class="table-search">
          <div class="table-search-add-btn">
            <template v-if="nowRobotInfo.praisestore && nowRobotInfo.praisestore[0]">
              <el-button size="small" style="cursor: auto;color: #606266;border: 1px solid #dcdfe6;" disabled>有赞店铺：{{nowRobotInfo.praisestore[0].name}}</el-button>
              <a style="margin-left: 5px;" @click="cancelPraiseAuth" class="font-size-smaller">解除绑定</a>
            </template>
            <el-button v-else @click.native="showBindPraise" size="small">绑定有赞店铺</el-button>
          </div>
          <div class="table-search-input">
            <el-input @keydown.enter.native="searchList" v-model="praiseInfo.searchInfo.key" placeholder="根据标题搜索" size="small" style="width: 240px;">
            </el-input>
            <el-button @click.native="searchList" type="primary" slot="append" size="small" style="margin-left: 20px">搜索</el-button>
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
          prop="title"
          label="标题"
          min-width="200"
          align="left"
        >
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格(元)"
          sortable="custom"
        >
          <template slot-scope="scope">
            {{scope.row.price / 100}}
          </template>
        </el-table-column>
        <el-table-column
          prop="sold_num"
          label="销量"
          sortable="custom"
        >
        </el-table-column>
        <el-table-column
          prop="quantity"
          label="库存"
        >
        </el-table-column>
        <el-table-column
          prop="business_time"
          label="商品标签"
        >
          <template slot-scope="scope">
            <div @click="beforeAddLabel(scope.row)">
              <el-tooltip effect="dark" content="点击修改" placement="top">
                <span>
                  <span class="label-icon" v-if="scope.row.tags && parseJSON(scope.row.tags).length!=0">
                    {{parseJSON(scope.row.tags).join('、')}}
                  </span>
                  <i class="iconfont icon-shuru label-icon" v-else></i>
                </span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_display"
          label="状态"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.is_display == 1">已上架</span>
            <span v-else>已下架</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="update_time"
          label="修改时间"
          sortable="custom"
          width="200"
        >
          <template slot-scope="scope">
            {{formatDate(scope.row.update_time)}}
          </template>
        </el-table-column>
      </template>
    </BasicTable>
  </div>
  <AddGoodsDialog
    :visible.sync="addGoodInfo.visible"
    :activeItem="addGoodInfo.activeItem"
    @on-success="addGoodSuccess"
  ></AddGoodsDialog>
  <el-dialog
    :visible.sync="addGoodLabelInfo.visible"
    :title="addGoodLabelInfo.title"
    width="600px"
  >
    <div class="add-good-label-box">
      <div class="add-good-label-desc">
        {{addGoodLabelInfo.desc}}
      </div>
      <div class="add-good-label-info">
        <div class="add-good-label-info-list">
          <el-tag
            class="keyword-item"
            type="info"
            :key="index"
            v-for="(tagItem, index) in addGoodLabelInfo.labelList"
            closable
            :disable-transitions="false"
            @close="handleLabelClose(index)">
            {{tagItem}}
          </el-tag>
        </div>
        <div class="add-good-label-info-input">
          <el-input size="small" @keydown.enter.native="handleAddLabel" v-model="addGoodLabelInfo.inputText" placeholder="请输入关键词，多个词用逗号分开"></el-input>
          <el-button @click.native="handleAddLabel" class="add-good-label-btn" size="small" type="primary">添加</el-button>
        </div>
      </div>
    </div>
    <div slot="footer">
      <el-button :loading="addGoodLabelInfo.loading" @click.native="addGoodLabelInfo.visible = false" size="small">取消</el-button>
      <el-button :loading="addGoodLabelInfo.loading" @click.native="submitAddGoodLabel" size="small" type="primary">确定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import BasicTable from '@/components/basicTable'
import { formatDate } from '../../utils/date'
import trim from 'lodash/trim'
import { order2orderMap } from '@/lib/config/index'
import { checkRobotListExist } from '@/lib/modules/user'
import mixin from '@/mixins'
import { mapActions, mapGetters } from 'vuex'
import { getRobotList } from '../../lib/modules/user'
import AddGoodsDialog from '@/components/dialog/addGoodsDialog'
import { getHashParamter, toUrlHash } from '@/utils/common'
export default {
  components: {
    BasicTable,
    AddGoodsDialog
  },
  mixins: [mixin],
  data () {
    return {
      order2orderMap,
      active: 'praise',
      tabMap: {
        'praise': {
          label: '有赞商品',
          goods_type: 1,
          info_name: 'praiseInfo'
        },
        'custom': {
          label: '其他商品',
          goods_type: 0,
          info_name: 'customInfo'
        }
      },
      customInfo: {
        tableInfo: {
          page: 1,
          count: 0,
          length: 20,
          loading: false,
          order: '',
          order_field: ''
        },
        searchInfo: {
          key: ''
        },
        list: []
      },
      praiseInfo: {
        tableInfo: {
          page: 1,
          count: 0,
          length: 20,
          loading: false,
          order: '',
          order_field: ''
        },
        searchInfo: {
          key: ''
        },
        list: []
      },
      addGoodInfo: {
        type: 'add',
        activeItem: {},
        visible: false
      },
      addGoodLabelInfo: {
        visible: false,
        loading: false,
        title: '商品标签',
        desc: '用户呼叫中包含这些关键字标签或其同义词，则可智能推荐出该商品',
        active: {},
        inputText: '',
        labelList: []
      }
    }
  },
  computed: {
    ...mapGetters([
      'nowRobotInfo'
    ])
  },
  created () {
    this.initHash()
    checkRobotListExist(this.init)
  },
  mounted () {
  },
  methods: {
    ...mapActions([
      'setShowRemovePraiseDialog'
    ]),
    init () {
      this.getGoodsList()
    },
    initHash () {
      let hashParams = getHashParamter()
      this.active = hashParams.active || 'praise'
      this[this.tabMap[this.active].info_name].tableInfo.length = hashParams.page_size ? parseInt(hashParams.page_size) : 20
      this[this.tabMap[this.active].info_name].tableInfo.page = hashParams.page ? parseInt(hashParams.page) : 1
      this[this.tabMap[this.active].info_name].tableInfo.count = hashParams.count ? parseInt(hashParams.count) : 0
      this[this.tabMap[this.active].info_name].searchInfo.key = hashParams.search || ''
      this[this.tabMap[this.active].info_name].tableInfo.order_field = hashParams.order_field || ''
      this[this.tabMap[this.active].info_name].tableInfo.order = hashParams.order || ''
    },
    formatDate,
    addUrlHash () {
      let params = {
        active: this.active,
        page_size: this[this.tabMap[this.active].info_name].tableInfo.length,
        page: this[this.tabMap[this.active].info_name].tableInfo.page,
        count: this[this.tabMap[this.active].info_name].tableInfo.count,
        search: this[this.tabMap[this.active].info_name].searchInfo.key,
        order_field: this[this.tabMap[this.active].info_name].tableInfo.order_field,
        order: this[this.tabMap[this.active].info_name].tableInfo.order
      }
      toUrlHash(params)
    },
    changeActive (key) {
      if (this.active === key) {
        return
      }
      this.active = key
      this.addUrlHash()
      this.getGoodsList()
    },
    getGoodsList () {
      this[this.tabMap[this.active].info_name].tableInfo.loading = true
      let params = {
        goods_type: this.tabMap[this.active].goods_type,
        page_size: this[this.tabMap[this.active].info_name].tableInfo.length,
        page: this[this.tabMap[this.active].info_name].tableInfo.page,
        search: this[this.tabMap[this.active].info_name].searchInfo.key,
        order_field: this[this.tabMap[this.active].info_name].tableInfo.order_field,
        order: this[this.tabMap[this.active].info_name].tableInfo.order
      }
      this[this.tabMap[this.active].info_name].list = []
      // let apiName = this.tabMap[this.active].goods_type === 1 ? 'getPraiseGoodsList' : 'getSelfGoodsList'
      let infoName = this.tabMap[this.active].info_name
      this.$api.skill.getGoodsList(params)
        .then((data) => {
          this[infoName].list = data.results
          this[infoName].tableInfo.count = data.count
          this.addUrlHash()
          this[infoName].tableInfo.loading = false
        })
    },
    changePage (page) {
      this[this.tabMap[this.active].info_name].tableInfo.page = page
      this.getGoodsList()
    },
    handleSizeChange (length) {
      this[this.tabMap[this.active].info_name].tableInfo.length = length
      this[this.tabMap[this.active].info_name].tableInfo.page = 1
      this.getGoodsList()
    },
    handleSortChange (data) {
      this[this.tabMap[this.active].info_name].tableInfo.order_field = data.prop
      this[this.tabMap[this.active].info_name].tableInfo.order = this.order2orderMap[data.order]
      this[this.tabMap[this.active].info_name].tableInfo.page = 1
      this.getGoodsList()
    },
    searchList () {
      this[this.tabMap[this.active].info_name].tableInfo.page = 1
      this.getGoodsList()
    },
    beforeAddLabel (item) {
      this.addGoodLabelInfo.active = item
      this.addGoodLabelInfo.inputText = ''
      this.addGoodLabelInfo.labelList = this.parseJSON(item.tags) || []
      this.addGoodLabelInfo.visible = true
    },
    submitAddGoodLabel () {
      let params = {
        id: this.addGoodLabelInfo.active.id,
        tags: JSON.stringify(this.addGoodLabelInfo.labelList)
      }
      this.$api.skill.updateGoodInfo(params)
        .then((data) => {
          this.addGoodLabelInfo.active.tags = data.tags
          this.addGoodLabelInfo.visible = false
        })
    },
    handleLabelClose (index) {
      this.addGoodLabelInfo.labelList.splice(index, 1)
    },
    handleAddLabel () {
      // let oldKeywords = this.addGoodLabelInfo.labelList.concat([])
      if (this.addGoodLabelInfo.inputText) {
        let keywordList = this.addGoodLabelInfo.inputText.split(/,|，/)
        for (let i = 0, length = keywordList.length; i < length; i++) {
          if (trim(keywordList[i]) && !this.addGoodLabelInfo.labelList.find((x) => { return x === trim(keywordList[i]) })) {
            this.addGoodLabelInfo.labelList.push(trim(keywordList[i]))
            // if (this.addGoodLabelInfo.labelList.length > 5) {
            //   this.$message({
            //     type: 'error',
            //     message: `最多添加5个关键词，添加失败。`
            //   })
            //   this.addGoodLabelInfo.labelList = oldKeywords
            //   return
            // }
          }
        }
        this.addGoodLabelInfo.inputText = ''
      }
    },
    delCustomGood (item, index) {
      this.$confirm('是否删除该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: item.id,
          is_active: false
        }
        this.$api.skill.updateGoodInfo(params)
          .then((data) => {
            this.customInfo.list.splice(index, 1)
            this.customInfo.tableInfo.count -= 1
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
    },
    emitCustomGood (item, index) {
      item.index = index
      this.addGoodInfo.type = 'edit'
      this.addGoodInfo.activeItem = item
      this.addGoodInfo.visible = true
    },
    cancelPraiseAuth () {
      this.$confirm('解绑后有赞导入商品将会清空, 是否继续?', '解绑有赞店铺', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.user.cancelPraiseAuth()
          .then(() => {
            this.$message({
              type: 'success',
              message: '解绑成功'
            })
            getRobotList(true)
            this.getGoodsList()
          })
      }).catch(() => {})
    },
    addGoodSuccess (data) {
      if (this.addGoodInfo.type === 'add') {
        this.customInfo.list.unshift(data)
        this.customInfo.tableInfo.count += 1
      } else {
        this.customInfo.list[this.addGoodInfo.activeItem.index] = data
      }
    }
  },
  watch: {
    'addGoodInfo.picture': {
      handler (val) {
        this.addGoodInfo.pictureErr = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/style/variate.scss";
.table-search{
  display: flex;
  .table-search-add-btn{
    flex-grow: 1;
    .table-search-label{
      font-size: 12px;
      margin-left: 10px;
    }
  }
}
  .upload-icon-text{
    position: absolute;
    text-align: center;
    display: inline-block;
    left: 0;
    right: 0;
    bottom: 25px;
    line-height: 1;
  }
  .add-good-content{
    display: flex;
    align-items: center;
    .el-form-item{
      &:last-child{
        margin-bottom: 0;
      }
    }
    .add-good-picture{
      flex-grow: 0;
      position: relative;
    }
    .add-good-info{
      flex-grow: 1;
    }
  }
  .label-icon{
    cursor: pointer;
    &:hover{
      color: $blue;
    }
  }
  .add-good-label-box{
    .add-good-label-desc{}
    .add-good-label-info{
      margin-top: 24px;
      .add-good-label-info-list{
        margin-bottom: 6px;
        .keyword-item{
          margin-right: 10px;
          margin-bottom: 10px;
        }
      }
      .add-good-label-info-input{
        display: flex;
        .add-good-label-btn{
          margin-left: 20px;
        }
      }
    }
  }
</style>
