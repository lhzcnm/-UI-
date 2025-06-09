import type { RouteRecordRaw } from 'vue-router'

import users    from './desktop/users'
import service  from './desktop/service'
import wechat   from './desktop/wechat'
import orders   from './desktop/orders'
import tools    from './desktop/tools'

const desktop: RouteRecordRaw = {
  path: '/',
  name: 'Desktop',
  redirect: '/dashboard',
  component: () => import('@desktop/index.vue'),
  children: [
    ...users,
    ...service,
    ...wechat,
    ...orders,
    ...tools,
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
      path: 'recharge',
      name: 'Recharge',
      component: () => import('@desktop/pages/recharge/index.vue'),
    },
    {
      path: 'upstream',
      name: 'Upstream',
      component: () => import('@desktop/pages/upstream/index.vue'),
    },
    {
      path: 'intercept',
      name: 'Intercept',
      component: () => import('@desktop/pages/intercept/index.vue'),
    },
    {
      path: 'logs',
      name: 'Logs',
      component: () => import('@desktop/pages/logs/index.vue'),
    },
    {
      path: 'credits',
      name: 'Credits',
      component: () => import('@desktop/pages/credits/index.vue'),
    },
  ],
}

export default desktop
