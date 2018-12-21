import axios from 'axios'
var CancelToken = axios.CancelToken

const app = {
  state: {
    sidebarOpen: true,
    showUploadDialog: false,
    showAddRobotDialog: false,
    showActivateServiceDialog: false,
    showBindWechatSuccessDialog: false,
    showPromptCreateRobotDilaog: false,
    activeRobot: '', // 当前正在操作的机器人ID
    uploadProgress: 0,
    uploadTitle: '上传文件中',
    source: CancelToken.source(), // 取消请求对象，source.cancel()
    loading: false, // main加载中动画
    nowRobot: window.localStorage.getItem('nowRobot'),
    nowRobotInfo: {},
    robotList: [],
    isRequestRobot: false // 是否请求过robotList
  },
  mutations: {
    SET_SIDEBAROPEN: (state, flag) => {
      state.sidebarOpen = flag
    },
    SET_SHOWUPLOADDIALOG: (state, data) => {
      state.showUploadDialog = data
    },
    SET_SHOWADDROBOTDIALOG: (state, flag) => {
      state.showAddRobotDialog = flag
    },
    SET_SHOWBINDWECHATSUCCESSDIALOG: (state, flag) => {
      state.showBindWechatSuccessDialog = flag
    },
    SET_SHOWPROMPTCREATEROBOTDIALOG: (state, flag) => {
      state.showPromptCreateRobotDilaog = flag
    },
    SET_SHOWACTIVATESERVICEDIALOG: (state, flag) => {
      state.showActivateServiceDialog = flag
    },
    SET_ACTIVEROBOT: (state, id) => {
      state.activeRobot = id
    },
    SET_UPLOADPROGRESS: (state, data) => {
      state.uploadProgress = data
    },
    SET_UPLOADTITLE: (state, text) => {
      state.uploadTitle = text
    },
    SET_SOURCE: (state, source) => {
      state.source = source
    },
    SET_LOADING: (state, flag) => {
      state.loading = flag
    },
    SET_NOWROBOT: (state, id) => {
      state.nowRobot = id
    },
    SET_NOWROBOTINFO: (state, obj) => {
      state.nowRobotInfo = obj
    },
    SET_ROBOTLIST: (state, list) => {
      state.robotList = list
    },
    SET_ISREQUESTROBOT: (state, flag) => {
      state.isRequestRobot = flag
    }
  },
  actions: {
    setSidebarOpen ({commit, state}, flag) {
      commit('SET_SIDEBAROPEN', flag)
    },
    setShowUploadDialog ({commit, state}, flag) {
      commit('SET_SHOWUPLOADDIALOG', flag)
    },
    setShowAddRobotDialog ({commit, state}, flag) {
      commit('SET_SHOWADDROBOTDIALOG', flag)
    },
    setShowBindWechatSuccessDialog ({commit, state}, flag) {
      commit('SET_SHOWBINDWECHATSUCCESSDIALOG', flag)
    },
    setShowPromptCreateRobotDilaog ({commit, state}, flag) {
      commit('SET_SHOWPROMPTCREATEROBOTDIALOG', flag)
    },
    setShowActivateServiceDialog ({commit, state}, flag) {
      commit('SET_SHOWACTIVATESERVICEDIALOG', flag)
    },
    setActiveRobot ({commit, state}, id) {
      commit('SET_ACTIVEROBOT', id)
    },
    setUploadProgress ({commit, state}, flag) {
      commit('SET_UPLOADPROGRESS', flag)
    },
    setUploadTitle ({commit, state}, text) {
      commit('SET_UPLOADTITLE', text)
    },
    setSource ({commit, state}, source) {
      let temp = CancelToken.source()
      commit('SET_SOURCE', temp)
    },
    setLoading ({commit, state}, flag) {
      commit('SET_LOADING', flag)
    },
    setNowRobot ({commit, state}, obj) {
      commit('SET_NOWROBOT', obj.id)
      commit('SET_NOWROBOTINFO', obj)
      window.localStorage.setItem('nowRobot', obj.id)
    },
    setNowRobotInfo ({commit, state}, obj) {
      commit('SET_NOWROBOTINFO', obj)
    },
    setRobotList ({commit, state}, list) {
      commit('SET_ROBOTLIST', list)
    },
    setIsRequestRobot ({commit, state}, flag) {
      commit('SET_ISREQUESTROBOT', flag)
    }
  }
}

export default app
