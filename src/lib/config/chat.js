import { list2map } from '@/utils/common'

export const chatOkStatusList = [
  {
    value: 1,
    label: '不满意'
  },
  {
    value: 2,
    label: '未解决'
  },
  {
    value: 3,
    label: '已解决'
  }
]

// 回复类型
export const replyTypeList = [
  {
    value: '1',
    label: '文字'
  },
  {
    value: '2',
    label: '图片'
  },
  {
    value: '3',
    label: '语音'
  }
]
export const replyTypeMap = list2map(replyTypeList, 'value', 'label')
