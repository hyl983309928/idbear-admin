/*eslint-disable*/

import Mock from 'mockjs'

// 获取机器人列表
Mock.mock('/mock/robot/',
  [
    {
      'id|+1': 1,
      'title': '熊小秘',
      'cycle_end_time': '@datetime',
      'industry|1': ['1', '2', '3', '4'],
      'user': '@id',
      'wechataccount': [
        {
          'id': 31,
          'alias': 'idbear'
        }
      ],
      'praisestore':  [
        {
          "sid": 19235176,
          "name": "嘻嗨赢家"
        }
      ],
      "body": [
        {
          "id": 34,
          "chs_name": "LOHO"
        }
      ],
      'msg_num|100-400': 500,
      "create_time": "2018-08-07T11:10:14.078421",
      "sex": "女",
      "age": "18",
      "constellation": "狮子",
      "mother": "熊妈",
      "father": "熊爸",
      "is_validate": true
    }
  ]
)
