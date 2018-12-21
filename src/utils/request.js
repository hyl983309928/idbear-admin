/* eslint-disable */
/**
 * desc: axios请求封装
 * */
import axios from 'axios'
import Vue from 'vue'
const http = axios
import store from '../store'

http.interceptors.response.use(checkStatus)

http.interceptors.request.use(config => {
  var token = window.localStorage.getItem('token')
  var robotId = window.localStorage.getItem('nowRobot')
  if (token) {
    config.headers['Authorization'] = 'JWT ' + window.localStorage.getItem('token')
  }
  if (robotId && config.url.indexOf('robot_id') === -1) {
    if (config.url.indexOf('?') === -1) {
      config.url += `?robot_id=${robotId}&robot=${robotId}`
    } else {
      config.url += `&robot_id=${robotId}&robot=${robotId}`
    }
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

if (process.env.NODE_ENV !== 'development') {
  http.defaults.baseURL = process.env.API_ROOT
} else {
  http.defaults.baseURL = '/api'
}
http.defaults.validateStatus = function (status) {
  if (status === 401) {
    window.authUser()
  }
  return true
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.data
  } else {
    let errMsg = ''
    if (response.data) {
      Object.keys(response.data).forEach((key) => {
        errMsg = response.data[key][0]
        return
      })
    }
    return Promise.reject(errMsg)
  }
}

function getUrl(url, param) {
  if (!param) {
    return url
  }
  url += '?'
  var list = []
  for (var key in param) {
    if (param.hasOwnProperty(key)) {
      var val = param[key]
      if (Object.prototype.toString.call(val) == '[object Array]') {
        for (let i = 0; i < val.length; i++) {
          if (val[i]) {
            var temp = encodeURIComponent(val[i])
            list.push(key + '=' + temp)
          }
        }
      } else {
        if (val || val === 0 || val === false) {
          val = encodeURIComponent(val)
          list.push(key + '=' + val)
        }
      }
    }
  }
  url += list.join('&')
  return url
}
var CancelToken = axios.CancelToken
var source = CancelToken.source()


export function apiRequest(path, method = 'get', data = null, isCancel = false) {
  var url = path
  var headers = {}
  let onUploadProgress = function (progressEvent) {
    if (progressEvent.lengthComputable) {
      var precent = (progressEvent.loaded) / (progressEvent.total) * 100
      store.commit('SET_UPLOADPROGRESS', precent)
    }
  }
  if (method === 'get') {
    return http.get(getUrl(url, data), { headers })
  } else if (method === 'delete') {
    return http.delete(getUrl(url, data), { headers })
  } else if (method === 'post') {
    headers['Content-type'] = 'application/json; charset=utf-8'
    return http.post(url, data, { headers, onUploadProgress: isCancel ? onUploadProgress : '', cancelToken: isCancel?store.state.app.source.token:'' })
  } else if (method === 'put') {
    headers['Content-type'] = 'application/json; charset=utf-8'
    return http.put(url, data, { headers, onUploadProgress: isCancel ? onUploadProgress : '', cancelToken: isCancel?store.state.app.source.token:''  })
  } else if (method === 'patch') {
    headers['Content-type'] = 'application/json; charset=utf-8'
    return http.patch(url, data, { headers, onUploadProgress: isCancel ? onUploadProgress : '', cancelToken: isCancel?store.state.app.source.token:''  })
  } else if (method === 'form') {
    headers['Content-type'] = ' application/x-www-form-urlencoded;charset=utf-8'
    return http.post(url, data, { headers, onUploadProgress: isCancel ? onUploadProgress : '', cancelToken: isCancel?store.state.app.source.token:'' })
  }
}
