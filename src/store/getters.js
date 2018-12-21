const getters = {
  token: state => state.user.token,
  sidebarOpen: state => state.app.sidebarOpen,
  userInfo: state => state.user.userInfo,
  showUserOption: state => state.app.showUserOption,
  showUploadDialog: state => state.app.showUploadDialog,
  showAddRobotDialog: state => state.app.showAddRobotDialog,
  showActivateServiceDialog: state => state.app.showActivateServiceDialog,
  showBindWechatSuccessDialog: state => state.app.showBindWechatSuccessDialog,
  showPromptCreateRobotDilaog: state => state.app.showPromptCreateRobotDilaog,
  activeRobot: state => state.app.activeRobot,
  uploadProgress: state => state.app.uploadProgress,
  uploadTitle: state => state.app.uploadTitle,
  source: state => state.app.source,
  loading: state => state.app.loading,
  nowRobot: state => state.app.nowRobot,
  nowRobotInfo: state => state.app.nowRobotInfo,
  robotList: state => state.app.robotList,
  isRequestRobot: state => state.app.isRequestRobot
}
export default getters
