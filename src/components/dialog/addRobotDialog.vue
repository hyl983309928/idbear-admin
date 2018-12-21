<template>
<div>
  <el-dialog
    :visible="showAddRobotDialog"
    width="650px"
    top="10vh"
    :title="addRobotInfo.title"
    :close-on-click-modal="false"
    @close="closeDialog"
    @open="initData"
    custom-class="dialog-add-robot"
  >
    <div slot="title">
      <div class="add-robot-title text-color-primary">{{addRobotInfo.title}}</div>
    </div>
    <div class="add-robot-dialog">
      <!--<div class="step-box">-->
        <!--<div class="steps">-->
          <!--<div class="step">-->
            <!--<div class="step-content" :class="{'step-content-success': addRobotInfo.active >= 1}">-->
              <!--<div class="step-content-index">1</div>-->
              <!--<div class="step-content-text">选择行业</div>-->
            <!--</div>-->
            <!--<div class="step-line" :class="{'step-line-success': addRobotInfo.active >= 2}"></div>-->
          <!--</div>-->
          <!--<div class="step">-->
            <!--<div class="step-content" :class="{'step-content-success': addRobotInfo.active >= 2}">-->
              <!--<div class="step-content-index">2</div>-->
              <!--<div class="step-content-text">绑定微信公众号</div>-->
            <!--</div>-->
            <!--<div class="step-line" :class="{'step-line-success': addRobotInfo.active >= 3}"></div>-->
          <!--</div>-->
          <!--<div class="step">-->
            <!--<div class="step-content" :class="{'step-content-success': addRobotInfo.active >= 3}">-->
              <!--<div class="step-content-index">3</div>-->
              <!--<div class="step-content-text">完成</div>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
      <div class="add-robot-main">
        <div class="add-robot-main-type" v-if="addRobotInfo.active == 1">
          <div class="add-robot-main-type-label">
            请选择TA所应用的行业
          </div>
          <div class="add-robot-main-type-pick">
            <div class="add-robot-main-type-pick-box">
              <div @click="handleIndustry(item.value)" class="add-robot-main-type-pick-item" :class="{'pick-item_active': addRobotInfo.industry == item.value}" v-for="(item) in industryList" :key="item.value">
                {{item.label}}
              </div>
            </div>
            <!--<div class="add-robot-main-type-pick-text">-->
            <!--<input class="el-input__inner" v-model="addRobotInfo.otherText" placeholder="其他：请输入行业名称" />-->
            <!--</div>-->
          </div>
          <div class="add-robot-footer">
            <el-button
              :disabled="!addRobotInfo.industry"
              @click="handleAddRobot"
              type="primary"
              class="btn-next"
              size="medium"
              :loading="addRobotInfo.loading"
            >
              立即创建
            </el-button>
          </div>
        </div>

        <div class="add-robot-main-wechat" v-if="addRobotInfo.active == 2">
          <div class="add-robot-main-wechat-icon">
            <i class="iconfont icon-xiaoshi"></i>
          </div>
          <div class="add-robot-main-wechat-desc font-size-h3">绑定公众号，实现7x24H在线智能客服</div>
          <div class="add-robot-main-wechat-btns">
            <el-button class="wechat-btn" size="medium" type="primary" @click.native="authWechat" style="margin-right: 20px;">立即绑定</el-button>
            <el-button class="wechat-btn text-color-minor" size="medium" @click.native="setShowAddRobotDialog(false)">以后再说</el-button>
          </div>
        <!--<el-row type="flex" align="middle">-->
          <!--<el-col :span="14" style="height: 100%;">-->
            <!--<div class="wechat-content">-->
              <!--<div class="wechat-content-label">-->
                <!--绑定后即可启用公众号的智能化服务！<br /><br />-->
                <!--大约5-10分钟公众号便可以<a>支持闲聊</a>和号内<a>文章语音搜索</a>啦！-->
              <!--</div>-->
              <!--<div class="wechat-content-btns">-->
                <!--<el-button class="wechat-btn" size="medium" type="primary" @click.native="authWechat">去授权</el-button>-->
                <!--<el-button class="wechat-btn" size="medium" type="success" @click.native="checkWechatAuth">我已授权</el-button>-->
                <!--<el-button class="wechat-btn text-color-minor" size="medium" @click.native="addRobotInfo.active = 3">以后再说</el-button>-->
              <!--</div>-->
            <!--</div>-->
          <!--</el-col>-->
          <!--<el-col :span="10">-->
            <!--<div class="wechat-preview">-->
              <!--<img src="http://storage.id-bear.com/2/Fgpl-5Ql-TcKzpRiu7yazskUn61v2.png" />-->
            <!--</div>-->
          <!--</el-col>-->
        <!--</el-row>-->
        </div>
        <div class="add-robot-main-success" v-if="addRobotInfo.active == 3">
          <div class="success-label">
            AI机器人也可以添加到公众号主菜单或者店铺主页及主菜单哦
          </div>
          <el-row class="help-items">
            <el-col :span="8" v-for="item in helpDocument" :key="item.type">
              <div class="help-item">
                <img :src="item.imgUrl" />
                <div>{{item.title}}</div>
              </div>
            </el-col>
          </el-row>
          <div class="success-btns">
            <el-button class="wechat-btn" size="medium" type="primary" @click.native="addWechatMenu">立即添加</el-button>
            <el-button class="wechat-btn text-color-minor" size="medium" @click.native="setShowAddRobotDialog(false)">以后设置</el-button>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</div>
</template>

<script>
import { industryList } from '../../lib/config'
import { mapGetters, mapActions } from 'vuex'
import { getRobotList } from '../../lib/modules/user'
import { helpDocument } from '@/lib/config/help'
import mixin from '@/mixins'
export default {
  components: {},
  mixins: [mixin],
  data () {
    return {
      helpDocument,
      industryList: industryList.filter((item) => { return item.value === '1' || item.value === '4' }),
      addRobotInfo: {
        active: 1,
        title: '创建机器人',
        industry: '',
        loading: false
      }
    }
  },
  computed: {
    ...mapGetters([
      'showAddRobotDialog',
      'activeRobot',
      'robotList',
      'nowRobot'
    ]),
    activeRobotInfo () {
      let item = this.robotList.find(item => item.id === this.activeRobot)
      return item || {}
    }
  },
  created () {},
  methods: {
    ...mapActions([
      'setShowAddRobotDialog',
      'setActiveRobot',
      'setNowRobot'
    ]),
    initData () {
      this.addRobotInfo = {
        active: 1,
        title: '创建机器人',
        industry: '',
        loading: false
      }
    },
    closeDialog () {
      this.setShowAddRobotDialog(false)
      this.initData()
    },
    handleIndustry (key) {
      this.addRobotInfo.industry = key
    },
    handleAddRobot () {
      if (this.addRobotInfo.active === 1) {
        let params = {
          industry: this.addRobotInfo.industry
        }
        this.addRobotInfo.loading = true
        this.$api.user.createRobot(params)
          .then((data) => {
            this.setActiveRobot(data.id)
            this.addRobotInfo.title = '绑定公众号'
            this.addRobotInfo.active = 2
            this.addRobotInfo.loading = false
            getRobotList(true)
              .then(() => {
                this.$bus.$emit('add-robot-success')
              })
          })
          .catch(() => {
            this.addRobotInfo.loading = false
            this.$message({
              type: 'error',
              message: '创建失败，请重试'
            })
          })
      }
    },
    checkWechatAuth () {
      getRobotList(true)
        .then((data) => {
          if (this.activeRobotInfo.wechataccount.length > 0) {
            this.$message({
              message: '绑定公众号成功',
              type: 'success'
            })
            this.addRobotInfo.active = 3
          } else {
            this.$message({
              message: '未绑定公众号，请绑定后点击。',
              type: 'error'
            })
          }
        })
    },
    addWechatMenu () {
      this.setShowAddRobotDialog(false)
      if (this.activeRobot === this.nowRobot) {
        this.goto('/setting/index')
      } else {
        this.setNowRobot(this.activeRobotInfo)
        this.goto('/setting/index', { type: 'robot', reload: 1 })
      }
    }
  },
  watch: {}
}
</script>

<style scoped lang="scss">
  @import "@/style/variate.scss";
  @import "@/style/global.scss";
  .add-robot-title{
    font-size: 16px;
  }
  .add-robot-dialog{
    text-align: center;
    .add-robot-main{
      min-height: 285px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .add-robot-main-type{
        text-align: center;
        .add-robot-main-type-label{
          font-size: 16px;
        }
        .add-robot-main-type-pick{
          margin-top: 30px;
          .add-robot-main-type-pick-box{
            .add-robot-main-type-pick-item{
              @extend .cursor-pointer;
              display: inline-block;
              padding: 10px 20px;
              line-height: 1;
              color: $blue;
              font-size: 14px;
              border-radius: 18px;
              text-align: center;
              border: 1px solid $blue;
              margin-right: 20px;
              &:hover{
                background: $blue;
                color: #fff;
              }
              &:last-child{
                margin-right: 0px;
              }
            }
            .pick-item_active{
              background: $blue;
              color: #fff;
            }
          }
          .add-robot-main-type-pick-text{
            margin-top: 30px;
            .el-input__inner{
              width: 480px;
              outline: none;
              border-radius: 0;
              border: none;
              border-bottom: 1px solid #999;
              font-size: 18px;
            }
          }
        }
      }

      .add-robot-main-wechat{
        width: 100%;
        .add-robot-main-wechat-icon{
          margin-bottom: 20px;
          .icon-xiaoshi{
            font-size: 98px;
            color: #C0C4CC;
          }
        }
        .add-robot-main-wechat-desc{
          margin-bottom: 50px;
        }
        .add-robot-main-wechat-btns{}
      }

      .add-robot-main-success{
        width: 100%;
        height: 100%;
        .success-label{
          text-align: center;
          font-size: 16px;
          margin-bottom: 40px;
        }
        .help-items{
          margin-bottom: 40px;
        }
        .help-item{
          text-align: center;
          img{
            width: 280px;
            margin-bottom: 15px;
          }
        }
      }
    }
    .add-robot-footer{
      margin-top: 60px;
      text-align: center;
    }
  }
</style>
