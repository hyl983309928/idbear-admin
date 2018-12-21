<template>
<div class="is-content-block">
  <div class="robot-list-box">
    <BasicTable
      :list="robotList"
      :isPagination="false"
      :isSearch="false"
      :loading="loading"
    >

      <el-table-column
        label="机器人"
        prop="title"
      >
        <template slot-scope="scope">
          <a @click="gotoHome(scope.row)">{{scope.row.title}}</a>
        </template>
      </el-table-column>
      <el-table-column
        label="行业"
        prop="industry"
      >
        <template slot-scope="scope">
          <span>{{industryMap[scope.row.industry]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="对话数"
        prop="msg_num"
      >
      </el-table-column>
      <el-table-column
        label="公众号"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.wechataccount[0]">{{scope.row.wechataccount[0].nick_name}}</span>
          <a @click="bindWechat(scope.row.id)" v-else>立即绑定</a>
        </template>
      </el-table-column>
      <el-table-column
        label="有赞店铺"
      >
        <template slot-scope="scope" >
          <span v-if="scope.row.praisestore[0]">{{scope.row.praisestore[0].name}}</span>
          <a @click="showBindPraise(scope.row.id)" v-else>立即绑定</a>
        </template>
      </el-table-column>
      <el-table-column
        label="版本"
      >
        <template slot-scope="scope">
          {{versionMap[scope.row.version]}}
        </template>
      </el-table-column>
      <el-table-column
        label="服务到期时间"
      >
        <template slot-scope="scope">
          {{scope.row.version === 1 ? '--' : formatDate(scope.row.cycle_end_time)}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="150"
      >
        <template slot-scope="scope">
          <template>
            <a @click="settingRobot(scope.row)" class="color-blue">设置</a>
            <a @click="showActivateService(scope.row.id)" class="color-yellow" style="margin-left: 15px">升级/续费</a>
            <a @click="delRobot(scope.row.id, scope.row.$index)" class="color-red" style="margin-left: 15px">删除</a>
          </template>
        </template>
      </el-table-column>
    </BasicTable>
    <div class="add-robot-box">
      <el-button @click.native="setShowAddRobotDialog(true)" type="primary" size="medium">添加机器人</el-button>
    </div>

  </div>
</div>
</template>

<script>
import { formatDate } from '../../utils/date'
import BasicTable from '@/components/basicTable'
import { mapActions, mapGetters } from 'vuex'
import { getRobotList } from '@/lib/modules/user.js'
import mixin from '@/mixins'
import { versionMap, industryMap } from '../../lib/config'

export default {
  components: {
    BasicTable
  },
  mixins: [mixin],
  data () {
    return {
      versionMap,
      industryMap,
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'robotList',
      'nowRobot'
    ])
  },
  created () {
    this.handleAddRobotSuccess()
  },
  beforeRouteLeave (to, from, next) {
    this.$bus.$off('add-robot-success')
    next()
  },
  methods: {
    ...mapActions([
      'setShowAddRobotDialog',
      'setNowRobot'
    ]),
    formatDate,
    handleAddRobotSuccess () {
      this.$bus.$on('add-robot-success', () => {
      })
    },
    settingRobot (item) {
      if (item.id === this.nowRobot) {
        this.goto('/setting/index', { type: 'robot' })
      } else {
        this.setNowRobot(item)
        this.goto('/setting/index', { type: 'robot' })
      }
    },
    gotoHome (item) {
      this.setNowRobot(item)
      this.goto('/home/index')
    },
    delRobot (id, index) {
      this.$confirm('是否删除该机器人?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.setting.delRobotInfo(id)
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            getRobotList(true)
          })
      }).catch(() => {})
    }
  },
  watch: {}
}
</script>

<style scoped lang="scss">
.add-robot-box{
  text-align: center;
  margin-top: 40px;
}
</style>
