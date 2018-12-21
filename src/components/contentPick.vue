/**
* desc: 商品选择组件
* */
<template>
<div>
  <el-dialog
    :visible.sync="show"
    width="932px"
    top="5vh"
    center
    :close-on-click-modal="false"
    title="选择素材"
    append-to-body
    custom-class="dialog-padding-small"
  >
    <div class="pick-content-main">
      <el-tabs v-model="active" class="tab-center">
        <el-tab-pane label="商品" name="good" v-loading="goodInfo.tableInfo.loading">
          <div class="pick-content-filter-search">
            <div class="filter-box">
              <button class="idbear-btn btn-small pick-filter-btn" :class="[goodInfo.tableInfo.order_field === 'price' ? goodInfo.tableInfo.order: '']" @click="handleOrderBtn('price')">
                价格
                <span class="caret-wrapper"><i class="sort-caret ascending"></i><i class="sort-caret descending"></i></span>
              </button>
              <button class="idbear-btn btn-small pick-filter-btn" :class="[goodInfo.tableInfo.order_field === 'sold_num' ? goodInfo.tableInfo.order: '']" @click="handleOrderBtn('sold_num')">
                销量
                <span class="caret-wrapper"><i class="sort-caret ascending"></i><i class="sort-caret descending"></i></span>
              </button>
              <button class="idbear-btn btn-small pick-filter-btn" :class="[goodInfo.tableInfo.order_field === 'update_time' ? goodInfo.tableInfo.order: '']" @click="handleOrderBtn('update_time')">
                时间
                <span class="caret-wrapper"><i class="sort-caret ascending"></i><i class="sort-caret descending"></i></span>
              </button>
            </div>
            <div class="search-box font-size-zero">
              <el-input @keydown.enter.native="searchList" v-model="goodInfo.searchInfo.key" placeholder="请输入商品名称" style="width: 300px;" size="small"></el-input>
              <el-button @click.native="searchList" type="primary" slot="append" size="small" style="margin-left: 20px" >搜索</el-button>
            </div>
          </div>
          <div class="pick-content-table">
            <div class="pick-content-content">
              <el-row  :gutter="20" v-if="goodInfo.list.length != 0" style="margin-left: 0;margin-right: 0;">
                <el-col :xs="8" :sm="6" :md="4" :lg="4" :xl="4" class="pick-content-item" v-for="(item) in goodInfo.list" :key="item.id">
                  <div class="pick-content-item-content box-shadow cursor-pointer" @click="pickItem(item)" :class="{'pick-active': isPick(item)!=-1}">
                    <div class="pick-content-item-img"><img :src="item.picture" /></div>
                    <div class="pick-content-item-info">
                      <div class="pick-content-item-title">{{item.title}}</div>
                      <div class="pick-content-item-price-soldnum">
                        <div class="pick-content-item-sold">已售{{item.sold_num || 0}}件</div>
                        <div class="pick-content-item-price">￥{{item.price / 100}}</div>
                      </div>
                    </div>
                    <div class="pick-content-item-select-order" v-if="isPick(item)!=-1">{{isPick(item) + 1}}</div>
                  </div>
                </el-col>
              </el-row>
              <div v-else style="display: flex;align-items: center;justify-content: center;height: 300px;">
                <el-button @click.native="addInfo.showAddGoods = true" type="primary" size="medium" round>新建商品</el-button>
              </div>
            </div>
            <div class="pagination-box">
              <div class="pagination-left text-color-primary">
                <el-button plain size="small" type="primary" icon="el-icon-plus" @click.native="addInfo.showAddGoods = true">新建商品</el-button>
                <el-button plain size="small" @click.native="selectedContent=[]">清空重选({{selectedContent.length}}/{{selectMax}})</el-button>
                <!--<span class="text-color-minor font-size-smaller">-->
                  <!--已选择<span class="selected-num-label">{{selectedContent.length}}</span>/{{selectMax}}件素材-->
                <!--</span>-->
                <!--<a @click="selectedContent=[]">清空重选</a>-->
              </div>
              <el-pagination
                layout="total, prev, pager, next, jumper"
                background
                prev-text="上一页"
                next-text="下一页"
                :page-size="goodInfo.tableInfo.length"
                :total="goodInfo.tableInfo.count"
                :current-page="goodInfo.tableInfo.page"
                class="pagination"
                @current-change="pageChange"
              >
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="文章" name="article" v-loading="articleInfo.tableInfo.loading">
          <div class="pick-content-filter-search">
            <div class="filter-box">
              <button class="idbear-btn btn-small pick-filter-btn" :class="[articleInfo.tableInfo.order_field === 'send_date' ? articleInfo.tableInfo.order: '']" @click="handleOrderBtn('send_date')">
                时间
                <span class="caret-wrapper"><i class="sort-caret ascending"></i><i class="sort-caret descending"></i></span>
              </button>
            </div>
            <div class="search-box font-size-zero">
              <el-input @keydown.enter.native="searchList" v-model="articleInfo.searchInfo.key" placeholder="请输入文章标题" style="width: 300px;" size="small"></el-input>
              <el-button @click.native="searchList" type="primary" slot="append" size="small" style="margin-left: 20px" >搜索</el-button>
            </div>
          </div>
          <div>
            <div class="pick-content-content">
              <el-row :gutter="20" v-if="articleInfo.list.length != 0" style="margin-left: 0;margin-right: 0;">
                <el-col :xs="8" :sm="6" :md="4" :lg="4" :xl="4" class="pick-content-item" v-for="(item) in articleInfo.list" :key="item.id">
                  <div class="pick-content-item-content box-shadow cursor-pointer" @click="pickItem(item)" :class="{'pick-active': isPick(item)!=-1}">
                    <div class="pick-content-item-img"><img :src="item.thumb_url" /></div>
                    <div class="pick-content-item-info">
                      <div class="pick-content-item-title">{{item.title}}</div>
                    </div>
                    <!--<div class="pick-content-item-price-soldnum">-->
                    <!--<div class="pick-content-item-sold">已售{{item.sold_num}}件</div>-->
                    <!--<div class="pick-content-item-price">￥{{item.price / 100}}</div>-->
                    <!--</div>-->
                    <div class="pick-content-item-select-order" v-if="isPick(item)!=-1">{{isPick(item) + 1}}</div>
                  </div>
                </el-col>
              </el-row>
              <div v-else style="display: flex;align-items: center;justify-content: center;height: 300px;">
                <el-button @click.native="addInfo.showAddArticle = true" type="primary" size="medium" round>新建文章</el-button>
              </div>
            </div>
            <div class="pagination-box">
              <div class="pagination-left text-color-primary">
                <el-button plain size="small" type="primary" icon="el-icon-plus" @click.native="addInfo.showAddArticle = true">新建文章</el-button>
                <el-button plain size="small" @click.native="selectedContent=[]">清空重选({{selectedContent.length}}/{{selectMax}})</el-button>
              </div>
              <el-pagination
                layout="total, prev, pager, next, jumper "
                background
                prev-text="上一页"
                next-text="下一页"
                :page-size="articleInfo.tableInfo.length"
                :total="articleInfo.tableInfo.count"
                :current-page="articleInfo.tableInfo.page"
                class="pagination"
                @current-change="pageChange"
              >
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="微主页" name="store" v-loading="storeInfo.tableInfo.loading">
          <div class="pick-content-filter-search">
            <div class="filter-box">
              <!--<button class="idbear-btn btn-small pick-filter-btn" :class="[storeInfo.tableInfo.order_field === 'send_date' ? storeInfo.tableInfo.order: '']" @click="handleOrderBtn('send_date')">-->
                <!--时间-->
                <!--<span class="caret-wrapper"><i class="sort-caret ascending"></i><i class="sort-caret descending"></i></span>-->
              <!--</button>-->
            </div>
            <div class="search-box font-size-zero">
              <el-input @keydown.enter.native="searchList" v-model="storeInfo.searchInfo.key" placeholder="请输入微主页标题" style="width: 300px;" size="small"></el-input>
              <el-button @click.native="searchList" type="primary" slot="append" size="small" style="margin-left: 20px" >搜索</el-button>
            </div>
          </div>
          <div>
            <div class="pick-content-content">
              <el-row v-if="storeInfo.list.length != 0" :gutter="20" style="margin-left: 0;margin-right: 0;">
                <el-col :xs="8" :sm="6" :md="4" :lg="4" :xl="4" class="pick-content-item" v-for="(item) in storeInfo.list" :key="item.id">
                  <div class="pick-content-item-content box-shadow cursor-pointer" @click="pickItem(item)" :class="{'pick-active': isPick(item)!=-1}">
                    <div class="pick-content-item-img"><img :src="item.logo_url" /></div>
                    <div class="pick-content-item-info">
                      <div class="pick-content-item-title">{{item.chs_name}}</div>
                    </div>
                    <div class="pick-content-item-select-order" v-if="isPick(item)!=-1">{{isPick(item) + 1}}</div>
                  </div>
                </el-col>
              </el-row>
              <div v-else style="display: flex;align-items: center;justify-content: center;height: 300px;">
                <el-button @click.native="openWindow('/skill/addStore')" type="primary" size="medium" round>新建微主页</el-button>
              </div>
            </div>
            <div class="pagination-box">
              <div class="pagination-left text-color-primary">
                <el-button plain size="small" type="primary" icon="el-icon-plus" @click.native="openWindow('/skill/addStore')">新建微主页</el-button>
                <el-button plain size="small" @click.native="selectedContent=[]">清空重选({{selectedContent.length}}/{{selectMax}})</el-button>
              </div>
              <el-pagination
                layout="total, prev, pager, next, jumper "
                background
                prev-text="上一页"
                next-text="下一页"
                :page-size="storeInfo.tableInfo.length"
                :total="storeInfo.tableInfo.count"
                :current-page="storeInfo.tableInfo.page"
                class="pagination"
                @current-change="pageChange"
              >
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div slot="footer" class="dialog-pick-footer">
      <el-button @click.native="show=false" size="small">取消</el-button>
      <el-button type="primary" @click="confirm" size="small">确定</el-button>
    </div>
  </el-dialog>
  <AddGoodsDialog
    :visible.sync="addInfo.showAddGoods"
    @on-success="addGoodsOrArticleSuccess"
  >
  </AddGoodsDialog>
  <AddArticleDialog
    :visible.sync="addInfo.showAddArticle"
    @on-success="addGoodsOrArticleSuccess"
  ></AddArticleDialog>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import AddGoodsDialog from '@/components/dialog/addGoodsDialog'
import AddArticleDialog from '@/components/dialog/addArticleDialog'
export default {
  components: {
    AddGoodsDialog,
    AddArticleDialog
  },
  data () {
    return {
      show: false,
      active: 'good',
      tabMap: {
        'good': {
          label: '商品',
          info_name: 'goodInfo',
          apiName: 'getGoodsList'
        },
        'article': {
          label: '文章',
          info_name: 'articleInfo',
          apiName: 'getArticleList'
        },
        'store': {
          label: '微主页',
          info_name: 'storeInfo',
          apiName: 'getStoreList'
        }
      },
      selectedContent: [],
      goodInfo: {
        tableInfo: { // 商品表格信息
          loading: false,
          page: 1,
          count: 0,
          length: 12,
          order: '',
          order_field: ''
        },
        searchInfo: {
          key: ''
        },
        list: []
      },
      articleInfo: {
        tableInfo: { // 商品表格信息
          loading: false,
          page: 1,
          count: 0,
          length: 12,
          order: '',
          order_field: ''
        },
        searchInfo: {
          key: ''
        },
        list: []
      },
      storeInfo: {
        tableInfo: { // 商品表格信息
          loading: false,
          page: 1,
          count: 0,
          length: 12,
          order: '',
          order_field: ''
        },
        searchInfo: {
          key: ''
        },
        list: []
      },
      addInfo: {
        showAddGoods: false,
        showAddArticle: false
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    selectMax: {
      type: Number,
      default: 8
    },
    selectedList: {
      type: Array
    }
  },
  computed: {
    ...mapGetters([
      'nowStoreObj'
    ])
  },
  created () {
    this.show = this.value
  },
  methods: {
    openWindow (url) {
      window.open(window.location.origin + url)
    },
    getContentList () {
      let params = {
        page_size: this[this.tabMap[this.active].info_name].tableInfo.length,
        page: this[this.tabMap[this.active].info_name].tableInfo.page,
        search: this[this.tabMap[this.active].info_name].searchInfo.key,
        order_field: this[this.tabMap[this.active].info_name].tableInfo.order_field,
        order: this[this.tabMap[this.active].info_name].tableInfo.order
      }
      this[this.tabMap[this.active].info_name].tableInfo.loading = true
      this[this.tabMap[this.active].info_name].list = []
      this.$api.skill[this.tabMap[this.active].apiName](params)
        .then((data) => {
          this[this.tabMap[this.active].info_name].list = data.results
          this[this.tabMap[this.active].info_name].tableInfo.count = data.count
          this[this.tabMap[this.active].info_name].tableInfo.loading = false
        })
    },
    searchList () {
      this[this.tabMap[this.active].info_name].tableInfo.page = 1
      this.getContentList()
    },
    pageChange (page) {
      this[this.tabMap[this.active].info_name].tableInfo.page = page
      this.getContentList()
    },
    confirm () {
      this.show = false
      this.$emit('select', this.selectedContent)
    },
    pickItem (item) {
      let index = this.selectedContent.findIndex((val) => {
        return item.id === val.info.id
      })
      if (index !== -1) {
        this.selectedContent.splice(index, 1)
      } else {
        if (this.selectedContent.length >= this.selectMax) {
          this.$message.error({
            message: '已到达数量上限'
          })
        } else {
          let temp = {
            id: item.id,
            type: this.active,
            info: item
          }
          this.selectedContent.push(temp)
        }
      }
    },
    isPick (item) {
      let index = this.selectedContent.findIndex((val) => {
        return item.id === val.id
      })
      return index
    },
    handleOrderBtn (field) {
      let orderlist = ['asc', 'desc', '']
      if (this[this.tabMap[this.active].info_name].tableInfo.order_field === field && this[this.tabMap[this.active].info_name].tableInfo.order) {
        let oldIndex = orderlist.indexOf(this[this.tabMap[this.active].info_name].tableInfo.order)
        this[this.tabMap[this.active].info_name].tableInfo.order = orderlist[(oldIndex + 1) % 3]
      } else {
        this[this.tabMap[this.active].info_name].tableInfo.order_field = field
        this[this.tabMap[this.active].info_name].tableInfo.order = 'asc'
      }
      this[this.tabMap[this.active].info_name].tableInfo.page = 1
      this.getContentList()
    },
    addGoodsOrArticleSuccess (data) {
      this[this.tabMap[this.active].info_name].tableInfo.page = 1
      this[this.tabMap[this.active].info_name].tableInfo.order = ''
      this[this.tabMap[this.active].info_name].tableInfo.order_field = ''
      this[this.tabMap[this.active].info_name].searchInfo.key = ''
      this.getContentList()
    }
  },
  watch: {
    value (value) {
      this.show = value
      if (value) {
        this.getContentList()
        if (this.selectedList && this.selectedList.length !== 0) {
          this.selectedContent = JSON.parse(JSON.stringify(this.selectedList))
        } else {
          this.selectedContent = []
        }
      }
    },
    show (value) {
      this.$emit('input', value)
    },
    active: {
      handler () {
        if (this[this.tabMap[this.active].info_name].list.length === 0) {
          this.getContentList()
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/style/variate.scss';
.pick-content-filter-search{
  padding: 0 10px;
  margin-bottom: 10px;
  display: flex;
  .filter-box{
    flex-grow: 1;
    .pick-filter-btn{
      margin-right: 15px;
      &:hover{
        border-color: $blue !important;
        color: #606266 !important;
        background: #fff !important;
      }
    }
    .caret-wrapper {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      height: 10px;
      width: 17px;
      vertical-align: middle;
      cursor: pointer;
      overflow: initial;
      position: relative;
    }
    .desc{
      .sort-caret.descending{
        border-top-color: $blue;
      }
    }
    .asc{
      .sort-caret.ascending{
        border-bottom-color: $blue;
      }
    }
    .sort-caret {
      width: 0;
      height: 0;
      border: solid 5px transparent;
      position: absolute;
      left: 7px;
      &.ascending {
        border-bottom-color: $text-placeholder;
        top: -8px;
      }
      &.descending {
        border-top-color: $text-placeholder;
        bottom: -4px;
      }
    }
  }
  .search-box{
    flex-grow: 0;
  }
}
.pagination-box{
  text-align: right;
  position: relative;
  padding: 15px 10px;
  .selected-num-label{
    color: $red;
  }
  .pagination-left{
    padding: 15px 10px;
    font-size: 13px;
    display: inline-block;
    line-height: 32px;
    vertical-align: top;
    position: absolute;
    left: 0;
    top: 0;
  }
  .pagination{
    padding-right: 0;
  }
}
.pick-active{
}
  .pick-content-content{
    width: 100%;
    min-height: 300px;
    .pick-content-item{
      padding: 10px 0;
      font-size: 12px;
      .pick-content-item-content{
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        border: 1px solid #fff;
        overflow: hidden;
        &:hover{
          border: 1px solid $blue;
        }
        .pick-content-item-img{
          width: 100%;
          position: relative;
          padding-bottom: 75%;
          font-size: 0;
          img{
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            margin:auto;
          }
        }
        .pick-content-item-info{
          width: 100%;
          padding: 10px 6px;
        }
        .pick-content-item-title{
          width: 100%;
          text-align: left;
          line-height: 1.4em;
          height: 2.8em;
          text-overflow: ellipsis;
          display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
          -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
          -webkit-line-clamp: 2; /** 显示的行数 **/
          overflow: hidden;  /** 隐藏超出的内容 **/
        }
        .pick-content-item-price-soldnum{
          margin-top: 10px;
          color: $red;
          display: flex;
          width: 100%;
          line-height: 1;
          .pick-content-item-sold{
            flex-grow: 1;
          }
          .pick-content-item-price{
            flex-grow: 0;
          }
        }
        .pick-content-item-select-order{
          position: absolute;
          left: 0;
          top: 0;
          text-align: center;
          line-height: 25px;
          color: #fff;
          width: 25px;
          height: 25px;
          background: $blue;
        }
      }
    }
  }
  .pick-content-table-null{
    width: 100%;
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
