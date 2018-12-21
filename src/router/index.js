/**
 * 路由自定义参数说明
 * 侧边栏自动根据路由生成（当可见children列表不超过1条时，仅展示一级菜单，否则自动展示两级菜单）
 * hidden: 是否在侧边栏展示该路由
 * meta title: 面包屑标题展示，当为字符串时直接展示，也可为对象，对象形式{ default: [默认展示标题], [行业ID]: [该行业的定制名称] }
 * meta noAuth: 布尔类型，true表示不需要登入就可进入的页面
 * meta noRobot: 布尔类型，true表示不需要创建机器人就可进入的页面
 * meta icon: 侧边栏展示的icon图标
 * meta breadcrumb: 新加的面包屑，项目默认只展示当前页面一层面包屑，如需多层面包屑，需添加此字段 [{ title: [面包屑名称], path: [该面包屑跳转链接] }]
 * meta version: 版本控制，该数值为数组，如当前版本不再这个数组中，则不加入该路由，需要判定版本的路由需加入到authRouters处
 * */
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

let basicRouters = [
  {
    path: '/login',
    name: 'Login',
    meta: { title: '登录', noAuth: true },
    hidden: true,
    component: () => import('@/views/user/Login')
  },
  {
    path: '/login/:inviteCode',
    meta: { title: '登录', noAuth: true },
    hidden: true,
    component: () => import('@/views/user/Login')
  },
  {
    path: '/guide',
    name: 'Guide',
    meta: { title: '引导', noAuth: true },
    hidden: true,
    component: () => import('@/views/user/Guide')
  },
  {
    path: '/',
    hidden: true,
    redirect: '/home/info'
  },
  {
    path: '/home',
    name: 'Home',
    redirect: '/home/info',
    meta: { title: '首页' },
    component: () => import('@/views/Home'),
    children: [
      {
        path: 'info',
        meta: { title: '首页', icon: 'iconfont icon-shouye icon-big', noRobot: true },
        component: () => import('@/views/homePage/index')
      }
    ]
  },
  {
    path: '/corpus',
    name: 'Corpus',
    meta: { title: '智能问答' },
    component: () => import('@/views/Home'),
    children: [
      {
        path: 'index',
        meta: { title: '智能问答', icon: 'iconfont icon-zhinengwenda' },
        component: () => import('@/views/corpus/Corpus')
      }
    ]
  },
  {
    path: '/chat',
    name: 'Chat',
    meta: { title: '聊天日志' },
    component: () => import('@/views/Home'),
    children: [
      {
        path: 'list',
        meta: { title: '聊天日志', icon: 'iconfont icon-rizhi icon-big' },
        component: () => import('@/views/chat/Record')
      }
    ]
  },
  {
    path: '/wechatUser',
    name: 'WechatUser',
    meta: { title: '客户分析' },
    component: () => import('@/views/Home'),
    children: [
      {
        path: 'list',
        meta: { title: '用户分析', icon: 'iconfont icon-kehu' },
        component: () => import('@/views/wechatUser/List')
      },
      {
        path: 'detail/:id',
        hidden: true,
        meta: { title: '用户画像', icon: 'iconfont icon-kehu', breadcrumb: [{ title: '用户分析', path: '/wechatUser/list' }] },
        component: () => import('@/views/wechatUser/Detail')
      }
    ]
  },
  {
    path: '/skill',
    name: 'Skill',
    meta: { title: 'AI技能' },
    component: () => import('@/views/Home'),
    children: [
      {
        path: 'list',
        meta: { title: 'AI技能', icon: 'iconfont icon-jinenghui icon-small' },
        component: () => import('@/views/skill/List')
      },
      {
        path: 'staffService',
        meta: { title: '客服转接', breadcrumb: [{ title: 'AI技能', path: '/skill/list' }] },
        hidden: true,
        component: () => import('@/views/skill/StaffService')
      },
      {
        path: 'express',
        meta: { title: '快递查询', breadcrumb: [{ title: 'AI技能', path: '/skill/list' }] },
        hidden: true,
        component: () => import('@/views/skill/Express')
      },
      {
        path: 'article',
        meta: { title: '文章检索', breadcrumb: [{ title: 'AI技能', path: '/skill/list' }] },
        hidden: true,
        component: () => import('@/views/skill/Article')
      },
      {
        path: 'corpus',
        hidden: true,
        meta: { title: '智能问答', breadcrumb: [{ title: 'AI技能', path: '/skill/list' }] },
        component: () => import('@/views/corpus/Corpus')
      },
      {
        path: 'reply',
        hidden: true,
        meta: { title: '补偿性回复', breadcrumb: [{ title: 'AI技能', path: '/skill/list' }] },
        component: () => import('@/views/skill/Reply')
      },
      {
        path: 'pushInformation/list',
        hidden: true,
        meta: { title: '智能消息推送', breadcrumb: [{ title: 'AI技能', path: '/skill/list' }] },
        component: () => import('@/views/skill/pushInformation/List')
      },
      {
        path: 'activity/list',
        hidden: true,
        meta: { title: '活动推广', breadcrumb: [{ title: 'AI技能', path: '/skill/list' }] },
        component: () => import('@/views/skill/activity/ActivityList')
      },
      {
        path: 'salesman/list',
        hidden: true,
        meta: { title: '电子名片', breadcrumb: [{ title: 'AI技能', path: '/skill/list' }] },
        component: () => import('@/views/skill/salesman/List')
      },
      {
        path: 'salesman/add',
        hidden: true,
        meta: { title: '添加名片', breadcrumb: [{ title: 'AI技能', path: '/skill/list' }, { title: '电子名片', path: '/skill/salesman/list' }] },
        component: () => import('@/views/skill/salesman/AddSalesman')
      },
      {
        path: 'salesman/add/:id',
        hidden: true,
        meta: { title: '编辑名片', breadcrumb: [{ title: 'AI技能', path: '/skill/list' }, { title: '电子名片', path: '/skill/salesman/list' }] },
        component: () => import('@/views/skill/salesman/AddSalesman')
      },
      {
        path: 'salesman/visitor/:id',
        hidden: true,
        meta: { title: '访客列表', breadcrumb: [{ title: 'AI技能', path: '/skill/list' }, { title: '电子名片', path: '/skill/salesman/list' }] },
        component: () => import('@/views/skill/salesman/VisitorList')
      },
      {
        path: 'share/list',
        hidden: true,
        meta: { title: '分享激励', breadcrumb: [{ title: 'AI技能', path: '/skill/list' }] },
        component: () => import('@/views/skill/share/List')
      },
      {
        path: 'share/visitor/:id',
        hidden: true,
        meta: { title: '访客列表', breadcrumb: [{ title: 'AI技能', path: '/skill/list' }, { title: '分享激励', path: '/skill/share/list' }] },
        component: () => import('@/views/skill/share/VisitorList')
      },
      {
        path: 'share/shareUser/:id',
        hidden: true,
        meta: { title: '分享用户列表', breadcrumb: [{ title: 'AI技能', path: '/skill/list' }, { title: '分享激励', path: '/skill/share/list' }] },
        component: () => import('@/views/skill/share/ShareUserList')
      }
    ]
  },
  {
    path: '/setting',
    name: 'Setting',
    meta: { title: '设置' },
    component: () => import('@/views/Home'),
    children: [
      {
        path: 'index',
        meta: { title: '设置', icon: 'iconfont icon-shezhi' },
        component: () => import('@/views/setting')
      }
    ]
  },
  {
    path: '/user',
    name: 'User',
    meta: { title: '用户' },
    hidden: true,
    component: () => import('@/views/Home'),
    children: [
      {
        path: 'robot',
        meta: { title: '我的机器人', icon: 'iconfont icon-kehu', hiddenAside: true, noRobot: true, breadcrumb: [{ title: '首页', path: '/' }] },
        component: () => import('@/views/user/Robot')
      },
      {
        path: 'oneself',
        meta: { title: '个人中心', icon: 'iconfont icon-kehu', hiddenAside: true, noRobot: true, breadcrumb: [{ title: '首页', path: '/' }] },
        component: () => import('@/views/user/oneselfCenter')
      }
    ]
  },
  {
    path: '*',
    hidden: true,
    redirect: '/'
  }
]

export default new Router({
  mode: 'history',
  routes: basicRouters
})

export const authRouters = [
  {
    path: '/skill',
    name: 'Skill',
    meta: { title: 'AI技能' },
    component: () => import('@/views/Home'),
    children: [
      {
        path: 'store',
        meta: { title: { default: '品牌推荐', 1: '微主页' }, version: [1, 2], breadcrumb: [{ title: 'AI技能', path: '/skill/list' }] },
        hidden: true,
        component: () => import('@/views/skill/Store')
      },
      {
        path: 'addStore',
        meta: { title: '添加微主页', version: [1, 2], breadcrumb: [{ title: 'AI技能', path: '/skill/list' }, { title: { default: '品牌推荐', 1: '微主页' }, path: '/skill/store' }] },
        hidden: true,
        component: () => import('@/views/skill/StoreAdd')
      },
      {
        path: 'addStore/:id',
        meta: { title: '编辑微主页', version: [1, 2], breadcrumb: [{ title: 'AI技能', path: '/skill/list' }, { title: { default: '品牌推荐', 1: '微主页' }, path: '/skill/store' }] },
        hidden: true,
        component: () => import('@/views/skill/StoreAdd')
      },
      {
        path: 'good',
        meta: { title: { default: '商品推荐', 1: '户型推荐' }, version: [1, 2], breadcrumb: [{ title: 'AI技能', path: '/skill/list' }] },
        hidden: true,
        component: () => import('@/views/skill/Good')
      }
    ]
  }
]
