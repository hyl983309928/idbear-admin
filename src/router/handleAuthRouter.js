import store from '../store'
import router, {authRouters} from './index'
import { deepCopy } from '../utils/common'

export function handleAuthRouters () {
  let routerlist = deepCopy(authRouters)
  let routers = routerlist.map((item) => {
    if (item.children) {
      item.children = item.children.filter((childrenItem) => {
        return childrenItem.meta.version.indexOf(store.getters.nowRobotInfo.version) !== -1
      })
    }
    return item
  })
  router.addRoutes(routers)
}
