import { colorCompany } from '@/style/variate'
import { list2map } from '@/utils/common'
import merge from 'lodash/merge'
import { skillMap } from './skill'

/**
 * element组件库使用的排序字段和后台的排序字段转换使用
 * */
export const order2orderMap = {
  'descending': 'desc',
  'ascending': 'asc',
  'desc': 'descending',
  'asc': 'ascending'
}

export const filterOrderMap = {
  'ascending': '',
  'descending': '-'
}

/**
 * 微信用户等级
 * */
export const wechatUserStatus = [
  {
    value: 'A',
    name: '重要客戶',
    rule_desc: 'A类: 有手机号',
    color: colorCompany.blue,
    icon: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAXxJREFUOBFjDF31n+3F+5/NjP//xf7/zyDJQAZgZGR4/p+RabGEIHstC8gwhn//yv6TYRBMC9gh//+VAc1iYAK5DCZBKQ0yi4lcb2KzHGQWEzYJSsQIGmgkxcRwKIOTIVKfhSh7CBroq8XMcPbJXwYfTWbKDeRjZ2CwlmdmaN//m4ENaJ4+ESGE14Xu6swM55/9Y3j19T/D9lt/GXyJcCVeA301WBi23fgD9uqOm38Z7JWYGXjY8Pscp4E64kwMApyMDEce/gOb8OzTf4brr/4xuKnhD0ucUQeKBGagdZN8EU4S52UCepuRYd2VvzididVALlYGBidlZoamvb8YXn1BZEqQBf2+7AyaYoxA1yLEkU3HaqCrKjPDww//GY48gHgXWcOBu6AkxAI08DeyMJyNNQxBGrbfhEQGXCWUse3GXwZnFWYGTqxOYWBgtJ3+Dbvb0U0iko/VhUTqxaqMCVQ4YpUhQxBkFhOopCVDL1YtILNYQMU2qKSlVhUAABH1d7g/U15YAAAAAElFTkSuQmCC'
  },
  {
    value: 'B',
    name: '潜在客戶',
    rule_desc: 'B类: 无手机号，互动大于10次',
    color: colorCompany.green,
    icon: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAZZJREFUOBFjDL26iu3x2wfN//7/i2X4zyDJQA5gZHjOxMi0WFZYoZaZL8K07d+/f2VAc3jJMQuqh/f////Wn398ZGcCu4wCk5C1gsxiItubyCbB2MAgY4KxqUWz4DLouF0Zw5//f4EegIA///4ynP7wkGHbyysMB9/cxqWNAaeBIB3RZ+YzPPr+DqyZm5mNwUJIiaFJw5fB98Q0hk9/fmA1lGgvf/37i2Hv6xsMN7+8ZHAQUcNqGEiQaANBivlYOBjUeMQYrn9+DuJiBXi9nK1kz/D1z0+wRiE2bgZdPmmG1ps7GG5/fY3VMJAgXgPPvH/I8PrXF7BmUBi+/vmFIVbWnOExMFxvAL2ODeA18OT7B/BIAWneCozhAmUnhhigoTXXN2Ezj7QwBJnw5Pt7BmVuUayGgQSJjhRWRmYGfT4ZhjhZC4aT7+/jNBCvl5eaJKIk7GufXzCse36BYcnjk6QbaHmoC6cmfBJEexmfIchyTAzAwhFZgCI2qKAFlbQUGYKkGWQWE6jYZmJi6qLIpWCXMXWBzAIAUpeFY8AL7zgAAAAASUVORK5CYII='
  },
  {
    value: 'C',
    name: '活跃',
    rule_desc: 'C类：无手机号，互动小于等于10次',
    color: colorCompany.yellow,
    icon: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAbdJREFUOBGllD1LA0EQht+9vWhMgsEQBKMgpBAMGFDRWvwPNkIqGxsVmzRiIXZiZyGCXf6BWFiEdFoKQdRGhKAmFipEJEq8u3Xn8kluk0viwHG3M+88N7M7d0zcrgwYjx/7ABJCiDF579kYYwWZlNKjoV2dYBKU7JnSlFAtJClZ0KQ/0RT772NC67dN1ZuJRRW6G/cC/glA87hq9U4KNhIDj28DvghglIDBIMRzBubdMVAuKlNZ+WxZqCJsdBF8bgfmzRFEPgMICwhMgk+vSXAI5uVmxdeS3KZlDTy2Lis5gXhJNxK/cjCzh2D+CFh4tgVVWapbHo4C3jDE04UzqfwJI70qX2I6Y9KjBDL/OFDKNyprTTV/Wj31tbplpkHQnvVhamCpAOajr5ApkSw8D5oAlSmBovggx+QbLLLkzJF7yxf2AD7kjEmPcg8hDPuEeXwLpvUL8XolpRZYcAqaHBvxnoV4u1YC284hqak1PrNhnzjoIDwBWLlzWPensNcKZEdgXa/77GGG3Nt241LTqluuRWt3+uzo6sK06s+xC6m7hFh0yil3adeKlEa/bUk++E+llEsMYv0B19WRIF4Kne0AAAAASUVORK5CYII='
  },
  {
    value: 'D',
    name: '沉睡',
    rule_desc: 'D类：无手机号，无互动',
    color: colorCompany.red,
    icon: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAWpJREFUOBGtlT9Lw0AYxp9r00bMYKqL6QfQb9FuIoKgQ8duiqDOBQVB8QPoJDhqUNBJEPRz6GQLumjSCkqDRWswzXmXQBJK0iYh75In758f77133BFaqxU/v81DAHWAKuybwkibFakzkrgnuDDaSEEJlDiNNBgLOeZlnWVmdQZMu8ywJqjCO8zUhCja9O0NQIgbtm3YnQ6s5xf8nJ0z/R5VhkggrzA2NmFrGiAIyCuzKFYqmDo+Qm//ANZTMxQab8mWhcHrG/oXl+hfXWNyfS0Uxp3xgIHy37t7CPNzILIc8PoyMRCmCdrtOiPwMb5KDuS1fLMo9SkBlRhIJAm5UgkDTQ9gfJkYOLG6gr+HR9Bez6cE1Mhj4+UVCsiXyxAXFyBWq/ja2fVCw2IkUD49cfP5sdF1WM0WjK1ttinGMMf7Jx9Ly+HT9VKSicQzHIdnQOdyHJcXM07avEM1ZnacNFXg1za/aZll8gT8AwvBaI31glWBAAAAAElFTkSuQmCC'
  }
]

export const wechatUserStatusMap = list2map(wechatUserStatus, 'value')

/**
 * 时间类型
 * */
export const dateTypeList = [
  {
    label: '本日',
    value: 'day'
  },
  {
    label: '本周',
    value: 'week'
  },
  {
    label: '本月',
    value: 'month'
  },
  {
    label: '本年',
    value: 'year'
  }
]

export const dateTypeMap = list2map(dateTypeList, 'value', 'label')

/**
 * 聊天对应渠道
 * */
export const chatTypeList = [
  {
    value: '1',
    label: '微信'
  },
  {
    value: '2',
    label: 'H5'
  },
  {
    value: '3',
    label: '小程序'
  }
]
export const chatTypeMap = list2map(chatTypeList, 'value', 'label')

/**
 * 版本对应关系
 * */
export const versionList = [
  {
    label: '体验版',
    value: '1',
    desc: '现在的版本是内部体验版哦，你可以在技能中心添加问答语料、我就可7×24h在线帮你解决问题啦，还可查快递，查文章，回答不了还可以通知人工客服和闲聊哦！'
  },
  {
    label: '专业版',
    value: '2',
    desc: '欢迎使用熊小秘AI营销机器人，你可以通过启动AI智能问答以及多种AI技能，创建你微信云端的AI营销助手，通过熊小秘的AI营销系统进行线上吸粉、活粉、了解用户需求、沉淀用户数据，提升用户体验和销售转化率！'
  }
]
export const versionMap = list2map(versionList, 'value', 'label')

export const versionInfoMap = list2map(versionList, 'value')

/**
 * 行业对应关系
 * */
export const industryList = [
  {
    label: '房地产',
    value: '1',
    commonSkill: [1, 6, 7, 8, 11, 9, 10],
    otherSkill: [12, 5, 2, 3, 4],
    targetList: [ // 首页核心指标
      {title: '问题回复率', field_name: 'reply_rate', color: colorCompany.blue, icon: 'iconfont icon-shuru', dispose: 0, count: 0},
      {title: '户型查看率', field_name: 'goods_read_rate', color: colorCompany.green, icon: 'iconfont icon-sousuo', dispose: 0, count: 0},
      {title: '文章阅读率', field_name: 'article_read_rate', color: colorCompany.yellow, icon: 'iconfont icon-xianshimima1', dispose: 0, count: 0}
    ],
    skillMap: merge(JSON.parse(JSON.stringify(skillMap)), {6: { title: '户型推荐', countLabel: '共计[count]个户型', desc: '添加你想要推荐的户型', homeTip: '添加想要你推荐的户型，提升线下看房率' }, 5: { title: '微主页', countLabel: '共计[count]个微主页', desc: '添加你想要推荐的微主页', homeTip: '添加想要你推荐微主页，提升看房体验' }})
  },
  {
    label: '电商',
    value: '2',
    commonSkill: [1, 5, 6, 8, 9, 10],
    otherSkill: [7, 2, 3, 12, 4],
    targetList: [ // 首页核心指标
      {title: '问题回复率', field_name: 'reply_rate', color: colorCompany.blue, icon: 'iconfont icon-shuru', dispose: 0, count: 0},
      {title: '商品查看率', field_name: 'goods_read_rate', color: colorCompany.green, icon: 'iconfont icon-sousuo', dispose: 0, count: 0},
      {title: '文章阅读率', field_name: 'article_read_rate', color: colorCompany.yellow, icon: 'iconfont icon-xianshimima1', dispose: 0, count: 0}
    ],
    skillMap: merge(JSON.parse(JSON.stringify(skillMap)), {})
  },
  {
    label: '自媒体',
    value: '3',
    commonSkill: [1, 5, 6, 8, 9, 10],
    otherSkill: [7, 2, 3, 12, 4],
    targetList: [ // 首页核心指标
      {title: '问题回复率', field_name: 'reply_rate', color: colorCompany.blue, icon: 'iconfont icon-shuru', dispose: 0, count: 0},
      {title: '文章阅读率', field_name: 'article_read_rate', color: colorCompany.green, icon: 'iconfont icon-xianshimima1', dispose: 0, count: 0},
      {title: '品牌关注度', field_name: 'store_read_rate', color: colorCompany.yellow, icon: 'iconfont icon-xianshimima1', dispose: 0, count: 0}
    ],
    skillMap: merge(JSON.parse(JSON.stringify(skillMap)), {})
  },
  {
    label: '商城',
    value: '4',
    commonSkill: [1, 5, 6, 8, 9, 10],
    otherSkill: [7, 2, 3, 12, 4],
    targetList: [ // 首页核心指标
      {title: '问题回复率', field_name: 'reply_rate', color: colorCompany.blue, icon: 'iconfont icon-shuru', dispose: 0, count: 0},
      {title: '品牌关注度', field_name: 'store_read_rate', color: colorCompany.green, icon: 'iconfont icon-xianshimima1', dispose: 0, count: 0},
      {title: '商品查看率', field_name: 'goods_read_rate', color: colorCompany.yellow, icon: 'iconfont icon-sousuo', dispose: 0, count: 0}
    ],
    skillMap: merge(JSON.parse(JSON.stringify(skillMap)), {})
  },
  {
    label: '其他',
    value: '5',
    commonSkill: [1, 5, 6, 8, 9, 10],
    otherSkill: [7, 2, 3, 12, 4],
    targetList: [ // 首页核心指标
      {title: '问题回复率', field_name: 'reply_rate', color: colorCompany.blue, icon: 'iconfont icon-shuru', dispose: 0, count: 0},
      {title: '商品查看率', field_name: 'goods_read_rate', color: colorCompany.green, icon: 'iconfont icon-sousuo', dispose: 0, count: 0},
      {title: '文章阅读率', field_name: 'article_read_rate', color: colorCompany.yellow, icon: 'iconfont icon-xianshimima1', dispose: 0, count: 0}
    ],
    skillMap: merge(JSON.parse(JSON.stringify(skillMap)), {})
  }
]

export const industryMap = list2map(industryList, 'value', 'label')

export const industryInfoMap = list2map(industryList, 'value')
