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
    <div class="item-right">
      <el-button @click="beforeAddLabel" size="small" type="primary">触发设置</el-button>
    </div>
  </div>
  <div class="skill-content" style="padding: 0 20px 28px 20px">
    <BasicTable
      :list="tableInfo.list"
      :loading="tableInfo.loading"
      :page="tableInfo.page"
      :total="tableInfo.count"
      :length="tableInfo.length"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      @sort-change="handleSortChange"
      :rowClassName="'salesman-table-row'"
      :default-sort="{prop: tableInfo.order_field, order: tableInfo.order}"
    >
      <div slot="search">
        <div class="table-search">
          <div class="table-search-add-btn">
            <el-button @click.native="goto('/skill/salesman/add')" size="small">添加名片</el-button>
          </div>
          <div class="table-search-input font-size-zero">
            <el-input @keydown.enter.native="handleSearchList" v-model="tableInfo.searchInfo.key" placeholder="根据姓名/职务/手机号码查询" size="small" style="width: 240px;">
            </el-input>
            <el-button @click.native="handleSearchList" type="primary" slot="append" size="small" style="margin-left: 20px">搜索</el-button>
          </div>
        </div>
      </div>
      <template>
        <el-table-column
          prop="is_valid"
          label="状态"
          width="100"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.is_valid">已启用</span>
            <span class="text-color-placeholder" v-else>已停用</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="real_name"
          label="姓名"
        >
        </el-table-column>
        <el-table-column
          prop="position"
          label="职务"
        >
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机"
        >
        </el-table-column>
        <el-table-column
          prop="session_count"
          label="累计访客量"
          width="150"
          sortable="custom"
        >
          <template slot-scope="scope">
            <a v-if="scope.row.session_count" @click="goto(`/skill/salesman/visitor/${scope.row.id}`, {real_name: scope.row.real_name})">{{scope.row.session_count}}</a>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="interact_count"
          label="访客累积互动量"
          width="150"
          sortable="custom"
        >
          <template slot-scope="scope">
            {{scope.row.interact_count ? scope.row.interact_count : '--'}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <div class="option-box">
              <el-popover
                placement="bottom"
                trigger="click"
                @show="showQRCode(scope.row.id)"
              >
                <div :id="`qrcode-${scope.row.id}`"></div>
                <a class="color-blue" slot="reference">二维码</a>
              </el-popover>
              <a @click="goto(`/skill/salesman/add/${scope.row.id}`)" class="color-blue" style="margin-left: 5px;">编辑</a>
              <a @click="handleClickValid(false, scope.row)" class="color-yellow option-hide" v-if="scope.row.is_valid">停用</a>
              <a @click="handleClickValid(true, scope.row)" class="color-green option-hide" v-else>启用</a>
              <a @click="handleDeleteItem(scope.row, scope.$index)" class="color-red option-hide">删除</a>
            </div>
          </template>
        </el-table-column>
      </template>
    </BasicTable>
  </div>
  <el-dialog
    :visible.sync="addLabelInfo.visible"
    :title="'触发设置'"
    width="600px"
  >
    <div slot="title">
      <div>
        <span class="font-size-title text-color-primary">触发设置</span>
        <span class=" text-color-minor">（当用户呼叫所设置的关键词时会随机推送添加好的名片）</span>
      </div>
    </div>
    <div class="add-label-box">
      <div class="add-label-desc">
        关键词
      </div>
      <div class="add-label-info">
        <div class="add-label-info-list">
          <el-tag
            class="keyword-item"
            type="info"
            :key="tagItem.id"
            v-for="(tagItem, index) in addLabelInfo.labelList"
            closable
            :disable-transitions="false"
            @close="handleCloseLabel(index)">
            {{tagItem.human_keywords}}
          </el-tag>
        </div>
        <div class="add-label-info-input">
          <el-input size="small" @keydown.enter.native="handleAddLabel" v-model="addLabelInfo.inputText" placeholder="请输入关键词，多个词用逗号分开"></el-input>
          <el-button @click.native="handleAddLabel" class="add-label-btn" size="small" type="primary">添加</el-button>
        </div>
      </div>
    </div>
    <div slot="footer">
      <el-button :loading="addLabelInfo.loading" @click.native="addLabelInfo.visible = false" size="small">取消</el-button>
      <el-button :loading="addLabelInfo.loading" @click.native="submitUpdateLabel" size="small" type="primary">确定</el-button>
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
import urlMixin from '@/mixins/url'
import trim from 'lodash/trim'
import { getHashParamter, toUrlHash } from '@/utils/common'
import QRCode from 'qrcodejs2'
export default {
  components: {
    BasicTable
  },
  mixins: [commonMixin, urlMixin],
  data () {
    return {
      colorCompany,
      skillId: 11,
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
      addLabelInfo: {
        visible: false,
        loading: false,
        active: {},
        inputText: '',
        delList: [],
        labelList: []
      }
    }
  },
  computed: {
    ...mapGetters(['nowRobotInfo', 'nowRobot']),
    params () {
      let params = {
        page: this.tableInfo.page,
        page_size: this.tableInfo.length,
        search: this.tableInfo.searchInfo.key,
        order: this.tableInfo.order,
        order_field: this.tableInfo.order_field
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
    init () {
      let skillMap = industryInfoMap[this.nowRobotInfo.industry].skillMap
      this.skillInfo = skillMap[this.skillId]
      this.getSalesmanList()
      this.getSkillItem()
      this.getLabel()
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
    getSkillItem () {
      this.$api.skill.getSkillItem(this.skillId)
        .then((data) => {
          this.skillInfo.info = data
        })
    },
    handlePageChange (page) {
      this.tableInfo.page = page
      this.getSalesmanList()
    },
    handleSizeChange (length) {
      this.tableInfo.length = length
      this.tableInfo.page = 1
      this.getSalesmanList()
    },
    handleSortChange (data) {
      this.tableInfo.order_field = data.prop
      this.tableInfo.order = data.order
      this.tableInfo.page = 1
      this.getSalesmanList()
    },
    handleFilterList () {
      this.tableInfo.page = 1
      this.getSalesmanList()
    },
    handleSearchList () {
      this.tableInfo.page = 1
      this.getSalesmanList()
    },
    getSalesmanList () {
      this.tableInfo.loading = true
      this.tableInfo.list = []
      let params = JSON.parse(JSON.stringify(this.params))
      params.ordering = params.order_field ? filterOrderMap[params.order] + params.order_field : ''
      this.$api.skill.getSalesmanList(this.params)
        .then((data) => {
          this.tableInfo.loading = false
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
    handleClickValid (valid, item) {
      let params = {
        id: item.id,
        is_valid: valid
      }
      this.$api.skill.updateSalesman(params)
        .then((data) => {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          item.is_valid = valid
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '修改失败，请重试'
          })
        })
    },
    handleDeleteItem (item, index) {
      this.$confirm('是否删除该名片?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.skill.deleteSalesman(item.id)
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
    getLabel () {
      this.$api.skill.getAICardConfig(this.nowRobot)
        .then((data) => {
          this.addLabelInfo.labelList = data.results
        })
    },
    beforeAddLabel () {
      this.addLabelInfo.inputText = ''
      this.addLabelInfo.visible = true
    },
    handleAddLabel () {
      if (this.addLabelInfo.inputText) {
        let keywordList = this.addLabelInfo.inputText.split(/,|，/)
        for (let i = 0, length = keywordList.length; i < length; i++) {
          if (trim(keywordList[i]) && !this.addLabelInfo.labelList.find((x) => { return x.human_keywords === trim(keywordList[i]) })) {
            let keywordItem = {
              'human_keywords': trim(keywordList[i]),
              'robotskill': this.skillInfo.info.id
            }
            this.addLabelInfo.labelList.push(keywordItem)
          }
        }
        this.addLabelInfo.inputText = ''
      }
    },
    handleCloseLabel (index) {
      let delList = this.addLabelInfo.labelList.splice(index, 1)
      this.addLabelInfo.delList.push(delList[0])
    },
    submitUpdateLabel () {
      let addList = this.addLabelInfo.labelList.filter((item) => {
        return !item.id
      })
      this.addLabelInfo.loading = true
      this.$http.all([this.addLabelInfo.delList.length > 0 ? this.submitDelLabel() : '', addList.length > 0 ? this.submitAddLabel(addList) : ''])
        .then(() => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.addLabelInfo.loading = false
          this.addLabelInfo.visible = false
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '保存失败，请重试'
          })
          this.addLabelInfo.loading = false
        })
    },
    submitAddLabel (addList) {
      return this.$api.skill.addAICardConfig(addList)
        .then((data) => {
          this.getLabel()
        })
    },
    submitDelLabel () {
      let delList = this.addLabelInfo.delList.map((item) => {
        item.is_active = false
        return item
      })
      return this.$api.skill.delAICardConfig(delList)
        .then((data) => {
          this.addLabelInfo.delList = []
        })
    },
    showQRCode (salesmanId) {
      let id = `qrcode-${salesmanId}`
      if (!this[id]) {
        this[id] = new QRCode(document.getElementById(id), {
          text: this.getH5Url() + `&business_card=${salesmanId}`,
          width: 128,
          height: 128,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        })
      }
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
      flex-grow: 0;
      flex-shrink: 0;
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
    .item-right{
      flex-grow: 0;
      flex-shrink: 0;
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
    .option-hide{
      /*visibility: hidden;*/
    }
  }
  .skill-content{
    /deep/ .salesman-table-row:hover{
      .option-hide{
        visibility: visible;
      }
    }
  }
  .add-label-box{
    .add-label-desc{}
    .add-label-info{
      margin-top: 20px;
      .add-label-info-list{
        margin-bottom: 10px;
        .keyword-item{
          margin-right: 10px;
          margin-bottom: 10px;
        }
      }
      .add-label-info-input{
        display: flex;
        .add-label-btn{
          margin-left: 20px;
        }
      }
    }
  }
</style>
