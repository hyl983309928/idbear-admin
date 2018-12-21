<template>
<div>
  <div class="user-info-box box-shadow">
    <div class="user-info">
      <div class="user-info-head">
        <div class="user-info-head-img">
          <img class="head-img" :src="wechatUserInfo.headimgurl" />
        </div>
        <div class="user-info-nickname font-size-title">{{wechatUserInfo.nickname}}</div>
      </div>
      <div class="user-info-other">
        <div class="user-info-other-grade">
          <span v-if="wechatUserInfo.user_status" class="grade border-radius-4 font-size-smaller" :style="{background: wechatUserStatusMap[wechatUserInfo.user_status].color}">{{wechatUserInfo.user_status}}</span>
        </div>
        <div class="user-info-other-bottom">
          <div class="user-info-other-row">
            <div class="user-info-other-item">
              <div class="other-item-label">
                性别：
              </div>
              <div class="other-item-value">
                {{wechatUserInfo.sex === 1 ? '男' : '女'}}
              </div>
            </div>
            <div class="user-info-other-item">
              <div class="other-item-label">
                城市：
              </div>
              <div class="other-item-value">
                {{wechatUserInfo.province + wechatUserInfo.city}}
              </div>
            </div>
          </div>
          <div class="user-info-other-row">
            <div class="user-info-other-item">
              <div class="other-item-label">
                国家：
              </div>
              <div class="other-item-value">
                {{wechatUserInfo.country}}
              </div>
            </div>
            <div class="user-info-other-item">
              <div class="other-item-label">
                手机：
              </div>
              <div class="other-item-value">
                {{wechatUserInfo.mobile}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <el-row :gutter="20">
    <el-col :span="7">
      <div class="home-row-data box-shadow bg-white">
        <div class="homepage-block">
          <div class="header">
            <span class="header-label font-size-title text-color-primary">TA的热搜</span>
            <span class="header-btn">
              <el-dropdown>
                <el-button round size="mini">
                  {{dateTypeMap[keywordInfo.dateType]}}<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    @click.native="handleChangeDateType(item.value)"
                    :class="{'active': item.value == keywordInfo.dateType}"
                    :disabled="item.value == keywordInfo.dateType"
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
                      {{keywordInfo.list[index] ? keywordInfo.list[index][0] : '--'}}
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="keyword-item-count">
                      {{keywordInfo.list[index] ? keywordInfo.list[index][1] : 0}}次
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="17">
      <div class="home-row-Dialogue box-shadow bg-white">
        <div class="homepage-block">
          <div class="header">
            <span class="header-label font-size-title text-color-primary">
              TA的对话统计
              <i class="iconfont icon-xiazai1 link-black cursor-pointer" @click="exportChart" style="font-size: 14px;"></i>
              <el-button @click="goto(`/chat/list#from_wechat_user__generaluser__id=${id}`)" size="mini" round style="margin-left: 10px;">查看详情</el-button>
            </span>
            <span class="header-btn">
              <el-dropdown>
                <el-button round size="mini">
                  {{this.chatTypeMap[this.dialogueChartInfo.type] || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    @click.native="changeDialogueType('')"
                    :class="{'active': dialogueChartInfo.type == ''}"
                    :disabled="dialogueChartInfo.type == ''"
                  >
                    全部
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="changeDialogueType(item.value)"
                    :class="{'active': item.value == dialogueChartInfo.type}"
                    :disabled="item.value == dialogueChartInfo.type"
                    v-for="(item) in chatTypeList"
                    :key="item.value"
                  >
                    {{item.label}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-date-picker
                size="mini"
                v-model="dialogueChartInfo.date"
                type="daterange"
                unlink-panels
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                :clearable="false"
                class="date-picker"
                @change="changeDialogueDate"
                style="width: 250px;"
              >
                </el-date-picker>
            </span>
          </div>
          <div class="main">
            <div id="Dialogue-line-chart" style="height: 290px;"></div>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</div>
</template>

<script>
import { formatDate } from '../../utils/date'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import dateMixin from '@/mixins/date'
import mixin from '@/mixins'
import { colorCompany } from '@/style/variate'
import { checkRobotListExist } from '@/lib/modules/user'
import { wechatUserStatusMap, dateTypeList, dateTypeMap, chatTypeList, chatTypeMap } from '@/lib/config/index'
import { downloadImg } from '../../utils/changeImgSize'

export default {
  components: {},
  mixins: [dateMixin, mixin],
  data () {
    return {
      wechatUserStatusMap,
      dateTypeList: dateTypeList.filter(item => item.value !== 'week'),
      dateTypeMap,
      chatTypeList,
      chatTypeMap,
      id: '',
      wechatUserInfo: {},
      keywordInfo: {
        dateType: 'year',
        list: []
      },
      dialogueChartInfo: {
        date: '',
        type: '',
        chart: '',
        list: []
      }
    }
  },
  computed: {
  },
  created () {
    this.id = this.$route.params.id
  },
  mounted () {
    checkRobotListExist(this.init)
  },
  methods: {
    init () {
      let end = new Date()
      let start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      this.dialogueChartInfo.date = [formatDate(start, 'YYYY-MM-DD'), formatDate(end, 'YYYY-MM-DD')]
      this.getWechatUserInfo()
      this.getWechatUserHotWord()
      this.initDialogueChart()
      this.getWechatUserDialogue()
    },
    initWindowResize () {
      window.onresize = () => {
        this.dialogueChartInfo.chart.resize()
      }
    },
    exportChart () {
      downloadImg(this.dialogueChartInfo.chart.getConnectedDataURL({ backgroundColor: '#fff' }), '对话统计')
    },
    initDialogueChart () {
      this.dialogueChartInfo.chart = echarts.init(document.getElementById('Dialogue-line-chart'))
      this.dialogueChartInfo.chart.setOption({
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            return `${params[0].data[0]}<br />${this.chatTypeMap[this.dialogueChartInfo.type] || '全部'}<br />${params[0].data[1]}次`
          },
          backgroundColor: colorCompany.blue,
          padding: 15,
          textStyle: {
            color: '#ffffff'
          },
          extraCssText: 'text-align: center'
        },
        grid: {
          left: '50',
          right: '50'
        },
        xAxis: {
          type: 'time',
          splitNumber: 10,
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
      this.initWindowResize()
    },
    getWechatUserInfo () {
      this.$api.wechatUser.getWechatUserInfo(this.id)
        .then((data) => {
          this.wechatUserInfo = data
        })
    },
    getWechatUserHotWord () {
      let params = {
        general_user_id: this.id,
        filter_field: this.keywordInfo.dateType
      }
      this.keywordInfo.list = []
      this.$api.wechatUser.getWechatUserHotWord(params)
        .then((data) => {
          this.keywordInfo.list = data
        })
    },
    getWechatUserDialogue () {
      let params = {
        general_user_id: this.id,
        chat_type: this.dialogueChartInfo.type,
        start_date: this.dialogueChartInfo.date[0],
        end_date: this.dialogueChartInfo.date[1]
      }
      this.$api.wechatUser.getWechatUserDialogue(params)
        .then((data) => {
          this.handleDialogueData(data)
        })
    },
    handleDialogueData (map) {
      let list = []
      Object.keys(map).forEach((item, index) => {
        list[index] = []
        list[index][0] = item
        list[index][1] = map[item]
      })
      this.dialogueChartInfo.list = list
      this.$nextTick(() => {
        this.dialogueChartInfo.chart.setOption({
          series: [
            {
              showSymbol: this.dialogueChartInfo.list.length === 1 ? true : false, // eslint-disable-line
              name: '微信访客数',
              data: this.dialogueChartInfo.list
            }
          ]
        })
      })
    },
    changeDialogueType (type) {
      this.dialogueChartInfo.type = type
      this.getWechatUserDialogue()
    },
    changeDialogueDate () {
      this.getWechatUserDialogue()
    },
    handleChangeDateType (type) {
      this.keywordInfo.dateType = type
      this.getWechatUserHotWord()
    }
  },
  watch: {}
}
</script>

<style scoped lang="scss">
.user-info-box{
  background: url("/static/imgs/wechatUserBG.png") #fff no-repeat;
  background-size: 100% 100%;
  margin-bottom: 20px;
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  .user-info{
    display: inline-block;
    .user-info-head{
      width: 180px;
      display: inline-block;
      text-align: center;
      .user-info-head-img{
        display: inline-block;
        width: 60px;
        height: 60px;
        border-radius: 50% 50%;
        overflow: hidden;
        margin-bottom: 15px;
        .head-img{
          width: 60px;
          height: 60px;
          border-radius: 50% 50%;
          overflow: hidden;
        }
      }
      .user-info-nickname{
        color: #fff;
      }
    }
    .user-info-other{
      display: inline-block;
      vertical-align: top;
      .user-info-other-grade{
        margin-bottom: 20px;
        .grade{
          text-align: center;
          display: inline-block;
          width: 38px;
          height: 28px;
          line-height: 28px;
          color: #fff;
        }
      }
      .user-info-other-bottom{
        color: #fff;
        display: inline-flex;
        .user-info-other-row{
          margin-right: 60px;
        }
        .user-info-other-item{
          margin-bottom: 15px;
          .other-item-label{
            display: inline-block;
          }
          .other-item-value{
            display: inline-block;
          }
        }
      }
    }
  }
}
.homepage-block{
  padding: 25px;
  height: 100%;
  width: 100%;
  .header{
    height: 28px;
    line-height: 28px;
    display: flex;
    .header-label{
      flex-grow: 1;
    }
    .header-btn{
      flex-grow: 0;
    }
  }
  .body{
  }
}
.home-row-data{
  height: 350px;
  .keyword-box{
    margin-top: 15px;
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
          width: 18px;
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
.home-row-Dialogue{
  height: 350px;
  .date-picker{
    border-radius: 14px;
    margin-left: 20px;
  }
}
</style>
