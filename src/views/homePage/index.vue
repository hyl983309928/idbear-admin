<template>
<div>
  <el-row>
    <el-col :span="24">
      <div class="home-row-hint">
        <transition-group name="tip">
          <div class="tip-item" v-for="(item) in tipList" v-if="!item.hidden" :key="item.id" :style="{zIndex: 10 - item.id}" >
            <div class="tip-item-desc text-color-placeholder" v-html="item.desc"></div>
            <template v-if="item.id !== 4">
              <div class="tip-item-btn" v-if="item.id == 1">
                <el-button round @click.native="setShowAddRobotDialog(true)" :style="{ color: colorCompany.blue }">{{item.btnLabel}}</el-button>
              </div>
              <div class="tip-item-btn" v-else-if="item.id == 2">
                <el-button round @click.native="bindWechat" :style="{ color: colorCompany.blue }">{{item.btnLabel}}</el-button>
              </div>
              <div class="tip-item-btn" v-else>
                <el-button round @click.native="goto(item.btnLink)" :style="{ color: colorCompany.blue }">{{item.btnLabel}}</el-button>
                <!--<a @click="item.hidden = true" class="text-color-placeholder">暂不需要</a>-->
              </div>
            </template>
          </div>
        </transition-group>
      </div>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="5" style="width: 18.5%;">
      <div class="home-row-issue-skill">
        <div class="home-row-issue-skill-circle">
          <iCircle :percent="parseInt(parseInt(nowRobot ? nowRobotInfo.iq : 86) / 2)" :size="116" :strokeColor="colorCompany.blue" :isClockwise="false">
            <span>{{nowRobot ? parseInt(nowRobotInfo.iq) : 86}}</span>
          </iCircle>
        </div>
        <div class="home-row-issue-skill-label">
          <span>智商</span>
        </div>
      </div>
    </el-col>
    <el-col :span="5" style="width: 18.5%;">
      <div class="home-row-issue-skill">
        <div class="home-row-issue-skill-circle cursor-pointer" @click="goto('/chat/list#status=3')">
          <iCircle class="hover-scale" :percent="resolveInfo.resolve_num + resolveInfo.no_resolve_num === 0 ? 0 : parseInt(resolveInfo.resolve_num * 100 / (resolveInfo.resolve_num + resolveInfo.no_resolve_num))" :size="116" :strokeColor="colorCompany.green" :isClockwise="false">
            <span>{{resolveInfo.resolve_num + resolveInfo.no_resolve_num === 0 ? '--' : parseInt(resolveInfo.resolve_num * 100 / (resolveInfo.resolve_num + resolveInfo.no_resolve_num)) + '%'}}</span>
          </iCircle>
        </div>
        <div class="home-row-issue-skill-label">
          <span>已解决</span>
        </div>
      </div>
    </el-col>
    <el-col :span="5" style="width: 18.5%;">
      <div class="home-row-issue-skill">
        <div class="home-row-issue-skill-circle cursor-pointer" @click="goto('/chat/list#status=2')">
          <iCircle class="hover-scale" :percent="resolveInfo.resolve_num + resolveInfo.no_resolve_num === 0 ? 0 : (100 - parseInt(resolveInfo.resolve_num * 100 / (resolveInfo.resolve_num + resolveInfo.no_resolve_num)))" :size="116"  :strokeColor="colorCompany.red">
            <span>{{resolveInfo.resolve_num + resolveInfo.no_resolve_num === 0 ? '--' : (100 - parseInt(resolveInfo.resolve_num * 100 / (resolveInfo.resolve_num + resolveInfo.no_resolve_num))) + '%'}}</span>
          </iCircle>
        </div>
        <div class="home-row-issue-skill-label">
          <span>未解决</span>
        </div>
      </div>
    </el-col>
    <el-col :span="9" style="width: 44.5%;">
      <div class="home-row-issue-skill">
        <div class="homepage-block">
          <div class="header">
            <span class="header-label">常用技能</span>
            <span class="header-btn">
              <el-button round size="mini" @click.native="goto('/skill/list')">查看更多</el-button>
            </span>
          </div>
          <div class="body">
            <el-row>
              <el-col :span="6" v-for="(item) in commonSkillList.slice(0, 4)" :key="item.id">
                <el-tooltip effect="dark" :content="item.homeTip" placement="top">
                  <div slot="content" style="width: 100px;text-align: justify;">{{item.homeTip}}</div>
                  <div class="skill-item">
                    <div @click="handleClickSkillIcon(item.version, item.link)" class="skill-item-icon hover-scale cursor-pointer" :style="{background: item.iconColor}" :class="{'filter-gray': !judgeSkillIconOpen(item.version)}">
                      <i class="iconfont" :class="[judgeSkillIconOpen(item.version) ? item.icon : 'icon-iconset0114']" style="font-size: 34px;" :style="{color: '#fff'}"></i>
                    </div>
                    <div class="skill-item-label">
                      <span >{{item.title}}</span>
                    </div>
                  </div>
                </el-tooltip>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>

  <el-row :gutter="20">
    <el-col :span="8" style="width: 18.5%;">
      <div class="home-row-stat">
        <div>
          <!--<div class="header">-->
            <!--<span class="header-label">数据统计</span>-->
            <!--<span class="header-btn">-->
              <!--<el-dropdown>-->
                <!--<el-button round size="mini">-->
                  <!--{{dateTypeMap[dataType.stat]}}<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
                <!--</el-button>-->
                <!--<el-dropdown-menu slot="dropdown">-->
                  <!--<el-dropdown-item-->
                    <!--@click.native="handleChangeDateType(item.value, 'stat')"-->
                    <!--:class="{'active': item.value == dataType.stat}"-->
                    <!--:disabled="item.value == dataType.stat"-->
                    <!--v-for="(item) in dateTypeList"-->
                    <!--:key="item.value"-->
                  <!--&gt;-->
                    <!--{{item.label}}-->
                  <!--</el-dropdown-item>-->
                <!--</el-dropdown-menu>-->
              <!--</el-dropdown>-->
            <!--</span>-->
          <!--</div>-->
          <div class="main">
            <div class="home-row-stat-num-box">
              <div v-for="item in numDataStatList" :key="item.value" class="stat-num-item-box">
                <div class="stat-num-item">
                  <div class="stat-num-item-icon" :style="{'background': item.color}">
                    <i :class="item.icon"></i>
                  </div>
                  <div class="stat-num-item-info">
                    <div class="stat-num-item-info-label">
                      {{item.label}}
                    </div>
                    <div class="stat-num-item-info-num text-color-primary">
                      {{formatNum(item.num)}}{{item.unit}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="24" style="width: 81.5%;">
      <div class="home-row-stat">
        <div class="homepage-block">
          <div class="header">
            <div class="header-label">
              <span class="header-label">数据统计</span>
              <!--<div class="chart-stat-option-item">-->
                <!--<el-tooltip effect="dark" :content="item.desc" placement="top"  v-for="item in chartStatList" :key="item.value">-->
                  <!--<div slot="content" style="width: 100px;text-align: justify;">{{item.desc}}</div>-->
                  <!--<button-->
                    <!--class="idbear-btn btn-mini is-round"-->
                    <!--:class="{'is-active': item.value == statChartInfo.type}"-->
                    <!--@click="changeStatData(item.value)"-->
                  <!--&gt;{{item.label}}</button>-->
                <!--</el-tooltip>-->
              <!--</div>-->
              <i class="iconfont icon-xiazai1 link-black font-size-regular cursor-pointer" @click="exportVisitChart"></i>
            </div>
            <span class="header-btn">
              <el-dropdown>
                  <el-button round size="mini">
                    {{this.chartStatMap[this.statChartInfo.type]}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      @click.native="changeStatData(item.value)"
                      :class="{'active': item.value == statChartInfo.type}"
                      :disabled="item.value == statChartInfo.type"
                      v-for="(item) in chartStatList"
                      :key="item.value"
                    >
                      {{item.label}}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              <el-date-picker
                size="mini"
                v-model="statChartInfo.date"
                type="daterange"
                unlink-panels
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                :clearable="false"
                class="date-picker"
                @change="getChartStatData"
                style="width: 230px;"
              >
                </el-date-picker>
            </span>
          </div>
          <div class="main">
            <div id="stat-chart" style="height: 300px;"></div>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>

  <el-row :gutter="20">
    <el-col :span="7" style="width: 27.5%;">
      <div class="home-row-data">
        <div class="homepage-block">
          <div class="header">
            <span class="header-label">核心指标</span>
            <span class="header-btn">
              <el-dropdown>
                <el-button round size="mini">
                  {{dateTypeMap[dataType.target]}}<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    @click.native="handleChangeDateType(item.value, 'target')"
                    :class="{'active': item.value == dataType.target}"
                    :disabled="item.value == dataType.target"
                    v-for="(item) in dateTypeList"
                    :key="item.value"
                  >
                    {{item.label}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </div>
          <div class="main">
            <div class="target-box">
              <div class="target-item" v-for="(item, index) in targetList" :key="index">
                <div class="target-item-header">
                  <div class="target-item-header-label">
                    <div class="icon-box" :style="{background: item.color}">
                      <i :class="item.icon"></i>
                    </div>
                    <span class="title">{{item.title}}</span>
                  </div>
                  <div class="target-item-header-value">
                    <span>{{`${item.dispose}/${item.count}`}}</span>
                  </div>
                </div>
                <div class="target-item-progress">
                  <el-progress :color="item.color" :percentage="item.count?(item.dispose/item.count)*100:0" :show-text="false" :stroke-width="10"></el-progress>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="7" style="width: 27.5%;">
      <div class="home-row-data">
        <div class="homepage-block">
          <div class="header">
            <span class="header-label">关键词排行榜</span>
            <span class="header-btn">
              <el-dropdown>
                <el-button round size="mini">
                  {{dateTypeMap[dataType.keyword]}}<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    @click.native="handleChangeDateType(item.value, 'keyword')"
                    :class="{'active': item.value == dataType.keyword}"
                    :disabled="item.value == dataType.keyword"
                    v-for="(item) in dateTypeList"
                    :key="item.value"
                  >
                    {{item.label}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </div>
          <div class="main">
            <div class="keyword-box">
              <div class="keyword-item" v-for="(item, index) in 8" :key="index">
                <el-row style="margin-bottom: 10px;">
                  <el-col :span="6">
                    <div class="keyword-item-index">
                      <span v-if="index > 2">{{index + 1}}</span>
                      <img v-else :src="index==0?'/static/imgs/first.png':index==1?'/static/imgs/second.png':'/static/imgs/thirdly.png'" />
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="keyword-item-name">
                      {{keywordList[index] ? keywordList[index][0] : '--'}}
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="keyword-item-count">
                      {{keywordList[index] ? keywordList[index][1] : 0}}次
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="10" style="width: 45%;">
      <div class="home-row-data">
        <div class="homepage-block">
          <div class="header">
            <span class="header-label">客户活跃度 <i class="iconfont icon-xiazai1 link-black font-size-regular cursor-pointer" @click="exportActiveChart"></i></span>
            <span class="header-btn">
              <!--<el-button size="mini" round @click="exportActiveChart">导出图片</el-button>-->
              <el-dropdown>
                <el-button round size="mini">
                  {{dateTypeMap[dataType.active]}}<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    @click.native="handleChangeDateType(item.value, 'active')"
                    :class="{'active': item.value == dataType.active}"
                    :disabled="item.value == dataType.active"
                    v-for="(item) in dateTypeList"
                    :key="item.value"
                  >
                    {{item.label}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </div>
          <div class="main">
            <div id="active-pie-chart" style="height: 290px;"></div>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>

</div>
</template>

<script>
import iCircle from '@/components/iview/circle'
import { colorCompany } from '@/style/variate'
import { formatDate } from '../../utils/date'
import { mapGetters, mapActions } from 'vuex'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import { wechatUserStatus } from '@/lib/config'
import { list2map } from '@/utils/common'
import { checkRobotListExist, getRobotList } from '@/lib/modules/user.js'
import mixin from '@/mixins'
import dateMixin from '@/mixins/date'
import skillMixin from '@/mixins/skill'
import { dateTypeList, dateTypeMap, versionInfoMap, industryInfoMap } from '../../lib/config'
import { fakeHomeData } from '../../lib/config/fakeData'
import { downloadImg } from '../../utils/changeImgSize'
import { chartStatList, chartStatMap, chartStatInfoMap, numDataStatList } from '../../lib/config/homepage'

export default {
  components: {
    iCircle
  },
  mixins: [mixin, dateMixin, skillMixin],
  data () {
    return {
      colorCompany,
      wechatUserStatus,
      versionInfoMap,
      dateTypeList: dateTypeList.filter(item => item.value !== 'week'),
      dateTypeMap,
      chartStatList,
      chartStatMap,
      chartStatInfoMap,
      numDataStatList,
      wechatUserStatusMap: list2map(wechatUserStatus, 'name'),
      tipList: [
        { id: 1, hidden: true, btnLabel: '创建机器人', btnLink: '', desc: '你好，欢迎你体验熊小秘智能营销机器人，TA可以7×24h在线帮你在公众号、微信H5回复用户问题、推荐产品或服务，提升服务效率' },
        { id: 2, hidden: true, btnLabel: '接入公众号', btnLink: '/setting/index', desc: '嗨！接入公众号，我就可以帮你在公众号回复用户问题和推荐推荐产品或服务啦' },
        { id: 3, hidden: true, btnLabel: '立即设置语料库', btnLink: '/corpus/index', desc: '刚搞了个营销活动，客服又不够，新来的客服又不懂业务，辛辛苦苦拉来的流量又流失啦！没关系，帮TA优化智能语料库，轻轻松松帮你赚钱！' },
        { id: 4, hidden: false, btnLabel: '', desc: '<br />现在的版本是内部体验版哦，你可以在技能中心添加问答语料、我就可7×24h在线帮你解决问题啦，还可查快递，查文章，回答不了还可以通知人工客服和闲聊哦！' }
      ],
      targetList: [
        {label: '问题回复率', field_name: 'reply_rate', color: colorCompany.blue, icon: 'iconfont icon-shuru', dispose: 0, count: 0},
        {label: '推荐查看率', field_name: 'goods_read_rate', color: colorCompany.green, icon: 'iconfont icon-sousuo', dispose: 0, count: 0},
        {label: '文章阅读率', field_name: 'article_read_rate', color: colorCompany.yellow, icon: 'iconfont icon-xianshimima1', dispose: 0, count: 0}
      ],
      keywordList: [],
      dataType: {
        target: 'year',
        keyword: 'year',
        active: 'year'
      },
      statChartInfo: {
        date: '',
        type: 'fans',
        chart: '',
        list: []
      },
      resolveInfo: {
        resolve_num: 0,
        no_resolve_num: 0
      },
      robotList: []
    }
  },
  computed: {
    ...mapGetters([
      'nowRobotInfo',
      'nowRobot'
    ])
  },
  created () {
    let end = new Date()
    let start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
    this.statChartInfo.date = [formatDate(start, 'YYYY-MM-DD'), formatDate(end, 'YYYY-MM-DD')]
    this.handleAddRobotSuccess()
  },
  mounted () {
    checkRobotListExist(this.init)
  },
  beforeRouteLeave (to, from, next) {
    this.$bus.$off('add-robot-success')
    next()
  },
  methods: {
    ...mapActions([
      'setShowAddRobotDialog'
    ]),
    init (robotList) {
      this.robotList = robotList
      this.initTips()
      this.initActiveChart()
      this.initVisitChart()
      if (robotList.length !== 0) {
        this.getNumDataStat()
        this.getResolveStat()
        this.getActivity()
        this.getKeyword()
        this.getWorthindex()
        this.getChartStatData()
        getRobotList(true)
      } else {
        this.initFakeData()
      }
      this.initWindowResize()
    },
    initFakeData () {
      this.targetList = fakeHomeData.targetList
      this.keywordList = fakeHomeData.keywordList
      this.resolveInfo = fakeHomeData.resolveInfo
      this.numDataStatList.forEach((item) => {
        item.num = fakeHomeData.numData[item.value]
      })
      let seriesData = this.wechatUserStatus.map((item) => {
        return {
          value: fakeHomeData.activityData[item.value],
          name: item.name,
          label: {
            show: true,
            formatter: '{d}%',
            position: 'outside'
          },
          itemStyle: {
            color: item.color
          }
        }
      })
      this.activeChart.setOption({
        series: [
          {
            data: seriesData
          }
        ]
      })
      this.statChartInfo.type = 'wechat'
      this.statChartInfo.list = this.handleStatData(fakeHomeData.stat)
    },
    initTips () {
      if (this.robotList.length === 0) {
        this.tipList[0].hidden = false
      }
      if (!this.nowRobotInfo.first_wechataccount) {
        this.tipList[1].hidden = false
      }
      if (this.versionInfoMap[this.nowRobotInfo.version]) {
        this.tipList[3].desc = this.versionInfoMap[this.nowRobotInfo.version].desc
      }
      // if (!this.nowRobotInfo.first_corpus) {
      //   this.tipList[2].hidden = false
      // }
    },
    initWindowResize () {
      window.onresize = () => {
        this.activeChart.resize()
        this.statChartInfo.chart.resize()
      }
    },
    getResolveStat () {
      this.$api.home.getResolveStat()
        .then((data) => {
          this.resolveInfo = data
        })
    },
    getKeyword () {
      this.$api.home.getKeyword(this.dataType.keyword)
        .then((data) => {
          this.keywordList = data
        })
    },
    getWorthindex () {
      this.targetList = industryInfoMap[this.nowRobotInfo.industry].targetList
      this.$api.home.getWorthindex(this.dataType.target)
        .then((data) => {
          this.targetList.forEach((item) => {
            item.dispose = data[item.field_name] ? data[item.field_name].num : 0
            item.count = data[item.field_name] ? data[item.field_name].total_num : 0
          })
        })
    },
    getNumDataStat () {
      let params = {
        robot: this.nowRobot
      }
      this.$api.home.getSumStatData(params)
        .then((data) => {
          this.numDataStatList.forEach((item) => {
            item.num = data[item.value] || 0
          })
        })
    },
    getActivity () {
      this.$api.home.getActivity(this.dataType.active)
        .then((data) => {
          let seriesData = this.wechatUserStatus.map((item) => {
            return {
              value: data[item.value],
              name: item.name,
              label: {
                show: true,
                formatter: '{d}%',
                position: 'outside'
              },
              itemStyle: {
                color: item.color
              }
            }
          })
          this.activeChart.setOption({
            series: [
              {
                data: seriesData
              }
            ]
          })
        })
    },
    initActiveChart () {
      this.activeChart = echarts.init(document.getElementById('active-pie-chart'))
      this.activeChart.on('click', (params) => {
        this.goto('/wechatUser/list', {user_status: this.wechatUserStatusMap[params.data.name].value})
      })
      let legendData = this.wechatUserStatus.map((item) => {
        return {
          name: item.name,
          icon: item.icon
        }
      })
      let seriesData = this.wechatUserStatus.map((item) => {
        return {
          value: 0,
          name: item.name,
          label: {
            show: true,
            formatter: '{d}%',
            position: 'outside'
          },
          itemStyle: {
            color: item.color
          }
        }
      })
      this.activeChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            if (this.wechatUserStatusMap[params.name]) {
              return this.wechatUserStatusMap[params.name].rule_desc
            }
            return ''
          }
        },
        legend: {
          bottom: 10,
          left: 'center',
          itemGap: 15,
          itemHeight: 20,
          itemWidth: 20,
          selectedMode: false,
          data: legendData
        },
        series: [
          {
            type: 'pie',
            radius: '65%',
            center: ['50%', '40%'],
            startAngle: 270,
            data: seriesData
          }
        ]
      })
    },
    exportActiveChart () {
      downloadImg(this.activeChart.getConnectedDataURL({ backgroundColor: '#fff' }), '客户活跃度')
    },
    exportVisitChart () {
      downloadImg(this.statChartInfo.chart.getConnectedDataURL({ backgroundColor: '#fff' }), '数据统计')
    },
    changeStatData (type) {
      this.statChartInfo.type = type
      this.getChartStatData()
    },
    getChartStatData () {
      let params = {
        start_date: this.statChartInfo.date[0],
        end_date: this.statChartInfo.date[1],
        ref_date_gte: this.statChartInfo.date[0],
        ref_date_lte: this.statChartInfo.date[1],
        robot: this.nowRobot,
        wechat_account__robot: this.nowRobot
      }
      if (this.statChartInfo.type === 'wechat' || this.statChartInfo.type === 'h5') {
        params.chat_type = this.statChartInfo.type === 'wechat' ? 1 : 2
      }
      this.$api.home[this.chartStatInfoMap[this.statChartInfo.type].apiName](params)
        .then((data) => {
          this.statChartInfo.list = this.handleStatData(data)
        })
    },
    handleStatData (map) {
      let list = []
      if (this.statChartInfo.type === 'fans') {
        map.forEach((item, index) => {
          list[index] = []
          list[index][0] = item.ref_date
          list[index][1] = item.cumulate_user
        })
      } else {
        Object.keys(map).forEach((item, index) => {
          list[index] = []
          list[index][0] = item
          list[index][1] = map[item]
        })
      }

      this.statChartInfo.chart.setOption({
        series: [
          {
            showSymbol: list.length === 1 ? true : false, // eslint-disable-line
            name: '微信访客数',
            data: list
          }
        ]
      })
      return list
    },
    initVisitChart () {
      this.statChartInfo.chart = echarts.init(document.getElementById('stat-chart'))
      this.statChartInfo.chart.setOption({
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            return `${params[0].data[0]}<br />${this.chartStatMap[this.statChartInfo.type]}<br />${params[0].data[1]}次`
          },
          backgroundColor: colorCompany.blue,
          padding: 15,
          textStyle: {
            color: '#ffffff'
          },
          extraCssText: 'text-align: center'
        },
        grid: {
          left: '60',
          right: '30',
          top: '30',
          bottom: '50'
        },
        xAxis: {
          type: 'time',
          splitNumber: 10,
          boundaryGap: ['20', '20'],
          axisLine: {
            lineStyle: {
              color: '#939393',
              width: 1
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#939393'
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#E4E7ED',
              width: 1
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#939393'
          }
        },
        series: [{
          name: '',
          type: 'line',
          showSymbol: false,
          legendHoverLink: false,
          smooth: true,
          lineStyle: {
            color: colorCompany.blue,
            width: 2
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#DBEBFE' // 0% 处的颜色
              }, {
                offset: 1, color: '#ffffff' // 100% 处的颜色
              }],
              globalCoord: false // 缺省为 false
            }
          },
          itemStyle: {
            color: colorCompany.blue
          },
          data: []
        }]
      })
    },
    handleAddRobotSuccess () {
      this.$bus.$on('add-robot-success', () => {
        console.log('首页：添加机器人成功')
        this.tipList[0].hidden = true
        getRobotList()
          .then((data) => {
            console.log(data)
            this.init(data)
          })
      })
    },
    handleChangeDateType (value, field) {
      this.dataType[field] = value
      if (field === 'active') {
        this.getActivity()
      } else if (field === 'keyword') {
        this.getKeyword()
      } else if (field === 'target') {
        this.getWorthindex()
      }
    },
    formatNum (num) {
      if (num > 10000) {
        return (num / 10000).toFixed(2) + '万'
      }
      return num
    }
  },
  watch: {}
}
</script>

<style scoped lang="scss">
@import "@/style/global.scss";
@import "@/style/variate.scss";
.el-row{
  margin-bottom: 20px;
}
.homepage-block{
  padding: 20px 20px;
  height: 100%;
  width: 100%;
  .header{
    height: 28px;
    line-height: 28px;
    display: flex;
    .header-label{
      @extend .text-color-primary;
      @extend .font-size-title;
      flex-grow: 1;
    }
    .header-btn{
      flex-grow: 0;
    }
  }
  .body{
  }
}
.home-row-hint{
  height: 180px;
  @extend .bg-white;
  @extend .box-shadow;
  @extend .hover-shadow;
  .tip-item{
    @extend .border-radius-4;
    padding: 35px 25px;
    background: url("/static/imgs/hometipbg.jpg") #fff no-repeat center;
    background-size: cover;
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    bottom: 0;
    .tip-item-desc{
      @extend .font-size-title;
      min-width: 700px;
      width: 65%;
      line-height: 30px;
      min-height: 85px;
      text-align: justify;
    }
    .tip-item-btn{
      .btn{
        @extend .font-size-title;
        height: 40px;
        line-height: 40px;
        padding: 0 30px;
        text-align: center;
        margin-right: 30px;
      }
      a{
        @extend .font-size-title;
        &:hover{
          color: $blue;
        }
      }
    }
  }
}
.home-row-issue-skill{
  @extend .bg-white;
  @extend .box-shadow;
  @extend .hover-shadow;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .home-row-issue-skill-circle{
    font-size: 0;
  }
  .home-row-issue-skill-label{
    margin-top: 20px;
    line-height: 1;
    @extend .font-size-title;
    @extend .text-color-primary;
  }
  .skill-item{
    text-align: center;
    margin-top: 24px;
    .skill-item-icon{
      width: 60px;
      height: 60px;
      border-radius: 50% 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;

    }
    .skill-item-label{
      margin-top: 26px;
    }
  }
}
.home-row-data{
  @extend .bg-white;
  @extend .box-shadow;
  @extend .hover-shadow;
  height: 344px;
  .target-box{
    margin-top: 40px;
    .target-item{
      margin-bottom: 38px;
      &:last-child{
        margin-bottom: 0;
      }
      .target-item-header{
        display: flex;
        margin-bottom: 10px;
        .target-item-header-label{
          flex-grow: 1;
          display: inline-flex;
          align-items: center;
          .icon-box{
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border-radius: 50% 50%;
            background: $blue;
            vertical-align: text-bottom;
          }
          .title{
            line-height: 1;
            margin-left: 20px;
          }
          .iconfont{
            font-size: 14px;
            color: #fff;
            line-height: 1;
          }
        }
        .target-item-header-value{
          flex-grow: 0;
        }
      }
    }
  }
  .keyword-box{
    margin-top: 10px;
    .keyword-item{
      .keyword-item-index{
        vertical-align: top;
        height: 24px;
        line-height: 24px;
        span{
          display: inline-block;
          width: 16px;
          text-align: center;
        }
        img{
          width: 16px;
        }
      }
      .keyword-item-name{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 24px;
        line-height: 24px;
      }
      .keyword-item-count{
        text-align: right;
        height: 24px;
        line-height: 24px;
      }
    }
  }
}
.home-row-stat{
  @extend .bg-white;
  @extend .box-shadow;
  @extend .hover-shadow;
  height: 355px;
  vertical-align: top;
  .chart-stat-option-item{
    .idbear-btn{
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
  .stat-chart-count{
    height: 65px;
    .stat-chart-count-right{
      display: inline-block;
      padding-top: 15px;
      float: right;
      height: 100%;
      line-height: 1;
      .stat-chart-count-num{
        display: inline-block;
        font-size: 24px;
        margin-right: 20px;
        vertical-align: bottom;
      }
      .stat-chart-count-rate{
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        .stat-chart-count-rate-num{
          line-height: 20px;s
          .rate-num-icon-triangle{
            line-height: 1;
            font-size: 20px;
            vertical-align: top;
          }
          span{
            display: inline-block;
            vertical-align: top;
          }
        }
        .stat-chart-count-rate-label{
        }
      }
    }
  }
  .home-row-stat-num-box{
    display: flex;
    flex-direction: column;
    .stat-num-item-box{
      padding: 26px 20px;
      border-bottom: 1px solid #E4E7ED;
      &:last-child{
        border-bottom: 0px;
      }
    }
    .stat-num-item{
      height: 100%;
      display: inline-flex;
      line-height: 1;
      align-items: center;
      .stat-num-item-icon{
        flex-shrink: 0;
        flex-grow: 0;
        width: 36px;
        height: 36px;
        border-radius: 50% 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
        .iconfont{
          font-size: 20px;
          color: #fff;
        }
      }
      .stat-num-item-info{
        flex-grow: 1;
        text-align: left;
        .stat-num-item-info-label{
          margin-bottom: 8px;
        }
        .stat-num-item-info-num{
          word-break:break-all;
        }
      }
    }
  }
  .date-picker{
    border-radius: 14px;
    margin-left: 20px;
  }
}
.active{
  color: $blue;
}
.tip-leave-active {
  transition: all 1s;
}
.tip-enter-active{
  transition: all 0s;
}
.tip-enter, .tip-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.add-robot-dialog{
  text-align: center;
  .step-box{
    text-align: left;
    display: inline-block;
    width: 80%;
    .steps{
      display: flex;
      white-space: nowrap;
      .step{
        flex-basis: 50%;
        margin-right: 0;
        display: flex;
        position: relative;
        &:last-child{
          flex-basis: auto !important;
          flex-shrink: 0;
          flex-grow: 0;
        }
        .step-content{
          width: 100px;
          height: 100px;
          border-radius: 50% 50%;
          border: 8px solid #d8d8d8;
          color: #999;
          background: linear-gradient(-180deg, #ffffff 44%, #b1b1b1 100%);
          z-index: 1;
          text-align: center;
          .step-content-index{
            width: 60px;
            height: 30px;
            line-height: 30px;
            display: inline-block;
            text-align: center;
            border-bottom: 1px solid #999;
          }
          .step-content-text{
            white-space: normal;
            width: 60px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 5px;
            margin-left: 50%;
            transform: translateX(-50%);
            line-height: 1.3;
          }
        }
        .step-line{
          height: 8px;
          background: #d8d8d8;
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          transform: translateY(-50%);
        }
      }
    }
    .step-content-success{
      color: $blue !important;
      border-color: $blue !important;
      .step-content-index{
        border-color: $blue !important;
      }
    }
    .step-line-success{
      background: $blue !important;
    }
  }
}
</style>
