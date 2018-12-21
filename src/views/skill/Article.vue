<template>
  <div class="article-page">
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
    <div class="is-content-block" v-show="active == 'wechat'">
      <BasicTable
        :list="wechatInfo.list"
        :loading="wechatInfo.tableInfo.loading"
        :page="wechatInfo.tableInfo.page"
        :total="wechatInfo.tableInfo.count"
        :length="wechatInfo.tableInfo.length"
        :default-sort="{prop: wechatInfo.tableInfo.order_field, order: this.order2orderMap[wechatInfo.tableInfo.order]}"
        @current-change="changePage"
        @size-change="handleSizeChange"
        @sort-change="handleSortChange"
      >
        <div slot="search">
          <div class="table-search">
            <div class="table-search-add-btn">
              <template v-if="nowRobotInfo.wechataccount && nowRobotInfo.wechataccount[0]">
                <el-button size="small" disabled style="cursor: auto;color: #606266;border: 1px solid #dcdfe6;">微信公众号：{{nowRobotInfo.wechataccount[0].nick_name}}</el-button>
                <a style="margin-left: 5px;" @click="cancelWechatAuth(init)" class="font-size-smaller">解除绑定</a>
              </template>
              <el-button @click.native="bindWechat" size="small" v-else>绑定公众号</el-button>
            </div>
            <div class="table-search-input font-size-zero">
              <el-input @keydown.enter.native="searchList" v-model="wechatInfo.searchInfo.key" placeholder="根据标题搜索" size="small" style="width: 240px;">
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
            <template slot-scope="scope">
              <a class="link-black" target="_blank" :href="scope.row.url">{{scope.row.title}}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="label"
            label="文章标签"
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
            prop="send_date"
            label="发表时间"
            sortable="custom"
            width="200"
          >
            <template slot-scope="scope">
              {{formatDate(scope.row.send_date)}}
            </template>
          </el-table-column>
        </template>
      </BasicTable>
    </div>

    <div class="is-content-block" v-show="active == 'custom'">
      <BasicTable
        :list="customInfo.list"
        :loading="customInfo.tableInfo.loading"
        :page="customInfo.tableInfo.page"
        :total="customInfo.tableInfo.count"
        :length="customInfo.tableInfo.length"
        :default-sort="{prop: customInfo.tableInfo.order_field, order: this.order2orderMap[customInfo.tableInfo.order]}"
        @current-change="changePage"
        @size-change="handleSizeChange"
        @sort-change="handleSortChange"
      >
        <div slot="search">
          <div class="table-search">
            <div class="table-search-add-btn">
              <el-button @click.native="addArticleInfo.visible = true;addArticleInfo.type = 'add';addArticleInfo.activeItem={};" size="small">新建文章</el-button>
            </div>
            <div class="table-search-input">
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
            min-width="200"
            align="left"
          >
            <template slot-scope="scope">
              <a class="link-black" target="_blank" :href="scope.row.url">{{scope.row.title}}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="label"
            label="文章标签"
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
            prop="send_date"
            label="发表时间"
            sortable="custom"
            width="200"
          >
            <template slot-scope="scope">
              {{formatDate(scope.row.send_date)}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <a @click="emitCustomArticle(scope.row, scope.$index)" style="margin-right: 5px">编辑</a>
              <a @click="delCustomArticle(scope.row, scope.$index)" class="color-red">删除</a>
            </template>
          </el-table-column>
        </template>
      </BasicTable>
    </div>
    <AddArticleDialog
      :visible.sync="addArticleInfo.visible"
      :activeItem="addArticleInfo.activeItem"
      @on-success="addArticleSuccess"
    ></AddArticleDialog>
    <el-dialog
      :visible.sync="addArticleLabelInfo.visible"
      :title="addArticleLabelInfo.title"
      width="600px"
    >
      <div class="add-article-label-box">
        <div class="add-article-label-desc">
          {{addArticleLabelInfo.desc}}
        </div>
        <div class="add-article-label-info">
          <div class="add-article-label-info-list">
            <el-tag
              class="keyword-item"
              type="info"
              :key="index"
              v-for="(tagItem, index) in addArticleLabelInfo.labelList"
              closable
              :disable-transitions="false"
              @close="handleLabelClose(index)">
              {{tagItem}}
            </el-tag>
          </div>
          <div class="add-article-label-info-input">
            <el-input size="small" @keydown.enter.native="handleAddLabel" v-model="addArticleLabelInfo.inputText" placeholder="请输入关键词，多个词用逗号分开"></el-input>
            <el-button @click.native="handleAddLabel" class="add-article-label-btn" size="small" type="primary">添加</el-button>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button :loading="addArticleLabelInfo.loading" @click.native="addArticleLabelInfo.visible = false" size="small">取消</el-button>
        <el-button :loading="addArticleLabelInfo.loading" @click.native="submitAddArticleLabel" size="small" type="primary">确定</el-button>
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
import AddArticleDialog from '@/components/dialog/addArticleDialog'
import { getHashParamter, toUrlHash } from '@/utils/common'
export default {
  components: {
    BasicTable,
    AddArticleDialog
  },
  mixins: [mixin],
  data () {
    return {
      active: 'wechat',
      order2orderMap,
      tabMap: {
        'wechat': {
          label: '公众号文章',
          article_type: 1,
          info_name: 'wechatInfo'
        },
        'custom': {
          label: '其他文章',
          article_type: 0,
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
      wechatInfo: {
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
      addArticleInfo: {
        type: 'add',
        activeItem: {},
        visible: false
      },
      addArticleLabelInfo: {
        visible: false,
        loading: false,
        title: '文章标签',
        desc: '用户呼叫中包含这些关键字标签或其同义词，则可智能推荐出该文章',
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
    init () {
      this.getArticleList()
    },
    ...mapActions([
      'setShowBindWechatDialog',
      'setShowRemoveWechatDialog'
    ]),
    initHash () {
      let hashParams = getHashParamter()
      this.active = hashParams.active || 'wechat'
      this[this.tabMap[this.active].info_name].tableInfo.length = hashParams.page_size ? parseInt(hashParams.page_size) : 20
      this[this.tabMap[this.active].info_name].tableInfo.count = hashParams.count ? parseInt(hashParams.count) : 0
      this[this.tabMap[this.active].info_name].tableInfo.page = hashParams.page ? parseInt(hashParams.page) : 1
      this[this.tabMap[this.active].info_name].searchInfo.key = hashParams.search || ''
      this[this.tabMap[this.active].info_name].tableInfo.order_field = hashParams.order_field || ''
      this[this.tabMap[this.active].info_name].tableInfo.order = hashParams.order || ''
    },
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
      this.getArticleList()
    },
    formatDate,
    gotoYOUZAN () {
      window.location.href = 'https://open.youzan.com/oauth/authorize?client_id=0f9cd1ad538f44ec17 &response_type=code&state=6&redirect_uri=http://test.id-bear.com:6004/praise/callback/'
    },
    getArticleList () {
      this[this.tabMap[this.active].info_name].tableInfo.loading = true
      let params = {
        article_type: this.tabMap[this.active].article_type,
        page_size: this[this.tabMap[this.active].info_name].tableInfo.length,
        page: this[this.tabMap[this.active].info_name].tableInfo.page,
        search: this[this.tabMap[this.active].info_name].searchInfo.key,
        order_field: this[this.tabMap[this.active].info_name].tableInfo.order_field,
        order: this[this.tabMap[this.active].info_name].tableInfo.order
      }
      this[this.tabMap[this.active].info_name].list = []
      let infoName = this.tabMap[this.active].info_name
      this.$api.skill.getArticleList(params)
        .then((data) => {
          this[infoName].list = data.results
          this[infoName].tableInfo.count = data.count
          // this[this.tabMap[this.active].info_name].tableInfo.page = params.page
          this.addUrlHash()
          this[infoName].tableInfo.loading = false
        })
    },
    changePage (page) {
      this[this.tabMap[this.active].info_name].tableInfo.page = page
      this.getArticleList()
    },
    handleSizeChange (length) {
      this[this.tabMap[this.active].info_name].tableInfo.length = length
      this[this.tabMap[this.active].info_name].tableInfo.page = 1
      this.getArticleList()
    },
    handleSortChange (data) {
      if (this[this.tabMap[this.active].info_name].tableInfo.order_field === data.prop && this[this.tabMap[this.active].info_name].tableInfo.order === this.order2orderMap[data.order]) {
        return
      }
      this[this.tabMap[this.active].info_name].tableInfo.order_field = data.prop
      this[this.tabMap[this.active].info_name].tableInfo.order = this.order2orderMap[data.order]
      this[this.tabMap[this.active].info_name].tableInfo.page = 1
      this.getArticleList()
    },
    searchList () {
      this[this.tabMap[this.active].info_name].tableInfo.page = 1
      this.getArticleList()
    },
    beforeAddLabel (item) {
      this.addArticleLabelInfo.active = item
      this.addArticleLabelInfo.inputText = ''
      this.addArticleLabelInfo.labelList = this.parseJSON(item.tags) || []
      this.addArticleLabelInfo.visible = true
    },
    submitAddArticleLabel () {
      let params = {
        id: this.addArticleLabelInfo.active.id,
        tags: JSON.stringify(this.addArticleLabelInfo.labelList)
      }
      this.$api.skill.updateArticleInfo(params)
        .then((data) => {
          this.addArticleLabelInfo.active.tags = data.tags
          this.addArticleLabelInfo.visible = false
        })
      this.addArticleLabelInfo.visible = false
    },
    handleLabelClose (index) {
      this.addArticleLabelInfo.labelList.splice(index, 1)
    },
    handleAddLabel () {
      // let oldKeywords = this.addArticleLabelInfo.labelList.concat([])
      if (this.addArticleLabelInfo.inputText) {
        let keywordList = this.addArticleLabelInfo.inputText.split(/,|，/)
        for (let i = 0, length = keywordList.length; i < length; i++) {
          if (trim(keywordList[i]) && !this.addArticleLabelInfo.labelList.find((x) => { return x === trim(keywordList[i]) })) {
            this.addArticleLabelInfo.labelList.push(trim(keywordList[i]))
            // if (this.addArticleLabelInfo.labelList.length > 5) {
            //   this.$message({
            //     type: 'error',
            //     message: `最多添加5个关键词，添加失败。`
            //   })
            //   this.addArticleLabelInfo.labelList = oldKeywords
            //   return
            // }
          }
        }
        this.addArticleLabelInfo.inputText = ''
      }
    },
    delCustomArticle (item, index) {
      this.$confirm('是否删除该文章?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: item.id,
          is_active: false
        }
        this.$api.skill.updateArticleInfo(params)
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
    emitCustomArticle (item, index) {
      item.index = index
      this.addArticleInfo.type = 'edit'
      this.addArticleInfo.activeItem = item
      this.addArticleInfo.visible = true
    },
    addArticleSuccess (data) {
      if (this.addArticleInfo.type === 'add') {
        this.customInfo.list.unshift(data)
        this.customInfo.tableInfo.count += 1
      } else {
        this.customInfo.list[this.addArticleInfo.activeItem.index] = data
      }
    }
  },
  watch: {
    'addArticleInfo.thumb_url': {
      handler (val) {
        this.addArticleInfo.thumbErr = false
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
  .label-icon{
    cursor: pointer;
    &:hover{
      color: $blue;
    }
  }
  .add-article-label-box{
    .add-article-label-desc{}
    .add-article-label-info{
      margin-top: 24px;
      .add-article-label-info-list{
        margin-bottom: 6px;
        .keyword-item{
          margin-right: 10px;
          margin-bottom: 10px;
        }
      }
      .add-article-label-info-input{
        display: flex;
        .add-article-label-btn{
          margin-left: 20px;
        }
      }
    }
  }
</style>
