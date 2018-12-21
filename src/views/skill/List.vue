<template>
<div class="is-content-block">
  <div class="skill-block" v-for="(item, index) in skillList" :key="index">
    <label class="skill-block-label">{{item.label}}</label>
    <div class="skill-block-list">
      <div class="skill-block-list-item box-shadow" @click="handleClickSkillIcon(skillItem.version, skillItem.link)" :class="{'cursor-pointer': !skillItem.isDisabled && skillItem.link}" v-for="(skillItem, skillIndex) in item.list" :key="skillIndex">
        <div class="skill-item-top">
          <div class="skill-item-top-logo" :style="{background: item.color}">
            <i :class="skillItem.icon"></i>
          </div>
          <div class="skill-item-top-info">
            <div class="skill-item-top-title">
              {{skillItem.title}}
            </div>
            <div class="skill-item-top-desc text-color-minor">
              {{skillItem.desc}}
            </div>
          </div>
          <div  v-if="!skillItem.isDisabled" class="skill-switch" @click.stop.prevent="() => {}">
            <el-switch
              v-model="skillItem.info.is_active"
              :active-color="colorCompany.green"
              inactive-color="#C0C4CC"
              :disabled="!judgeSkillIconOpen(skillItem.version) || !skillItem.info.id"
              @click.native.stop.prevent="!judgeSkillIconOpen(skillItem.version) ? clickCloseSkillIcon() : () => {}"
              @change="changeSwitch(skillItem.info)"
            ></el-switch>
          </div>
          <div v-else class="skill-switch-disabled">敬请期待</div>
        </div>
        <div class="skill-item-count">
          <div class="skill-item-count-label box-shadow text-color-minor">
            {{skillItem.countLabel.replace('[count]', skillItem.info.id && skillItem.info.skills[skillItem.countName] ?  skillItem.info.skills[skillItem.countName] : 0)}}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { colorCompany } from '@/style/variate'
import { checkRobotListExist } from '@/lib/modules/user'
import skillMixin from '@/mixins/skill'
import { mapGetters } from 'vuex'
export default {
  components: {},
  mixins: [skillMixin],
  data () {
    return {
      colorCompany,
      skillList: [
        {
          label: '常用技能',
          color: colorCompany.blue,
          list: []
        },
        {
          label: '其他技能',
          color: colorCompany.blue,
          list: []
        }
        // {
        //   label: '即将开放',
        //   color: '#C0C4CC',
        //   list: [
        //     {id: 8, isDisabled: true, info: { id: 8, skills: {} }, countLabel: '共计2张优惠券', countName: 'store_sum', icon: 'iconfont icon-youhuiquan', title: '自动发券', desc: '可以根据用户活跃度自动发券'},
        //     {id: 9, isDisabled: true, info: { id: 9, skills: {} }, countLabel: '共计30个社群', countName: 'store_sum', icon: 'iconfont icon-fenxiang', title: '社群推广', desc: '可以在不同的社群推广商品或服务'},
        //     {id: 10, isDisabled: true, info: { id: 10, skills: {} }, countLabel: '共计5个红包', countName: 'store_sum', icon: 'iconfont icon-red-packet_icon', title: '现金红包', desc: '可以根据用户活跃度自动发红包'},
        //     {id: 11, isDisabled: true, info: { id: 11, skills: {} }, countLabel: '共计5个活动', countName: 'store_sum', icon: 'iconfont icon-tongzhi', title: '活动推广', desc: '可以特定时间段设置推广活动'}
        //   ]
        // }
      ],
      skillMap: []
    }
  },
  computed: {
    ...mapGetters([
      'nowRobotInfo'
    ])
  },
  created () {
    checkRobotListExist(this.init)
  },
  methods: {
    init () {
      this.skillList[0].list = this.commonSkillList
      this.skillList[1].list = this.otherSkillList
      this.getSkillList()
    },
    goto (url, item) {
      if (url) {
        this.$router.push({path: url, query: {id: item.id}})
      }
    },
    getSkillList () {
      this.$api.skill.getSkillList()
        .then((data) => {
          this.handleSkillList(data)
        })
    },
    handleSkillList (list) {
      let listMap = {}
      for (let i = 0, length = list.length; i < length; i++) {
        listMap[list[i].skills.id] = list[i]
      }
      for (let i = 0, length = this.skillList.length; i < length; i++) {
        for (let j = 0, len = this.skillList[i].list.length; j < len; j++) {
          if (listMap[this.skillList[i].list[j].id]) {
            this.skillList[i].list[j].info = listMap[this.skillList[i].list[j].id]
          }
        }
      }
    },
    changeSwitch (item) {
      let params = {
        id: item.id,
        is_active: item.is_active,
        order: item.order,
        robot: item.robot
      }
      this.$api.skill.uploadSkill(params)
        .then(() => {
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
.skill-block{
  margin-bottom: 36px;
  .skill-block-label{
    font-size: 16px;
    margin-bottom: 28px;
    display: block;
  }
  .skill-block-list{
    display: flex;
    flex-wrap: wrap;
    margin-right: -20px;
    .skill-block-list-item{
      width: 274px;
      height: 140px;
      margin-right: 20px;
      margin-bottom: 20px;
      padding: 22px 15px;
      &:hover{
        background: #F5FAFE;
      }
      .skill-item-top{
        display: flex;
        align-items: center;
        position: relative;
        .skill-item-top-logo{
          margin-right: 10px;
          width: 50px;
          height: 50px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50% 50%;
          i{
            font-size: 32px;
            color: #fff;
          }
        }
        .skill-item-top-info{
          position: relative;
          line-height: 1;
          .skill-item-top-title{
            margin-bottom: 10px;
          }
          .skill-item-top-desc{
            font-size: 12px;
          }
        }
        .skill-switch{
          position: absolute;
          right: 0;
          top: 0;
        }
        .skill-switch-disabled{
          display: inline-block;
          position: absolute;
          right: 0;
          top: 0;
          font-size: 12px;
          line-height: 1;
          color: #fff;
          text-align: center;
          width: 70px;
          padding: 5px 0px;
          background: #C0C4CC;
          border-radius: 20px;
        }
      }
      .skill-item-count{
        margin-top: 20px;
        .skill-item-count-label{
          display: inline-flex;
          padding: 7px 15px;
          font-size: 12px;
          line-height: 1;
        }
      }
    }
  }
}
</style>
