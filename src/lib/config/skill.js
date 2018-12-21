import { list2map } from '@/utils/common'
import { colorCompany } from '@/style/variate'
export const skillList = [
  {id: 1, title: '智能问答', link: '/skill/corpus', version: [], info: {}, countLabel: '共计[count]个回答', countName: 'count_sum', icon: 'iconfont icon-zhinengwenda', iconColor: colorCompany.blue, desc: '添加常见问题实现24h客服', detail: '', homeTip: '添加常用问答，实现7*24h智能客服，提升服务效率'},
  {id: 2, title: '客服转接', link: '/skill/staffService', version: [], info: {}, countLabel: '共计[count]个关键词或图片', countName: 'artificial_sum', icon: 'iconfont icon-kefu', iconColor: colorCompany.blue, desc: '添加关键词可以通知人工客服', detail: '只要用户呼叫中包含这些关键词或图片就通知客服，目前仅支持微信公众号客服系统', homeTip: '添加关键词或图片，直达人工客服，把握重要活动和客户'},
  {id: 3, title: '快递查询', link: '/skill/express', version: [], info: {}, countLabel: '共计[count]个关键词', countName: 'express_sum', icon: 'iconfont icon-huoche1-copy', iconColor: colorCompany.blue, desc: '添加关键词可以查询快递进程', detail: '只要用户呼叫中包含这些关键词就查询快递，目前只适用于开通有赞店铺的客户', homeTip: '添加关键词，用户输入关键词可实时查看订单物流状态'},
  {id: 4, title: '闲聊', link: '', info: {}, version: [], countLabel: '已接入通用知识图谱', countName: 'count', icon: 'iconfont icon-weixinliaotian', iconColor: colorCompany.blue, desc: '模拟人与人之间的谈话', detail: '', homeTip: ''},
  {id: 5, title: '品牌推荐', link: '/skill/store', version: [2], info: {}, countLabel: '共计[count]个品牌', countName: 'store_sum', icon: 'iconfont icon-dianpu-', iconColor: colorCompany.yellow, desc: '添加你想要推荐的品牌', detail: '', homeTip: '添加想要你推荐品牌，提升购物体验'},
  {id: 6, title: '商品推荐', link: '/skill/good', version: [2], info: {}, countLabel: '共计[count]个商品', countName: 'praise_good_sum', icon: 'iconfont icon-tuijian1', iconColor: colorCompany.green, desc: '添加你想要推荐的商品', detail: '', homeTip: '添加想要你推荐的商品，提升销售转化率'},
  {id: 7, title: '文章检索', link: '/skill/article', version: [], info: {}, countLabel: '共计[count]个文章', countName: 'infomation_sum', icon: 'iconfont icon-chazhaowenjian', iconColor: colorCompany.yellow, desc: '添加你想要推荐的微信文章', detail: '', homeTip: '添加公众号或外部文章，实现智能语音搜索，提升文章阅读量'},
  {id: 8, title: '补偿性回复', link: '/skill/reply', version: [], info: {}, countLabel: '共计[count]个回复', countName: 'final_reply_count', icon: 'iconfont icon-buchangxinghuifu', iconColor: colorCompany.blue, desc: '添加一些不常见问题的回复', detail: '当用户的消息得不到回答或搜不到想要的产品或服务时，可以随机回复一个答案机智应对哦！', homeTip: '当用户的消息得不到回答或搜不到想要的产品或服务时，可以添加一些回复机智应对哦！'},
  {id: 9, title: '活动推广', link: '/skill/activity/list', version: [2], info: {}, countLabel: '已有[count]人参与活动', countName: 'activity_sum', icon: 'iconfont icon-huodong', iconColor: colorCompany.green, desc: '推广正在进行活动的相关信息', detail: '在设定的时间区间内，可以实时通过语音文字互动，告知正在进行的活动内容信息。', homeTip: ''},
  {id: 10, title: '智能消息推送', link: '/skill/pushInformation/list', version: [2], info: {}, countLabel: '已推送[count]人次', countName: 'msgs_sum', icon: 'iconfont icon-icon-dxfs', iconColor: colorCompany.green, desc: '激活公众号粉丝活跃度', detail: '开启此功能，可向公众号的活跃用户，推送个性化消息，不断激活公众号粉丝活跃度。', homeTip: ''},
  {id: 11, title: 'AI电子名片', link: '/skill/salesman/list', version: [2], info: {}, countLabel: '已创建[count]张名片', countName: 'ai_card_count', icon: 'iconfont icon-mingpian', iconColor: colorCompany.green, desc: '创建销售员自己的AI电子名片', detail: '创建AI电子名片，让每一个伙伴都有一个私人AI 助手，通过发名片，获取和追踪价值客户', homeTip: ''},
  {id: 12, title: '分享激励', link: '/skill/share/list', version: [2], info: {}, countLabel: '已有[count]人参与分享', countName: 'share_count', icon: 'iconfont icon-gift', iconColor: colorCompany.green, desc: '通过分享激励，提升曝光率', detail: '通过分享激励，使访客成为有效传播者，进而获取和追踪更多有价值的潜在客户', homeTip: ''}
]

export const skillMap = list2map(skillList, 'id')
