
import { getToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    userInfo: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    }
  },

  actions: {
    // 登录
    SetToken ({ commit, state }, token) {
      commit('SET_TOKEN', token)
    },
    // 登出
    LogOut ({ commit, state }) {
      commit('SET_TOKEN', '')
    },
    SetUserinfo ({ commit, state }, userInfo) {
      commit('SET_USERINFO', userInfo)
    }
  }
}

export default user
