/**
* desc: 个人中心-账号信息
* */
<template>
  <div class="is-content-block" style="padding-left: 50px;">
    <div class="title">
      <h3 style="font-weight: bold;">
        账号信息
      </h3>
    </div>

    <div class="robot-setting" style="margin-top: 50px;">
      <!--<div class="robot-setting-item">-->
        <!--<div class="robot-setting-item-label font-size-title">-->
          <!--机构名称-->
          <!--<a class="label-link" @click="editCompanyName">修改</a>-->
        <!--</div>-->
        <!--<div class="robot-setting-item-content text-color-minor">-->
          <!--<span>{{userInfo.company || '未命名'}}</span>-->
        <!--</div>-->
      <!--</div>-->
      <div class="robot-setting-item">
        <div class="robot-setting-item-label">
          手机号码
        </div>
        <div class="robot-setting-item-content">
          <span>{{userInfo.mobile}}</span>
          <a class="label-link" @click="editMobile">修改</a>
        </div>
      </div>
      <div class="robot-setting-item">
        <div class="robot-setting-item-label">
          账号类型
        </div>
        <div class="robot-setting-item-content">
          <span>普通管理员</span>
        </div>
      </div>
      <div class="robot-setting-item">
        <div class="robot-setting-item-label">
          邀&nbsp;&nbsp;请&nbsp;&nbsp;码
        </div>
        <div class="robot-setting-item-content">
          <span class="layout-item-content">{{userInfo.mobile}}</span>
          <a class="label-link copyBtn" :data-clipboard-text="userInfo.mobile"> 复制</a>
        </div>
      </div>
      <div class="robot-setting-item">
        <div class="robot-setting-item-label">
          邀请链接
        </div>
        <div class="robot-setting-item-content">
          <span class="layout-item-content">
            {{getInvitationUrl(userInfo.mobile)}}
          </span>
          <a class="copyBtn label-link" :data-clipboard-text="getInvitationUrl(userInfo.mobile)">复制</a>
          <a id="downloadQRCode" class="label-link" href="" download="邀请码" @click="downloadQRCode">生成二维码</a>
        </div>
      </div>
      <div id="qrcode" style="display: none;"></div>
      <div><el-button style="margin-top: 20px;margin-bottom: 50px;" @click.native="showEditPassword=true" size="medium" round>修改密码</el-button></div>
    </div>
    <el-dialog
      :visible="showEditPassword"
      title="修改密码"
      width="400px"
      @close="closeDialog"
      :close-on-click-modal="false"
    >
      <el-form :model="editPassInfo" :rules="editPassInfoRules" ref="editPassInfoForm">
        <el-form-item prop="oldPass">
          <BasicPassword v-model="editPassInfo.oldPass" placeholder="旧密码"></BasicPassword>
        </el-form-item>
        <el-form-item prop="newPass">
          <BasicPassword v-model="editPassInfo.newPass" placeholder="新密码" @keydown.native="trimInputValue"></BasicPassword>
        </el-form-item>
        <el-form-item prop="checkPass">
          <BasicPassword v-model="editPassInfo.checkPass" placeholder="确认新密码" @keydown.native="trimInputValue"></BasicPassword>
        </el-form-item>
        <el-form-item class="edit-password-btn-box">
          <!--<div class="edit-password-error" v-if="errorInfo.isShow">{{errorInfo.title}}</div>-->
          <BasicError class="text-center" :show="errorInfo.isShow" :errorMsg="errorInfo.title"></BasicError>
          <el-button class="edit-password-btn" type="primary" @click.native="submitEditPass" style="width: 100%;">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :visible="editMobileInfo.visible"
      title="修改手机号"
      width="400px"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <el-form :model="editMobileInfo" :rules="editMobileInfo.rules" ref="editMobileForm">
        <el-form-item prop="password">
          <BasicPassword v-model="editMobileInfo.password"></BasicPassword>
        </el-form-item>
        <el-form-item prop="mobile">
          <el-input v-model="editMobileInfo.mobile" placeholder="请输入新手机号" @keydown.native="trimInputValue"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="editMobileInfo.code" placeholder="请输入短信验证码" @keydown.native="trimInputValue"></el-input>
          <div class="send-code-box">
            <a class="send-code font-size-smaller" @click="sendPhoneCode" v-if="!editMobileInfo.sendMsgInfo.isSend">发送验证码</a>
            <span v-else>{{`已发送(${editMobileInfo.sendMsgInfo.time}秒)`}}</span>
          </div>
        </el-form-item>
        <el-form-item class="edit-password-btn-box" style="padding-top: 15px;">
          <!--<div class="edit-password-error" v-if="errorInfo.isShow">{{errorInfo.title}}</div>-->
          <BasicError class="text-center" :show="errorInfo.isShow" :errorMsg="errorInfo.title"></BasicError>
          <el-button class="edit-password-btn" type="primary" @click.native="submitEditMobile" style="width: 100%;">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import ClipboardJS from 'clipboard'
import BasicError from '@/components/basicError'
import BasicPassword from '@/components/basicPassword'
import trim from 'lodash/trim'
import { mapGetters, mapActions } from 'vuex'
import QRCode from 'qrcodejs2'
import { validateMobile } from '../../utils/validate'
import { trimInputValue } from '../../utils/input'
export default {
  components: {
    BasicError,
    BasicPassword
  },
  data () {
    var validateEditPass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.editPassInfo.newPass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      pageUserInfo: {},
      showEditPassword: false,
      editMobileInfo: {
        visible: false,
        password: '',
        mobile: '',
        code: '',
        sendMsgInfo: {
          isSend: false,
          time: 60
        },
        rules: {
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          mobile: [
            { validator: validateMobile, trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请输入手机验证码', trigger: 'change' }
          ]
        }
      },
      editPassInfo: {
        oldPass: '',
        newPass: '',
        checkPass: ''
      },
      editPassInfoRules: {
        oldPass: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        newPass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 20, message: '密码长度在8到20个字符', trigger: 'blur' }
        ],
        checkPass: [
          { validator: validateEditPass2, trigger: 'blur' }
        ]
      },
      errorInfo: {
        title: '账号密码错误',
        isShow: false
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created () {
  },
  mounted () {
    this.createCopy()
    this.createQRCode()
  },
  methods: {
    ...mapActions([
      'SetUserinfo'
    ]),
    trimInputValue,
    createQRCode () {
      this.qrcode = new QRCode(document.getElementById('qrcode'), {
        text: this.getInvitationUrl(this.userInfo.mobile),
        width: 256,
        height: 256,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      })
      let qrcodeEl = document.getElementById('qrcode')
      let canvasEl = qrcodeEl.getElementsByTagName('canvas')[0]
      let downloadQRCode = document.getElementById('downloadQRCode')
      downloadQRCode.href = canvasEl.toDataURL('image/jpeg')
    },
    downloadQRCode () {
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
    submitEditPass () {
      this.$refs.editPassInfoForm.validate((data) => {
        if (data) {
          this.$api.user.changepassword(this.editPassInfo.oldPass, this.editPassInfo.newPass)
            .then((data) => {
              this.$message({
                type: 'success',
                message: '修改密码成功'
              })
              this.showEditPassword = false
            })
            .catch((e) => {
              this.$message({
                type: 'error',
                message: e || '修改密码失败'
              })
            })
        } else {
          return false
        }
      })
    },
    editCompanyName () {
      this.$prompt('', '修改机构名称', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputErrorMessage: '最多支持64个字符',
        inputPlaceholder: '请输入机构名称',
        inputValidator (value) {
          let temp = trim(value)
          if (temp && temp.length > 0 && temp.length <= 64) {
            return true
          } else {
            return false
          }
        }
      }).then(({value}) => {
        let temp = trim(value)
        let params = { id: this.userInfo.id, company: temp }
        this.$api.user.updateUserInfo(params)
          .then((data) => {
            this.SetUserinfo(data)
            window.localStorage.setItem('userInfo', data)
          })
      })
    },
    getInvitationUrl (mobile) {
      return `${window.location.origin}/login/${mobile}`
    },
    editMobile () {
      this.editMobileInfo.visible = true
    },
    sendPhoneCode () {
      this.$refs.editMobileForm.validateField('mobile', (data) => {
        if (!data) {
          this.$api.user.smscode(this.editMobileInfo.mobile)
            .then(() => {
              this.$message({
                type: 'success',
                message: '发送成功'
              })
              this.editMobileInfo.sendMsgInfo.isSend = true
              this.editMobileInfo.sendMsgInfo.time = 60
              let timer = setInterval(() => {
                this.editMobileInfo.sendMsgInfo.time -= 1
                if (this.editMobileInfo.sendMsgInfo.time === 0) {
                  this.editMobileInfo.sendMsgInfo.isSend = false

                  clearInterval(timer)
                }
              }, 1000)
            })
            .catch((e) => {
              this.$message.error({
                message: e || '发送失败，请重试'
              })
            })
        }
      })
    },
    submitEditMobile () {
      this.$refs.editMobileForm.validate((data) => {
        if (data) {
          let params = {
            sms_code: this.editMobileInfo.code,
            mobile: this.editMobileInfo.mobile,
            password: this.editMobileInfo.password
          }
          this.$api.user.updateMobile(params)
            .then(() => {
              this.$message({
                type: 'success',
                message: '修改手机号码成功,请重新登入！'
              })
              this.editMobileInfo.visible = false
              window.authUser()
            })
            .catch(() => {
              this.$message({
                type: 'success',
                message: '修改失败，请重试'
              })
            })
        }
      })
    },
    closeDialog () {
      this.$refs.editPassInfoForm && this.$refs.editPassInfoForm.resetFields()
      this.$refs.editMobileForm && this.$refs.editMobileForm.resetFields()
      this.editMobileInfo.visible = false
      this.showEditPassword = false
    }
  },
  watch: {}
}
</script>

<style scoped lang="scss">
  .robot-setting{
    .robot-setting-item{
      margin-bottom: 30px;
      display: flex;
      .robot-setting-item-label{
        width: 100px;
        margin-bottom: 20px;
      }
      .robot-setting-item-content{
        padding-left: 0px;
        .label-link{
          margin-left: 10px;
        }
      }
    }
  }
  .send-code-box{
    position: absolute;
    right: 0;
    bottom: -30px;
    text-align: right;
    .send-code{
    }
  }

</style>
