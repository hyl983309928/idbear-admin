import { mapGetters } from 'vuex'
import { industryInfoMap } from '@/lib/config'
import mixin from './index'
import { checkRobotListExist } from '../lib/modules/user'
import { skillMap } from '../lib/config/skill'

export default {
  data () {
    return {
      industryInfoMap,
      skillMap: {},
      commonSkillList: [],
      otherSkillList: []
    }
  },
  mixins: [mixin],
  computed: {
    ...mapGetters([
      'nowRobotInfo'
    ])
  },
  created () {
    checkRobotListExist(this.initSkill)
  },
  methods: {
    // 处理技能图标是否开启
    initSkill () {
      this.skillMap = this.nowRobotInfo.industry ? industryInfoMap[this.nowRobotInfo.industry].skillMap : skillMap
      this.handleSkillOrderList()
    },
    handleSkillOrderList () {
      let commonList = []
      let otherList = []
      let commonSkillList = this.nowRobotInfo.industry ? this.industryInfoMap[this.nowRobotInfo.industry].commonSkill : [1, 5, 6, 8]
      let otherSkillList = this.nowRobotInfo.industry ? this.industryInfoMap[this.nowRobotInfo.industry].otherSkill : [7, 2, 3]
      for (let i = 0; i < commonSkillList.length; i++) {
        commonList.push(this.skillMap[commonSkillList[i]])
      }
      for (let i = 0; i < otherSkillList.length; i++) {
        otherList.push(this.skillMap[otherSkillList[i]])
      }
      this.commonSkillList = commonList
      this.otherSkillList = otherList
    },
    judgeSkillIconOpen (versionList) {
      if (!this.nowRobotInfo) {
        return false
      }
      if (versionList && versionList.length > 0) {
        return versionList.indexOf(this.nowRobotInfo.version) !== -1
      } else {
        return true
      }
    },
    handleClickSkillIcon (versionList, link) {
      this.clickOpenSkillIcon(link)
    },
    clickCloseSkillIcon () {
      this.$confirm('此功能只对专业版开发哦', '提示', {
        confirmButtonText: '去升级'
      }).then(() => {
        this.showActivateService()
      }).catch(() => {})
    },
    clickOpenSkillIcon (link) {
      if (link) {
        this.$router.push(link)
      } else {
        this.$router.push('/skill/list')
      }
    }
  },
  watch: {
    'nowRobotInfo': {
      handler: function () {
        this.initSkill()
      },
      deep: true
    }
  }
}
