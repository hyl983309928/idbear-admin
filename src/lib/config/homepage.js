import { list2map } from '../../utils/common'
import { colorCompany } from '@/style/variate'
/**
 * 首页访问图标的选择list
 * */
export const chartStatList = [
  {
    label: '粉丝数',
    value: 'fans',
    desc: '关注微信公众号用户总数',
    apiName: 'getFansStatData'
  },
  {
    label: '微信访客',
    value: 'wechat',
    desc: '微信和H5访客的访客总数',
    apiName: 'getVisitStatData'
  },
  {
    label: 'h5访客',
    value: 'h5',
    desc: '微信和H5访客的访客总数',
    apiName: 'getVisitStatData'
  },
  {
    label: '互动人数',
    value: 'interaction',
    desc: '在公众号和H5互动过的用户总数',
    apiName: 'getInteractionStatData'
  },
  {
    label: '互动消息',
    value: 'interactionmsg',
    desc: '用户发送消息和主动推送的消息总数',
    apiName: 'getInteractionmsgStatData'
  }
]

export const chartStatMap = list2map(chartStatList, 'value', 'label')

export const chartStatInfoMap = list2map(chartStatList, 'value')

/**
 * 首页数据统计list
 * */
export const numDataStatList = [
  {
    label: '用户数',
    value: 'user_count',
    num: '0',
    unit: '人',
    icon: 'iconfont icon-gerenzhongxin1',
    color: colorCompany.blue
  },
  {
    label: '粉丝数',
    value: 'fans_count',
    num: '0',
    unit: '人',
    icon: 'iconfont icon-fensi',
    color: colorCompany.green
  },
  {
    label: '互动人数',
    value: 'interaction_count',
    num: '0',
    unit: '人',
    icon: 'iconfont icon-hudong',
    color: colorCompany.yellow
  },
  {
    label: '互动消息',
    value: 'interaction_msg_count',
    num: '0',
    unit: '条',
    icon: 'iconfont icon-liaotian',
    color: colorCompany.blue
  }
]

export const numDataStatMap = list2map(chartStatList, 'value', 'label')
