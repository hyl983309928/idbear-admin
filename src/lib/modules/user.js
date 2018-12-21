/**
 * desc: 对请求的二次封装函数
 * */

import api from '../api/api.js'
import store from '../../store'
// import dayjs from 'dayjs'
let robotList = ''

export function getRobotList (reload = false) {
  if (robotList && !reload) {
    return new Promise(function (resolve, reject) {
      resolve(robotList)
    })
  } else {
    return api.user.getRobotList()
      .then((data) => {
        store.commit('SET_ISREQUESTROBOT', true)
        if (data && data.length !== 0) {
          data.forEach((item) => {
            if (item.final_reply) {
              item.parse_final_reply = JSON.parse(item.final_reply)
            } else {
              item.parse_final_reply = []
            }
          })
          let nowRobot = window.localStorage.getItem('nowRobot')
          let flag = data.find((item) => {
            return String(item.id) === String(nowRobot)
          })
          if (nowRobot && flag) {
            let nowStoreItem = data.find((x) => { return String(x.id) === String(nowRobot) })
            store.commit('SET_NOWROBOTINFO', nowStoreItem)
            store.commit('SET_NOWROBOT', parseInt(nowRobot))
          } else {
            let nowStoreItem = {...data[0]}
            store.commit('SET_NOWROBOTINFO', nowStoreItem)
            window.localStorage.setItem('nowRobot', nowStoreItem.id)
            store.commit('SET_NOWROBOT', parseInt(nowStoreItem.id))
          }
          robotList = data
        } else {
          store.commit('SET_NOWROBOT', '')
          store.commit('SET_NOWROBOTINFO', {})
          window.localStorage.removeItem('nowRobot')
          robotList = []
        }
        store.commit('SET_ROBOTLIST', robotList)
        return robotList
      })
  }
}

export function checkRobotListExist (callbackFn) {
  if (robotList !== '') {
    callbackFn(robotList)
  } else {
    let timer = setInterval(() => {
      if (robotList) {
        clearInterval(timer)
        callbackFn(robotList)
      }
    }, 100)
  }
}

export function clearRobotList () {
  robotList = ''
  store.commit('SET_ISREQUESTROBOT', false)
  store.commit('SET_NOWROBOT', '')
}
