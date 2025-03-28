import type { RouteRecordRaw } from 'vue-router'

import users    from './desktop/users'
import orders   from './desktop/orders'
import service  from './desktop/service'
import recharge from './desktop/recharge'
import logs     from './desktop/logs'
import wechart  from './desktop/wechart'

const desktop: RouteRecordRaw = {
  path: '/',
  name: 'Desktop',
  redirect: '/dashboard',
  component: () => import('@desktop/index.vue'),
  children: [
    ...orders,
    ...users,
    ...service,
    ...recharge,
    ...wechart,
    ...logs,
    {
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@desktop/pages/dashboard/index.vue'),
    },
    {
      path: 'tickets',
      name: 'Tickets',
      component: () => import('@desktop/pages/tickets/index.vue'),
    },
    {
      path: 'interface',
      name: 'Interface',
      component: () => import('@desktop/pages/interface/index.vue'),
    },
    {
      path: 'intercept',
      name: 'Intercept',
      component: () => import('@desktop/pages/intercept/index.vue'),
    },
  ],
}

export default desktop
