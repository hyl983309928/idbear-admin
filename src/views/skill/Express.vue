/**
* desc: 机器人管理-转人工客服设置
* */
<template>
  <div class="is-content-block" style="padding: 0;">
    <div class="content-wrap">
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
      <div style="padding: 0 20px 28px 20px">
        <div class="is-module-content">
          <div class="label">
            <span>关键词</span>
          </div>
          <div class="keyword-list">
            <el-tag
              class="keyword-item"
              type="info"
              :key="tagItem.id"
              v-for="(tagItem, index) in expressWordList"
              :closable="true"
              :disable-transitions="false"
              @close="handleClose(index)">
              {{tagItem.keywords}}
            </el-tag>
          </div>
          <div class="add-keyword font-size-zero">
            <el-input v-model="keywordInput" @keydown.enter.native="addKeyword" class="add-keyword-input" placeholder="请输入关键词，多个词用逗号分开" size="medium" style="width: 450px"></el-input>
            <el-button @click="addKeyword" class="add-keyword-btn" type="primary" size="medium" style="margin-left: 20px;">添加</el-button>
          </div>
        </div>
        <div class="is-module-content">
          <el-button @click.native="submit" type="primary" :loading="btnLoading" size="medium">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HelpQueryIcon from '@/components/helpQueryIcon'
import BasicError from '@/components/basicError'
import { mapGetters } from 'vuex'
import CropperImage from '@/components/cropperImage'
import { colorCompany } from '@/style/variate'
import trim from 'lodash/trim'
import { checkRobotListExist } from '@/lib/modules/user'
import { industryInfoMap } from '../../lib/config'
export default {
  components: {
    HelpQueryIcon,
    BasicError,
    CropperImage
  },
  data () {
    return {
      colorCompany,
      skillId: 3,
      skillInfo: {},
      expressWordList: [],
      delWordList: [],
      keywordMax: 10,
      keywordInput: '',
      btnLoading: false,
      lastOrder: 0
    }
  },
  computed: {
    ...mapGetters(['nowRobotInfo'])
  },
  created () {
    checkRobotListExist(this.init)
  },
  mounted () {
  },
  beforeRouteLeave (to, form, next) {
    next()
  },
  methods: {
    init () {
      let skillMap = industryInfoMap[this.nowRobotInfo.industry].skillMap
      this.skillInfo = skillMap[3]
      this.getSkillItem()
      this.getExpressInfo()
    },
    getSkillItem () {
      this.$api.skill.getSkillItem(this.skillId)
        .then((data) => {
          this.skillInfo.info = data
          this.lastOrder = data.length > 0 ? data[data.length - 1].order : 1
        })
    },
    getExpressInfo () {
      this.$api.skill.getExpressWordList(this.skillId)
        .then((data) => {
          this.expressWordList = data
        })
    },
    handleClose (index) {
      let delList = this.expressWordList.splice(index, 1)
      this.delWordList.push(delList[0])
    },
    addKeyword () {
      let oldKeywords = this.expressWordList.concat([])
      if (this.keywordInput) {
        let keywordList = this.keywordInput.split(/,|，/)
        for (let i = 0, length = keywordList.length; i < length; i++) {
          if (keywordList[i] && !this.expressWordList.find((x) => { return x.keywords === trim(keywordList[i]) })) {
            let keywordItem = {
              'keywords': trim(keywordList[i]),
              'robotskill': this.skillInfo.info.id,
              'order': this.lastOrder + i + 1
            }
            this.expressWordList.push(keywordItem)
            if (this.expressWordList.length > this.keywordMax) {
              this.$message({
                type: 'error',
                message: `最多添加${this.keywordMax}个关键词，添加失败。`
              })
              this.expressWordList = oldKeywords
              return
            }
          }
        }
        this.keywordInput = ''
      }
    },
    submit () {
      this.btnLoading = true
      let addList = this.expressWordList.filter((item) => {
        return !item.id
      })
      this.$http.all([this.delWordList.length > 0 ? this.delExpressKeywords() : '', addList.length > 0 ? this.addExpressKeywords(addList) : ''])
        .then(() => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.btnLoading = false
          this.$router.push('/skill/list')
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '保存失败，请重试'
          })
          this.btnLoading = false
        })
    },
    addExpressKeywords (addList) {
      return this.$api.skill.addExpressWordList(this.skillId, addList)
        .then((data) => {
          this.getExpressInfo()
        })
        .catch(() => {
        })
    },
    delExpressKeywords () {
      let delList = this.delWordList.map((item) => {
        item.is_active = false
        return item
      })
      return this.$api.skill.delExpressWordList(this.skillId, delList)
        .then((data) => {
          this.delWordList = []
        })
        .catch(() => {
        })
    }
  },
  watch: {}
}
</script>

<style scoped lang="scss">
  @import '@/style/variate.scss';
  .is-module-content{
    margin-bottom: 56px;
    .label{
      margin-bottom: 28px;
    }
  }
  .keyword-list{
    margin-bottom: 0px;
    .keyword-item{
      margin-right: 20px;
      margin-bottom: 20px;
    }
  }
  .add-keyword{
    .add-keyword-input{
      width: 600px;
    }
  }

  .error-box{
    margin-left: 15px;
    position: relative;
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
</style>
