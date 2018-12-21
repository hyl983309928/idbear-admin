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
            v-for="(tagItem, index) in keywordList"
            :closable="true"
            :disable-transitions="false"
            @close="handleClose(index)">
            {{tagItem.human_keywords}}
          </el-tag>
        </div>
        <div class="add-keyword font-size-zero">
          <el-input v-model="keywordInput" @keydown.enter.native="addKeyword" class="add-keyword-input" placeholder="请输入关键词，多个词用逗号分开" size="medium" style="width: 450px"></el-input>
          <el-button @click.native="addKeyword" class="add-keyword-btn" type="primary" size="medium" style="margin-left: 20px;">添加</el-button>
        </div>
      </div>
      <div class="is-module-content" style="max-width: 500px;">
        <div class="label">触发回复</div>
        <BasicAnswer
          @on-change="changeAnswer"
          :answerInfo="answerInfo"
          :showMaterial="false"
        >
        </BasicAnswer>
      </div>
      <!--<div class="is-module-content">-->
        <!--<div class="label">关键图片</div>-->
        <!--<div class="img-list">-->
          <!--<CropperImage :isCropper="false" v-model="humanImg" @upload-success="handleChangeImg" @on-delete="handleChangeImg">-->
            <!--&lt;!&ndash;<div class="plus-icon-box border-radius-4" style="margin-right: 20px;">&ndash;&gt;-->
            <!--&lt;!&ndash;<i class="el-icon-plus plue-icon"></i>&ndash;&gt;-->
            <!--&lt;!&ndash;</div>&ndash;&gt;-->
          <!--</CropperImage>-->
          <!--&lt;!&ndash;<div class="img-item" v-for="(item, index) in chatbotconfig.human_img" :key="index">&ndash;&gt;-->
          <!--&lt;!&ndash;<i @click="handleDelImg(index)" class="iconfont icon-shanchu img-delete-icon"></i>&ndash;&gt;-->
          <!--&lt;!&ndash;<img :src="item" />&ndash;&gt;-->
          <!--&lt;!&ndash;</div>&ndash;&gt;-->
        <!--</div>-->
      <!--</div>-->
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
import { checkRobotListExist, getRobotList } from '@/lib/modules/user'
import { industryInfoMap } from '../../lib/config'
import BasicAnswer from '@/components/basicAnswer'
export default {
  components: {
    HelpQueryIcon,
    BasicError,
    CropperImage,
    BasicAnswer
  },
  data () {
    return {
      colorCompany,
      skillId: 2,
      skillInfo: {},
      keywordList: [],
      oldHumanImg: '',
      humanImg: '',
      changeImg: false, // 是否修改过图片
      delList: [],
      keywordMax: 100,
      keywordInput: '',
      btnLoading: false,
      lastOrder: 0,
      answerInfo: {
        text_answer: '',
        img_answer: [{
          url: '',
          wx_url: '',
          media_id: ''
        }]
      }
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
      this.skillInfo = skillMap[2]
      this.getAnswerInfo()
      this.getSkillItem()
      this.getArtificialInfo()
    },
    getAnswerInfo () {
      getRobotList(true)
        .then(() => {
          if (this.nowRobotInfo.service_rely) {
            let parseObj = JSON.parse(this.nowRobotInfo.service_rely)
            if (parseObj.text_answer) {
              this.answerInfo.text_answer = parseObj.text_answer
            }
            if (parseObj.img_answer) {
              this.answerInfo.img_answer = parseObj.img_answer
            }
          }
        })
    },
    getSkillItem () {
      this.$api.skill.getSkillItem(this.skillId)
        .then((data) => {
          this.skillInfo.info = data
        })
    },
    getArtificialInfo () {
      this.$api.skill.getArtificialInfo(this.skillId)
        .then((data) => {
          this.keywordList = data.filter(item => !item.img)
          let imgList = data.filter(item => item.img)
          this.oldHumanImg = imgList[0] || ''
          this.humanImg = imgList[0] ? imgList[0].img : ''
          this.lastOrder = data.length > 0 ? data[data.length - 1].order : 1
        })
    },
    handleClose (index) {
      let delList = this.keywordList.splice(index, 1)
      this.delList.push(delList[0])
    },
    handleChangeImg () {
      if (this.oldHumanImg) {
        this.delList.push(this.oldHumanImg)
      }
    },
    addKeyword () {
      let oldKeywords = this.keywordList.concat([])
      if (this.keywordInput) {
        let keywordList = this.keywordInput.split(/,|，/)
        for (let i = 0, length = keywordList.length; i < length; i++) {
          if (keywordList[i] && !this.keywordList.find((x) => { return x.human_keywords === trim(keywordList[i]) })) {
            let keywordItem = {
              'human_keywords': trim(keywordList[i]),
              'robotskill': this.skillInfo.info.id,
              'order': this.lastOrder + i + 1
            }
            this.keywordList.push(keywordItem)
            if (this.keywordList.length > this.keywordMax) {
              this.$message({
                type: 'error',
                message: `最多添加${this.keywordMax}个关键词，添加失败。`
              })
              this.keywordList = oldKeywords
              return
            }
          }
        }
        this.keywordInput = ''
      }
    },
    submit () {
      this.btnLoading = true
      let addList = this.keywordList.filter((item) => {
        return !item.id
      })
      if (this.humanImg && this.humanImg !== this.oldHumanImg.img) {
        addList.push({img: this.humanImg, 'robotskill': this.skillInfo.info.id})
      }
      this.$http.all([this.delList.length > 0 ? this.delArtificialKeywords() : '', addList.length > 0 ? this.addArtificialKeywords(addList) : '', this.updateRobotInfo()])
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
    addArtificialKeywords (addList) {
      return this.$api.skill.addArtificialKeywords(this.skillId, addList)
        .then((data) => {
          this.getArtificialInfo()
        })
    },
    delArtificialKeywords () {
      let delList = this.delList.map((item) => {
        item.is_active = false
        return item
      })
      let keywordList = delList.filter(item => !item.img)
      let imgList = delList.filter(item => item.img)
      let delData = {
        'keywords': keywordList,
        'img': imgList[0] || ''
      }
      return this.$api.skill.delArtificialKeywords(this.skillId, delData)
        .then((data) => {
          this.delList = []
        })
    },
    updateRobotInfo (type = 'add') {
      let params = {
        id: this.nowRobotInfo.id,
        service_rely: JSON.stringify(this.answerInfo)
      }
      return this.$api.setting.updateRobotInfo(params)
        .then((data) => {
          this.$message({
            type: 'success',
            message: type === 'add' ? '添加成功' : type === 'del' ? '删除成功' : '修改成功'
          })
          getRobotList(true)
        })
    },
    updatechatbotconfig (type = 'add') {
    },
    handleUploadSuccess (url) {
      this.chatbotconfig.human_img.push(url)
    },
    handleDelImg (index) {
      this.$confirm('是否确认删除该照片, 是否继续?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.chatbotconfig.human_img.splice(0, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {})
    },
    changeAnswer (obj) {
      this.answerInfo = obj
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

  .img-list{
    .img-item{
      display: inline-block;
      height: 100px;
      margin-right: 10px;
      position: relative;
      .img-delete-icon{
        cursor: pointer;
        font-size: 14px;
        position: absolute;
        right: 6px;
        top: 6px;
        &:hover{
          color: #999;
        }
      }
      img{
        height: 100%;
      }
    }
  }
</style>
