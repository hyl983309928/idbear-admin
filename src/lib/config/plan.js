
import { colorCompany } from '@/style/variate'
import { list2map } from '@/utils/common'

export const statusTypeList = [
  {
    value: '1',
    text: '未开始',
    color: colorCompany.textCommon
  },
  {
    value: '2',
    text: '进行中',
    color: colorCompany.yellow
  },
  {
    value: '3',
    text: '已完成',
    color: colorCompany.green
  }
]
export const statusTypeMap = list2map(statusTypeList, 'value')
