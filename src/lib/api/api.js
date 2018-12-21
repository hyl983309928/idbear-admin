/**
 * api请求统一封装，请求地址为process.env.API_ROOT
 * */

import { apiRequest } from '@/utils/request.js'

export default {
  upload (files) {
    let fd = new window.FormData()
    fd.append('files', files, 'image.jpg')
    return apiRequest('/generalfileupload/', 'form', fd, true)
  },
  skill: {
    getStoreList (params) {
      return apiRequest('/body/', 'get', { ...params })
    },
    updateStoreInfo (params) {
      return apiRequest(`/body/`, 'post', params)
    },
    delStoreInfo (params) {
      return apiRequest(`/body/`, 'post', params)
    },
    addStore (params) {
      return apiRequest('/body/', 'post', params)
    },
    getStoreInfo (id) {
      return apiRequest(`/body/${id}/`, 'get')
    },
    getSkillList () {
      return apiRequest('/skills/', 'get')
    },
    getSkillItem (id) {
      return apiRequest(`/skilldetail/`, 'get', { 'skill_id': id })
    },
    uploadSkill (params) {
      return apiRequest(`/skills/${params.id}/`, 'put', params)
    },
    getArtificialInfo (id) {
      return apiRequest(`/artificial/`, 'get', { 'robot_skill_id': id })
    },
    addArtificialKeywords (id, params) {
      return apiRequest(`/artificial/?robot_skill_id=${id}`, 'post', params)
    },
    delArtificialKeywords (id, params) {
      return apiRequest(`/artificialdelete/?robot_skill_id=${id}`, 'put', params)
    },
    getExpressWordList (id) {
      return apiRequest(`/express/`, 'get', { 'robot_skill_id': id })
    },
    addExpressWordList (id, params) {
      return apiRequest(`/express/?robot_skill_id=${id}`, 'post', params)
    },
    delExpressWordList (id, params) {
      return apiRequest(`/expressdelete/?robot_skill_id=${id}`, 'put', params)
    },
    getGoodsList (params) {
      return apiRequest(`/goods/`, 'get', params)
    },
    updateGoodInfo (params) {
      return apiRequest(`/goods/${params.id}/`, 'put', params)
    },
    addGood (params) {
      return apiRequest(`/goods/`, 'post', params)
    },
    getArticleList (params) {
      return apiRequest(`/article/`, 'get', params)
    },
    updateArticleInfo (params) {
      return apiRequest(`/article/${params.id}/`, 'put', params)
    },
    addArticle (params) {
      return apiRequest(`/article/`, 'post', params)
    },
    getSalesmanList (params) {
      return apiRequest(`/aicard/`, 'get', params)
    },
    getSalesmanInfo (id) {
      return apiRequest(`/aicard/${id}/`, 'get')
    },
    addSalesman (params) {
      return apiRequest(`/aicard/`, 'post', params)
    },
    updateSalesman (params) {
      return apiRequest(`/aicard/${params.id}/`, 'put', params)
    },
    deleteSalesman (id) {
      let params = {
        id: id,
        is_active: false
      }
      return this.updateSalesman(params)
    },
    getAICardConfig (id) {
      return apiRequest(`/aicardconfig/`, 'get', { robotskill__robot: id })
    },
    addAICardConfig (params) {
      return apiRequest(`/aicardconfig/`, 'post', params)
    },
    delAICardConfig (params) {
      return apiRequest(`/aiconfigdelete/`, 'put', params)
    },
    getSalesmanVisitorUserList (params) {
      return apiRequest(`/aicarduser/`, 'get', params)
    },
    getShareList (params) {
      return apiRequest(`/share/`, 'get', params)
    },
    addShare (params) {
      return apiRequest(`/share/`, 'post', params)
    },
    updateShare (params) {
      return apiRequest(`/share/${params.id}/`, 'put', params)
    },
    delShare (id) {
      return apiRequest(`/share/${id}/`, 'delete')
    },
    getShareUserList (params) {
      return apiRequest(`/shareuser/`, 'get', params)
    },
    getShareUserVisitorList (params) {
      return apiRequest(`/sharevisitor/`, 'get', params)
    },
    getPushInformationSkillList () {
      return apiRequest(`/msgpush/`, 'get')
    },
    updatePushInformationSkillList (params) {
      return apiRequest(`/msgpush/${params.id}/`, 'put', params)
    },
    getActivityList (params) {
      return apiRequest(`/contentlibrary/`, 'get', params)
    },
    addActivity (params) {
      return apiRequest(`/contentlibrary/`, 'post', params)
    },
    updateActivity (params) {
      return apiRequest(`/contentlibrary/${params.id}/`, 'patch', params)
    },
    delActivity (id) {
      let params = {
        id: id,
        is_valid: false
      }
      return this.updateActivity(params)
    }
  },
  home: {
    getActivity (filter_field = 'month') {
      return apiRequest(`/activity/`, 'get', { filter_field })
    },
    getKeyword (filter_field = 'month') {
      return apiRequest(`/keyword/`, 'get', { filter_field })
    },
    getWorthindex (filter_field = 'month') {
      return apiRequest(`/worthindex/`, 'get', { filter_field })
    },
    getVisitStatData (params) {
      return apiRequest(`/data/`, 'get', params)
    },
    getFansStatData (params) {
      return apiRequest(`/fans/`, 'get', params)
    },
    getInteractionStatData (params) {
      return apiRequest(`/interaction/`, 'get', params)
    },
    getInteractionmsgStatData (params) {
      return apiRequest(`/interactionmsg/`, 'get', params)
    },
    getMaterialStatData (params) {
      return apiRequest(`/data2/`, 'get', params)
    },
    getResolveStat () {
      return apiRequest(`/resolve/`, 'get')
    },
    getSumStatData (params) {
      return apiRequest(`/indexdatas/`, 'get', params)
    }
  },
  wechatUser: {
    getWechatUsersList (params) {
      return apiRequest(`/generalusers/`, 'get', params)
    },
    getWechatUserInfo (id) {
      return apiRequest(`/generalusers/${id}/`, 'get')
    },
    getWechatUserHotWord (params) {
      return apiRequest(`/hotsearch/`, 'get', params)
    },
    getWechatUserDialogue (params) {
      return apiRequest(`/dialogue/`, 'get', params)
    }
  },
  setting: {
    updateRobotInfo (params) {
      return apiRequest(`/robot/${params.id}/`, 'put', params)
    },
    delRobotInfo (id) {
      let params = {
        id: id,
        is_validate: false
      }
      return this.updateRobotInfo(params)
    }
  },
  chat: {
    getChatRecordList (params) {
      return apiRequest(`/chatrecord/`, 'get', params)
    },
    updateChatRecord (params) {
      return apiRequest(`/chatrecord/${params.id}/`, 'put', params)
    }
  },
  corpus: {
    /**
     * desc: 得到所有的语料库
     * */
    getAllCorpus () {
      return apiRequest('/corpusbatch/', 'get')
    },
    /**
     * desc: 创建语料库
     * params name: 语料库名字
     * */
    createCorpus (params) {
      return apiRequest('/corpusbatch/', 'post', params)
    },
    delCorpus (id) {
      return apiRequest(`/corpusbatch/${id}/`, 'delete')
    },
    /**
     * desc: 批量上传语料
     * params item: 语料库信息对象
     * params batchfile: 批量上传的文件的url
     * */
    corpusBatch (item, batchfile) {
      return apiRequest(`/corpusbatch/${item.id}/`, 'put', { corpus_batch_name: item.corpus_batch_name, robot: item.robot, batch_file: batchfile, is_sys_batch: item.is_sys_batch })
    },
    /**
     * desc: 得到该语料库下的语料
     * */
    getCorpusObject (params) {
      return apiRequest('/corpusobject/', 'get', params)
    },
    /**
     * desc: 得到单条语料
     * */
    getSingleCorpusObject (id) {
      return apiRequest('/corpusobject/', 'get', { id: id })
    },
    /**
     * desc: 更新语料
     * */
    updateCorpusObject (corpusInfo) {
      return apiRequest(`/corpusobject/${corpusInfo.id}/`, 'put', corpusInfo)
    },
    /**
     * desc: 添加语料
     * */
    addCorpusObject (batchId, corpusInfo) {
      return apiRequest(`/corpusobject/?batch_id=${batchId}`, 'post', corpusInfo)
    },
    delCorpusObject (id) {
      return apiRequest(`/corpusobject/${id}/`, 'delete')
    },
    getMaterialList (corpusid, materialAnswer) {
      let params = {
        material_answer: JSON.stringify(materialAnswer)
      }
      return apiRequest(`/corpusobject/${corpusid}/`, 'get', params)
    }
  },
  user: {
    cancelPraiseAuth () {
      return apiRequest('/praise/cancelauth/', 'get')
    },
    getRobotList () {
      return apiRequest('/robot/', 'get')
    },
    createRobot (params) {
      return apiRequest('/robot/', 'post', params)
    },
    updateMobile (params) {
      return apiRequest('/updatemobile/', 'put', params)
    },
    /**
     * desc: 更新微信公众号信息
     * */
    updateWechatAccounts (data) {
      return apiRequest(`/wechataccounts/${data.id}/`, 'put', data)
    },
    /**
     * desc: 升级/激活机器人
     * params robotId： 机器人ID
     * params code: 激活码
     * */
    upgrade (robotId, code) {
      return apiRequest(`/upgrade/${robotId}/`, 'get', { activation_code: code })
    },
    /**
     * desc: 登入接口
     * params username： 用户名
     * params password: 密码
     * */
    login (username, password) {
      return apiRequest('/api-jwt-auth/', 'post', { username, password })
    },
    /**
     * desc: 发送验证码短信
     * params mobile： 手机号
     * params type: 验证码类型（ null: 注册, reset: 找回密码 ）
     * */
    smscode (mobile, type) {
      let params = {
        mobile
      }
      if (type === 'reset') {
        params.template_code = 'SMS_133080021'
      }
      return apiRequest('/smscode/', 'post', params)
    },
    /**
     * desc: 注册
     * params data： 注册信息
     * */
    reguser (data) {
      return apiRequest('/reguser/', 'post', data)
    },
    /**
     * desc: 修改密码
     * params oldPassword： 旧密码
     * params newPassword： 新密码
     * */
    changepassword (oldPassword, newPassword) {
      return apiRequest(`/changepassword/`, 'put', { old_password: oldPassword, new_password: newPassword })
    },
    /**
     * desc: 找回密码
     * params code： 验证码
     * params password： 新密码
     * params mobile： 手机号
     * */
    resetpassword (code, password, mobile) {
      return apiRequest(`/resetpassword/`, 'put', { code, password, mobile })
    },
    /**
     * desc: 得到用户信息
     * */
    getUserInfo () {
      return apiRequest(`/userprofile/`, 'get')
    },
    /**
     * desc: 更新用户信息
     * */
    updateUserInfo (data) {
      return apiRequest(`/userprofile/${data.id}/`, 'patch', data)
    }
  },
  robot: {
    /**
     * desc: 得到所有的语料库
     * */
    getAllCorpus () {
      return apiRequest('/corpusbatch/', 'get')
    },
    /**
     * desc: 创建语料库
     * params name: 语料库名字
     * */
    createCorpus (parmas) {
      return apiRequest('/corpusbatch/', 'post', parmas)
    },
    /**
     * desc: 批量上传语料
     * params item: 语料库信息对象
     * params batchfile: 批量上传的文件的url
     * */
    corpusBatch (item, batchfile) {
      return apiRequest(`/corpusbatch/${item.id}/`, 'put', { corpus_batch_name: item.corpus_batch_name, robot: item.robot, batch_file: batchfile, is_sys_batch: item.is_sys_batch })
    },
    /**
     * desc: 删除语料库
     * params batchId: 语料库id
     * */
    delCorpus (batchId) {
      return apiRequest(`/corpusbatch/`, 'delete', { 'batch_id': batchId })
    },
    /**
     * desc: 得到该语料库下的语料
     * */
    getCorpusObject (params) {
      return apiRequest('/corpusobject/', 'get', params)
    },
    /**
     * desc: 更新语料
     * */
    updateCorpusObject (params) {
      return apiRequest(`/corpusobject/${params.id}/`, 'patch', params)
    },
    /**
     * desc: 添加语料
     * */
    addCorpusObject (params) {
      return apiRequest(`/corpusobject/`, 'post', params)
    },
    /**
     * desc: 删除语料
     * */
    delCorpusObject (ids) {
      return apiRequest(`/corpusobject/`, 'delete', { id: ids })
    },
    /**
     * desc: 得到转人工客服配置信息
     * params wechatId: 微信公众号id
     * */
    getchatbotconfig (wechatId) {
      return apiRequest('/chatbotconfig/', 'get', { wechat_account: wechatId })
    },
    /**
     * desc: 更新转人工客服配置信息
     * */
    updatechatbotconfig (params) {
      return apiRequest(`/chatbotconfig/${params.id}/`, 'patch', params)
    },
    /**
     * desc: 得到补偿性回复选项数据
     * */
    getautoreplytype () {
      return apiRequest('/autoreplytype/', 'get')
    },
    /**
     * desc: 得到补偿性回复配置
     * */
    getautoreplyconfig () {
      return apiRequest('/autoreplyconfig/', 'get')
    },
    /**
     * desc: 更新补偿性回复配置
     * */
    updateautoreplyconfig (data) {
      return apiRequest(`/autoreplyconfig/${data.id}/`, 'patch', data)
    },
    /**
     * desc: 创建补偿性回复配置
     * */
    createautoreplyconfig (data) {
      return apiRequest(`/autoreplyconfig/`, 'post', data)
    },
    /**
     * desc: 得到店铺商品列表
     * */
    getpraisegoods (data) {
      return apiRequest(`/praisegoods/`, 'get', data)
    },
    /**
     * desc: 得到忽略词列表
     * */
    getBanWordList (userid) {
      return apiRequest(`/banword/`, 'get', { user: userid })
    },
    /**
     * desc: 添加忽略词
     * params keyword: 忽略词
     * params endTime: 有效期，空为永久,
     * params userid: 用户id
     * */
    addBanWord (keyword, endTime, userid) {
      var params = {
        ban_word: keyword,
        user: userid
      }
      if (endTime) {
        params.end_time = endTime
      }
      return apiRequest(`/banword/`, 'post', params)
    },
    /**
     * desc: 删除忽略词
     * params id: 忽略词id
     * */
    delBanWord (id) {
      return apiRequest(`/banword/${id}/`, 'delete')
    }
  }
}
