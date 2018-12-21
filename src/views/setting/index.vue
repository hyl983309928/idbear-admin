<template>
<div style="line-height: 1;">
  <div class="robot-info-box box-shadow">
    <div class="robot-info-head">
      <div class="robot-info-head-img-box">
        <CropperImage @upload-success="robotAvatarSuccess">
          <img class="robot-info-head-img cursor-pointer hover-scale" :src="nowRobotInfo.avatar ? nowRobotInfo.avatar : '/static/imgs/logo.jpg'" />
        </CropperImage>
      </div>
      <div @click="updateRobotTitle" class="robot-info-head-name cursor-pointer hover-scale">{{nowRobotInfo.title}}</div>
    </div>
    <div class="robot-info-minor">
      <div class="robot-info-minor-item">
        <div class="robot-info-minor-item-label">
          智商：
        </div>
        <div class="robot-info-minor-item-value">
          {{parseInt(nowRobotInfo.iq)}}
        </div>
      </div>
      <div class="robot-info-minor-item">
        <div class="robot-info-minor-item-label">
          行业：
        </div>
        <div class="robot-info-minor-item-value">
          {{industryMap[nowRobotInfo.industry]}}
        </div>
      </div>
      <div class="robot-info-minor-item">
        <div class="robot-info-minor-item-label">
          版本：
        </div>
        <div class="robot-info-minor-item-value">
          {{versionMap[nowRobotInfo.version]}}
          <span @click="showActivateService" class="robot-info-minor-item-value-link cursor-pointer text-decoration-underline">升级/续费</span>
        </div>
      </div>
    </div>
  </div>
  <el-row :gutter="20">
    <el-col :span="8">
      <div class="setting-bind-help box-shadow bg-white">
        <div class="setting-bind-help-item">
          <div class="setting-bind-help-item-label">接入微信公众号</div>
          <div class="setting-bind-help-item-content">
            <template v-if="nowRobotInfo.wechataccount && nowRobotInfo.wechataccount[0]">
              <div style="display: flex;align-items: center;">
                <img src="/static/imgs/wechat.png" style="width: 36px;height: 36px;" />
                <span style="margin-left: 15px;">{{nowRobotInfo.wechataccount[0].nick_name}}</span>
                <a style="margin-left: 60px;" @click="cancelWechatAuth()">解除绑定</a>
              </div>
            </template>
            <el-button @click.native="bindWechat" type="primary" size="medium" v-else>绑定公众号</el-button>
          </div>
        </div>
        <div class="setting-bind-help-item">
          <div class="setting-bind-help-item-label">接入微信公众号菜单</div>
          <div class="setting-bind-help-item-content">
            <el-button class="copyBtn" type="primary" size="medium" :data-clipboard-text="getH5Url()">复制H5机器人链接</el-button>
            <a href="https://www.kancloud.cn/xxm2430/xmm_dec/802612" target="_blank" class="help-item-link">查看接入方法</a>
          </div>
        </div>
        <div class="setting-bind-help-item">
          <div class="setting-bind-help-item-label">接入有赞店铺</div>
          <div class="setting-bind-help-item-content">
            <el-button class="copyBtn" type="primary" size="medium" :data-clipboard-text="getH5Url()">复制H5机器人链接</el-button>
            <a href="https://www.kancloud.cn/xxm2430/xmm_dec/802613" target="_blank" class="help-item-link">查看接入方法</a>
          </div>
        </div>
        <div class="setting-bind-help-item">
          <div class="setting-bind-help-item-label">接入有赞店铺浮标</div>
          <div class="setting-bind-help-item-content">
            <el-button class="copyBtn" type="primary" size="medium" :data-clipboard-text="getH5Url()">复制H5机器人链接</el-button>
            <a href="https://www.kancloud.cn/xxm2430/xmm_dec/802614" target="_blank" class="help-item-link">查看接入方法</a>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="16">
      <div class="setting-robot-particularly box-shadow bg-white">
        <div class="particularly-title">个性化设置</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="particularly-setting">
              <div class="particularly-setting-item">
                <div class="particularly-setting-label">机器人简介</div>
                <div class="particularly-setting-content">
                  <el-input v-model="robotInfo.content" @blur="updateRobotContent" type="textarea" placeholder="请填写你们的主营业务，新用户首次关注会了解TA能通过机器人做些什么" :rows="6" resize="none" class="font-size-smaller" style="width: 100%;"></el-input>
                </div>
              </div>
              <div class="particularly-setting-item">
                <div class="particularly-setting-label">快捷标签</div>
                <div class="particularly-setting-content">
                  <div class="h5-label-setting">
                    <el-input size="mini" class="h5-label-setting-input" v-for="(item, index) in h5LabelList" :key="index" v-model="item.label" disabled />
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="particularly-setting-preview">
              <div class="preview-item">
                <img class="box-shadow" src="http://storage.id-bear.com/21/FidYxN6Ti0KX8xcwoffb_beloU7A2.png" />
              </div>
              <div class="preview-item">
                <img class="box-shadow" src="http://storage.id-bear.com/21/FsaURMAIlN4PMmyWrXdtwN24HdPS1.png" />
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>
</div>
</template>

<script>
import mixin from '@/mixins'
import CropperImage from '@/components/cropperImage'
import { mapGetters } from 'vuex'
import { checkRobotListExist, getRobotList } from '@/lib/modules/user'
import { versionMap, industryMap } from '../../lib/config'
import ClipboardJS from 'clipboard'
export default {
  components: {
    CropperImage
  },
  mixins: [mixin],
  data () {
    return {
      versionMap,
      industryMap,
      // advancedPreview: [
      //   {
      //     label: '案例：最多显示2条结果',
      //     imgUrl: 'http://storage.id-bear.com/2/Fgpl-5Ql-TcKzpRiu7yazskUn61v2.png'
      //   },
      //   {
      //     label: '案例：最多显示3条结果',
      //     imgUrl: 'http://storage.id-bear.com/2/FjMq2dgb0YTKholVWzuqrQMmR1mp3.png'
      //   },
      //   {
      //     label: '案例：最多显示4条结果',
      //     imgUrl: 'http://storage.id-bear.com/2/FgPOX0c_14TsU1mQNYOSG27Rqyix4.png'
      //   }
      // ],
      h5LabelList: [{ label: '什么时候开盘啊' }, { label: '有什么好户型啊' }, { label: '多少钱一平米啊' }, { label: '附近交通怎么样' }, { label: '小区环境怎么样' }],
      robotInfo: {}
    }
  },
  computed: {
    ...mapGetters(['nowRobotInfo', 'nowRobot'])
  },
  created () {
    // if (this.$route.query.reload) {
    //   window.location.href = window.location.href.replace('reload=1', '')
    //   window.location.reload()
    // }
    checkRobotListExist(this.init)
  },
  mounted () {
    this.createCopy()
  },
  methods: {
    init () {
      let temp = JSON.parse(JSON.stringify(this.nowRobotInfo))
      temp.editTitle = false
      this.robotInfo = temp
    },
    createCopy () {
      let clipboard = new ClipboardJS('.copyBtn')
      clipboard.on('success', (e) => {
        this.$message({
          message: '复制成功',
          type: 'success'
        })
      })
    },
    robotAvatarSuccess (url) {
      this.nowRobotInfo.avatar = url
      this.updateRobotInfo()
    },
    updateRobotTitle () {
      this.$prompt('', '修改机器人信息', {
        confirmButtonText: '确定',
        inputPlaceholder: '请输入机器人姓名',
        inputValue: this.nowRobotInfo.title,
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.nowRobotInfo.title = value
        this.updateRobotInfo()
      }).catch(() => {})
    },
    updateRobotInfo () {
      let params = {
        id: this.nowRobotInfo.id,
        title: this.nowRobotInfo.title,
        avatar: this.nowRobotInfo.avatar
      }
      this.handleUpdateRobot(params)
    },
    updateRobotContent () {
      if (this.robotInfo.content === this.nowRobotInfo.content) {
        return
      }
      let params = {
        id: this.nowRobotInfo.id,
        content: this.robotInfo.content
      }
      this.handleUpdateRobot(params)
    },
    updateRobotReplyCount (count) {
      if (this.robotInfo.reply_count === count) {
        return
      }
      this.robotInfo.reply_count = count
      let params = {
        id: this.robotInfo.id,
        reply_count: count
      }
      this.handleUpdateRobot(params)
    },
    handleUpdateRobot (params) {
      this.$api.setting.updateRobotInfo(params)
        .then((data) => {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          getRobotList(true)
        })
    },
    editRobotTitle () {
      this.robotInfo.editTitle = true
      this.$nextTick(() => {
        this.$refs.titleInput.focus()
      })
    }
  },
  watch: {}
}
</script>

<style scoped lang="scss">
@import '@/style/variate.scss';
.robot-info-box{
  background: url("/static/imgs/settingbg.jpg") #fff no-repeat center;
  background-size: cover;
  width: 100%;
  height: 200px;
  display: flex;
  padding-left: 30%;
  color: #C0C4CC;
  margin-bottom: 20px;
  .robot-info-head{
    background: url("/static/imgs/settinguserbg.png") no-repeat center;
    margin-right: 70px;
    width: 220px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .robot-info-head-img-box{
      width: 60px;
      height: 60px;
      border-radius: 50% 50%;
      margin-bottom: 10px;
      .robot-info-head-img{
        width: 60px;
        height: 60px;
        border-radius: 50% 50%;
      }
    }
  }
  .robot-info-minor{
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    .robot-info-minor-item{
      display: flex;
      margin-bottom: 20px;
      &:last-child{
        margin-bottom: 0;
      }
      .robot-info-minor-item-label{
      }
      .robot-info-minor-item-value{
        margin-left: 5px;
        .robot-info-minor-item-value-link{
          margin-left: 20px;
        }
      }
    }
  }
}
.setting-bind-help{
  padding: 0 20px;
  .setting-bind-help-item{
    padding: 28px 0;
    border-bottom: 1px solid #DCDFE6;
    &:last-child{
      border-bottom: 1px solid #fff;
    }
    .setting-bind-help-item-label{
      font-size: $font-size-h3;
      color: $text-primary;
      margin-bottom: 20px;
    }
    .setting-bind-help-item-content{
      .help-item-link{
        margin-left: 20px;
      }
    }
  }
}

  .setting-robot-particularly{
    padding: 28px 20px;
    .particularly-title{
      color: $text-primary;
      font-size: $font-size-h3;
      line-height: 1;
      margin-bottom: 20px;
    }
    .particularly-setting{
      .particularly-setting-item{
        margin-bottom: 35px;
        &:last-child{
          margin-bottom: 0;
        }
        .particularly-setting-label{
          margin-bottom: 20px;
        }
        .particularly-setting-content{}
      }
      .h5-label-setting{
        .h5-label-setting-input{
          margin-bottom: 15px;
          &:last-child{
            margin-bottom: 0;
          }
        }
      }
    }

    .particularly-setting-preview{
      height: 100%;
      display: flex;
      .preview-item{
        width: 50%;
        max-width: 226px;
        display: inline-block;
        margin-right: 20px;
        &:last-child{
          margin-right: 0;
        }
        img{
          width: 100%;
          max-width: 226px;
        }
      }
    }
  }
</style>
