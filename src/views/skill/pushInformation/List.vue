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
  </div>
  <div class="skill-list">
    <div class="skill-item box-shadow" v-for="(item, index) in skillList" :key="index">
      <div class="skill-item-icon">
        <i :class="item.icon" />
      </div>
      <div class="skill-item-content">
        <div class="skill-item-content-title">{{item.title}}</div>
        <div class="skill-item-content-desc">{{item.desc}}</div>
      </div>
      <div class="skill-item-switch">
        <el-switch
          v-model="item.info.is_active"
          :active-color="colorCompany.green"
          inactive-color="#C0C4CC"
          @change="changeSwitch(item.info)"
          :disabled="!item.info.id"
        ></el-switch>
      </div>
    </div>
  </div>
  <div class="more-box">
    <img src="http://storage.id-bear.com/21/FjVWI3Dqj1apM68GKNcfT5WiPJLxpush-information-bg.png" />
  </div>
</div>
</template>

<script>
import { industryInfoMap } from '@/lib/config/index'
import { checkRobotListExist } from '@/lib/modules/user'
import { colorCompany } from '@/style/variate'
import { mapGetters } from 'vuex'
export default {
  components: {},
  mixins: [],
  data () {
    return {
      colorCompany,
      skillId: 10,
      skillInfo: {},
      skillList: [
        { id: 1, title: '每日晨报', icon: 'iconfont icon-diqiu', desc: '每天早上8：00-10：00，自动向活跃用户推送综合新闻。', info: {} }
      ]
    }
  },
  computed: {
    ...mapGetters(['nowRobotInfo', 'nowRobot'])
  },
  created () {
    checkRobotListExist(this.init)
  },
  mounted () {},
  methods: {
    init () {
      let skillMap = industryInfoMap[this.nowRobotInfo.industry].skillMap
      this.skillInfo = skillMap[this.skillId]
      this.getSkillList()
    },
    getSkillList () {
      this.$api.skill.getPushInformationSkillList()
        .then((data) => {
          let listMap = {}
          for (let i = 0; i < data.results.length; i++) {
            listMap[data.results[i].id] = data.results[i]
          }
          this.skillList.forEach((item) => {
            if (listMap[item.id]) {
              item.info = listMap[item.id]
            }
          })
        })
    },
    changeSwitch (info) {
      this.$api.skill.updatePushInformationSkillList(info)
        .then((data) => {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        })
    }
  },
  watch: {}
}
</script>

<style scoped lang="scss">
  @import "@/style/variate.scss";
  .skill-header{
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
  .skill-list{
    display: flex;
    flex-wrap: wrap;
    padding: 0 20px;
    margin-right: -20px;
    .skill-item{
      width: 50%;
      margin-right: 20px;
      padding: 22px 15px;
      display: flex;
      align-items: center;
      position: relative;
      .skill-item-icon{
        width: 50px;
        height: 50px;
        margin-right: 10px;
        border-radius: 50% 50%;
        border: 1px solid $blue;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-grow: 0;
        flex-shrink: 0;
        .iconfont{
          font-size: 30px;
          color: $blue;
        }
      }
      .skill-item-content{
        flex-grow: 1;
        .skill-item-content-title{
          line-height: 1;
          margin-bottom: 10px;
        }
        .skill-item-content-desc{
          font-size: 12px;
          color: $text-minor;
        }
      }
      .skill-item-switch{
        position: absolute;
        right: 15px;
        top: 22px;
      }
    }
  }
  .more-box{
    text-align: center;
    padding: 100px;
  }
</style>
