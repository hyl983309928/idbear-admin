/**
* desc: 登入页面
* */+
<template>
<div>
  <div class="login-container" style="background-color: #090424;margin: 0px;overflow: hidden;position: absolute;top: 0;bottom: 0;width: 100%;">
    <div class="copyright-box">© 2013-2018 id-bear 谷熊科技有限公司 粤ICP备13080041 </div>
  <div id="canvascontainer" ref='can'></div>
  <div class="content-dialog box-shadow">
    <div class="login-register" v-show="!showFindPassword">
      <div class="content-dialog-tabs">
        <div class="content-dialog-tabs-item" :class="{'is-active': !showRegister}" style="margin-right: 30px;" @click="showRegister = false">登录</div>
        <div class="content-dialog-tabs-item" :class="{'is-active': showRegister}" @click="showRegister = true">注册</div>
      </div>
      <div class="login-box" v-show="!showRegister">
        <el-form :model="formValue" :rules="rules" ref="loginForm" size="medium">
          <el-form-item prop="phone">
            <el-input v-model="formValue.phone" placeholder="您的手机号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <BasicPassword v-model="formValue.password" placeholder="请输入8-20位密码" @keydown.native.enter="signIn"></BasicPassword>
          </el-form-item>
          <el-form-item class="login-btn-box">
            <BasicError :show="errorInfo.isShow" :errorMsg="errorInfo.title"></BasicError>
            <el-button :loading="formValue.loading" class="login-btn" type="primary" @click="signIn">登录</el-button>
            <div class="login-registering-and-forget-password">
              <span class="login-forget-password text-color-minor" @click="showRegister=false;showFindPassword=true;">忘记密码</span>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <div class="register-box" v-show="showRegister">
        <el-form :model="registerInfo" :rules="rulesRegister" ref="registerForm" size="medium">
          <el-form-item prop="mobile">
            <el-input v-model="registerInfo.mobile" placeholder="请输入手机号" @keydown.native="trimInputValue"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-row :gutter="20">
              <el-col :span="13"><el-input v-model="registerInfo.code" placeholder="请输入4位验证码" @keydown.native="trimInputValue"></el-input></el-col>
              <el-col :span="11">
                <el-button class="verification-btn" @click.native="sendMsg" :disabled="sendMsgInfo.isSend">{{sendMsgInfo.isSend?`已发送(${sendMsgInfo.time}秒)`:'获取验证码'}}</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item prop="password">
            <BasicPassword v-model="registerInfo.password" placeholder="请输入8-20位密码" @keydown.native="trimInputValue"></BasicPassword>
            <!--<el-input v-model="registerInfo.password" placeholder="登录密码" @keydown.native="trimInputValue" type="password"></el-input>-->
          </el-form-item>
          <el-form-item>
            <el-input :disabled="isInviteCode" v-model="registerInfo.parent_invite_code" placeholder="邀请码（非必填）" @keydown.native="trimInputValue"></el-input>
          </el-form-item>
          <el-form-item class="register-btn-box">
            <BasicError :show="errorInfo.isShow" :errorMsg="errorInfo.title"></BasicError>
            <el-button :loading="registerInfo.loading" class="register-btn" type="primary" @click="register">注册</el-button>
          </el-form-item>
          <div class="register-desc text-color-minor font-size-smaller">点击“注册”代表同意<a @click="openUrl">《熊小秘用户协议》</a></div>
        </el-form>
      </div>
    </div>

    <div class="find-password" v-show="showFindPassword">
      <div class="find-password-label">找回密码</div>
      <el-form :model="findPasswordInfo" :rules="findPasswordRules" ref="findPasswordForm" size="medium">
        <el-form-item prop="mobile">
          <el-input v-model="findPasswordInfo.mobile" placeholder="您的手机号" @keydown.native="trimInputValue"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-row :gutter="20">
            <el-col :span="13"><el-input v-model="findPasswordInfo.code" placeholder="短信验证码" @keydown.native="trimInputValue"></el-input></el-col>
            <el-col :span="11">
              <el-button class="verification-btn" @click.native="findSendMsg" :disabled="sendMsgInfo.isSend">{{sendMsgInfo.isSend?`已发送(${sendMsgInfo.time}秒)`:'获取验证码'}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="password">
          <BasicPassword v-model="findPasswordInfo.password" placeholder="请输入8-20位密码" @keydown.native="trimInputValue"></BasicPassword>
        </el-form-item>
        <el-form-item class="find-password-btn-box">
          <el-button class="find-password-btn" type="primary" @click="submitEditPassword">确认修改</el-button>
          <el-button class="find-password-btn" @click="showFindPassword=false">返回</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
  </div>
</div>
</template>

<script>
/* eslint-disable */
import { mapActions } from 'vuex'
import { validateMobile } from '@/utils/validate'
import BasicError from '@/components/basicError'
import { clearRobotList } from '../../lib/modules/user'
import BasicPassword from '@/components/basicPassword'
import { trimInputValue } from '../../utils/input'

export default {
  components: {
    BasicError,
    BasicPassword
  },
  data () {
    return {
      checkCode: '',
      showRegister: false,
      showFindPassword: false,
      isInviteCode: false,
      errorInfo: {
        title: '账号密码错误',
        isShow: false
      },
      formValue: {
        phone: '',
        password: '',
        loading: false
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },

      registerInfo: {
        mobile: '',
        password: '',
        code: '',
        parent_invite_code: '',
        loading: false
      },
      rulesRegister: {
        mobile: [
          { validator: validateMobile, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 20, message: '密码长度在8到20个字符', trigger: 'blur'  }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      sendMsgInfo: {
        isSend: false,
        time: 60
      },

      findPasswordInfo: {
        mobile: '',
        code: '',
        password: ''
      },
      findPasswordRules: {
        mobile: [
          { validator: validateMobile, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 20, message: '密码长度在8到20个字符', trigger: 'blur'  }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  created () {
    if (this.$route.params.inviteCode) {
      this.isInviteCode = true
      this.registerInfo.parent_invite_code = this.$route.params.inviteCode
    }
    if (this.$route.query.register) {
      this.showRegister = true
    }
    this.createCode()
    // let num = this.$cookies.get('loginErrorNum')
    // if (Number(num) >= 3) {
    //   this.showCheckCode = true
    // }
  },
  mounted () {
    // 异步加载three
    let script = document.createElement("script")
    script.type = "text/javascript"
    script.onload = script.onreadystatechange = () => {
      if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete" ) {
        script.onload = script.onreadystatechange = null;
        this.initTHREE()
      }
    }
    script.src = "/static/js/three.min.js"
    document.body.appendChild(script)
  },
  methods: {
    ...mapActions([
      'SetToken'
    ]),
    trimInputValue,
    initTHREE () {
      container = document.createElement( 'div' );
      this.$refs.can.appendChild( container );
      camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
      camera.position.z = 1000;
      scene = new THREE.Scene();
      particles = new Array();
      var PI2 = Math.PI * 2;
      var material = new THREE.ParticleCanvasMaterial( {
        color: '#4E96F5',
        program: function ( context ) {
          context.beginPath();
          context.arc( 0, 0, 1, 0, PI2, true );
          context.fill();
        }
      } );
      var i = 0;
      for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
        for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
          particle = particles[ i ++ ] = new THREE.Particle( material );
          particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
          particle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
          scene.add( particle );
        }
      }
      renderer = new THREE.CanvasRenderer();
      renderer.setSize( window.innerWidth, window.innerHeight );
      container.appendChild( renderer.domElement );
      document.addEventListener( 'mousemove', onDocumentMouseMove, false );
      window.addEventListener( 'resize', onWindowResize, false );
      animate();
    },
    openUrl () {
      window.open(window.location.origin + '/static/doc/idbearProtocol.html')
    },
    createCode () {
      let code = ''
      let random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
        'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      for (var i = 0; i < 4; i++) {
        var index = Math.floor(Math.random() * 36)
        code += random[index]
      }
      this.checkCode = code
    },
    signIn () {
      this.$refs.loginForm.validate((validata) => {
        if (validata) {
          this.formValue.loading = true
          this.$api.user.login(this.formValue.phone, this.formValue.password)
            .then((data) => {
              this.formValue.loading = false
              window.localStorage.setItem('token', data.token)
              this.SetToken(data.token)
              this.$cookies.set('loginErrorNum', 0)
              clearRobotList()
              this.$router.push('/')
            })
            .catch((e) => {
              this.formValue.loading = false
              this.$nextTick(() => {
                this.createCode()
                this.errorInfo.title = '登录失败，请检查用户名密码'
                this.errorInfo.isShow = true
              })
            })
        } else {
          this.errorInfo.isShow = false
          return false
        }
      })
    },
    handleShowCheckCode (type) {
      switch (type) {
        case 1:
          let num = this.$cookies.get('loginErrorNum')
          if (Number(num) >= 2) {
            this.showCheckCode = true
          }
          this.$cookies.set('loginErrorNum', num ? Number(num) + 1 : 1, { expires: 1 })
          break
        default:
          break
      }
    },
    register () {
      this.$refs.registerForm.validate((validata) => {
        if (validata) {
          this.registerInfo.username = this.registerInfo.mobile
          this.registerInfo.loading = true
          this.$api.user.reguser(this.registerInfo)
            .then((data) => {
              this.registerInfo.loading = false
              this.$message({
                type: 'success',
                message: '注册成功'
              })
              window.localStorage.setItem('token', data.token)
              this.SetToken(data.token)
              clearRobotList()
              this.$router.push('/')
            })
            .catch((e) => {
              this.registerInfo.loading = false
              this.$nextTick(() => {
                this.errorInfo.title = e || '注册失败'
                this.errorInfo.isShow = true
              })
            })
        } else {
          this.errorInfo.isShow = false
          return false
        }
      })
    },
    findSendMsg () {
      this.$refs.findPasswordForm.validateField('mobile', (data) => {
        if (!data) {
          this.$api.user.smscode(this.findPasswordInfo.mobile, 'reset')
            .then((data) => {
              this.$message({
                type: 'success',
                message: '发送成功'
              })
              this.sendMsgInfo.isSend = true
              this.sendMsgInfo.time = 60
              let timer = setInterval(() => {
                this.sendMsgInfo.time -= 1
                if (this.sendMsgInfo.time === 0) {
                  this.sendMsgInfo.isSend = false

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
    sendMsg () {
      this.$refs.registerForm.validateField('mobile', (data) => {
        if (!data) {
          this.$api.user.smscode(this.registerInfo.mobile)
            .then((data) => {
              this.$message({
                type: 'success',
                message: '发送成功'
              })
              this.sendMsgInfo.isSend = true
              this.sendMsgInfo.time = 60
              let timer = setInterval(() => {
                this.sendMsgInfo.time -= 1
                if (this.sendMsgInfo.time === 0) {
                  this.sendMsgInfo.isSend = false
                  clearInterval(timer)
                }
              }, 1000)
            })
            .catch((e) => {
              this.$message.error({
                message: e || '发送失败'
              })
            })
        }
      })
    },
    submitEditPassword () {
      this.$refs.findPasswordForm.validate((validate) => {
        if (validate) {
          this.$api.user.resetpassword(this.findPasswordInfo.code, this.findPasswordInfo.password, this.findPasswordInfo.mobile)
            .then((data) => {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.showFindPassword = false
            })
            .catch((e) => {
              this.$message({
                type: 'error',
                message: e || '修改失败'
              })
            })
        } else {
          return false
        }
      })
    }
  },
  watch: {
    showRegister (value) {
      this.$refs.registerForm.resetFields()
      this.errorInfo.isShow = false
    },
    showFindPassword (value) {
      this.$refs.findPasswordForm.resetFields()
      this.errorInfo.isShow = false
    },
    formValue: {
      handler: function (val, oldVal) {
        if (this.errorInfo.isShow) {
          this.errorInfo.isShow = false
        }
      },
      deep: true
    },
    registerInfo: {
      handler: function (val, oldVal) {
        if (this.errorInfo.isShow) {
          this.errorInfo.isShow = false
        }
      },
      deep: true
    }
  }
}

var SEPARATION = 100, AMOUNTX = 50, AMOUNTY = 50;
var container;
var camera, scene, renderer;
var particles, particle, count = 0;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function onDocumentMouseMove( event ) {

  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;

}

function onDocumentTouchStart( event ) {

  if ( event.touches.length === 1 ) {

    event.preventDefault();

    mouseX = event.touches[ 0 ].pageX - windowHalfX;
    mouseY = event.touches[ 0 ].pageY - windowHalfY;

  }

}

function onDocumentTouchMove( event ) {

  if ( event.touches.length === 1 ) {

    event.preventDefault();

    mouseX = event.touches[ 0 ].pageX - windowHalfX;
    mouseY = event.touches[ 0 ].pageY - windowHalfY;

  }

}

//

function animate() {

  requestAnimationFrame( animate );

  render();


}

function render() {

  camera.position.x += ( mouseX - camera.position.x ) * .05;
  camera.position.y += ( - mouseY - camera.position.y ) * .05;
  camera.lookAt( scene.position );

  var i = 0;

  for ( var ix = 0; ix < AMOUNTX; ix ++ ) {

    for ( var iy = 0; iy < AMOUNTY; iy ++ ) {

      particle = particles[ i++ ];
      particle.position.y = ( Math.sin( ( ix + count ) * 0.3 ) * 50 ) + ( Math.sin( ( iy + count ) * 0.5 ) * 50 );
      particle.scale.x = particle.scale.y = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 2 + ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 2;

    }

  }

  renderer.render( scene, camera );

  count += 0.1;

}
</script>

<style scoped lang="scss">
@import "@/style/global.scss";
@import "@/style/variate.scss";
@media all and (max-width: 768px) {
  .content-dialog{
    width: 100% !important;
  }
  .page-header{
    padding: 0 !important;
  }
}
#canvascontainer{
  position: absolute;
  top: 0px;
}
.content-dialog{
  width: 350px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 28px 40px;
  background: #fff;
  .content-dialog-tabs{
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 30px;
    .content-dialog-tabs-item{
      cursor: pointer;
      &:hover{
        color: $blue;
      }
    }
    .content-dialog-tabs-item.is-active{
      color: $blue;
    }
  }
}
  .login-box{
    .login-label{
      margin-bottom: 20px;
    }
    .login-btn{
      width: 100%;
    }
    .login-registering-and-forget-password{
      .login-registering{
      }
      .login-forget-password{
        position: absolute;
        right: 0;
        bottom: -30px;
        cursor: pointer;
        &:hover{
          @extend .text-color-primary;
        }
      }
    }
  }
  .register-box{
    .register-desc{
      text-align: center;
    }
    .register-label{
      margin-bottom: 20px;
      @extend .font-size-title;
      @extend .text-color-primary;
    }
    .verification-btn{
      width: 100%;
    }
    .register-btn-box{
      .register-btn{
        width: 100%;
      }
    }
  }
  .find-password{
    .find-password-label{
      margin-bottom: 20px;
      @extend .font-size-title;
      @extend .text-color-primary;
    }
    .verification-btn{
      width: 100%;
    }
    .find-password-btn-box{
      .find-password-btn{
        width: 100%;
        margin-bottom: 10px;
        margin-left: 0;
      }
    }
  }
  .header-register-btn{
    position: relative;
    span{
      position: absolute;
      bottom: 0px;
      left: 0;
      right: 0;
      text-align: center;
      transform: scale(0.7);
    }

  }
  .copyright-box{
    position: absolute;
    bottom: 28px;
    left: 0;
    right: 0;
    text-align: center;
    color: #FFFFFF;
    font-size: $font-size-smaller;
    z-index: 999;
  }
</style>
