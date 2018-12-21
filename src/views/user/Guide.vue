<template>
<div>
  <header class="page-header">
    <div class="header-logo">
      <img src="/static/imgs/logo.jpg" />
      <span>熊小秘AI电商机器人</span>
    </div>
    <div class="header-user">
      <el-button type="primary" @click="goto('/login')">登录</el-button>
      <el-button type="warning" @click="goto('/login?register=1')">
        免费试用
      </el-button>
    </div>
  </header>
  <div class="content-box">
    <div class="official">
      <div class="btn" @click="buyCode"></div>
    </div>
    <div class="free">
      <div class="btn" @click="goto('/login?register=1')"></div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  components: {},
  data () {
    return {}
  },
  computed: {},
  created () {},
  methods: {
    goto (url) {
      this.$router.push(url)
    },
    buyCode () {
      window.open('https://h5.youzan.com/v2/goods/3nvgcd5e4nu0w')
    }
  },
  watch: {}
}
</script>

<style scoped lang="scss">
  @import "@/style/global.scss";
  @media all and (max-width: 768px) {
    .content-dialog{
      width: 100% !important;
    }
    .page-header{
      padding: 0 !important;
    }
  }
  .page-header{
    width: 100%;
    height: 50px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1024;
    background: #545C64;
    display: flex;
    color: #fff;
    padding: 0 50px;
    .header-logo{
      flex-grow: 1;
      display: flex;
      align-items: center;
      img{
        width: 35px;
        height: 35px;
        margin-right: 15px;
        border-radius: 50% 50%;
        overflow: hidden;
      }
      span{
        display: inline-block;
        color: #fff;
        font-size: 18px;
      }
    }
    .header-user{
      flex-grow: 0;
      line-height: 50px;
      cursor: pointer;
      .header-user-label{
        color: #fff;
        span{
          display: inline-block;
          line-height: 50px;
        }
      }
    }
  }
  .content-box{
    position: fixed;
    top: 50px;
    bottom: 0;
    left: 0;
    width: 100%;
    background: url("../../assets/guide/guide-bg.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .official{
      position: relative;
      display: inline-block;
      width: 23.4%;
      padding-bottom: 31%;
      background: url("../../assets/guide/guide-zs.png") no-repeat;
      background-size: 100% 100%;
      margin-right: 5%;
      .btn{
        position: absolute;
        bottom: 6.667%;
        left: 50%;
        transform: translateX(-50%);
        display: inline-block;
        width: 33.3%;
        padding-bottom: 8.55%;
        background: url("../../assets/guide/zs-btn.png") no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
        &:hover{
          background: url("../../assets/guide/zs-btn-active.png") no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .free{
      position: relative;
      display: inline-block;
      width: 23.4%;
      padding-bottom: 31%;
      background: url("../../assets/guide/guide-sy.png") no-repeat;
      background-size: 100% 100%;
      .btn{
        position: absolute;
        bottom: 6.667%;
        left: 50%;
        transform: translateX(-50%);
        display: inline-block;
        width: 33.3%;
        padding-bottom: 8.55%;
        background: url("../../assets/guide/sy-btn.png") no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
        &:hover{
          background: url("../../assets/guide/sy-btn-active.png") no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }
</style>
