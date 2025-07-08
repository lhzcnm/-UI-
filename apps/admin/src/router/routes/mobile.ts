import type { RouteRecordRaw } from 'vue-router'

import users from './mobile/users'
import service from './mobile/service'
import orders from './mobile/orders'

const mobile: RouteRecordRaw = {
  path: '/m',
  name: 'Mobile',
  redirect: '/m/dashboard',
  component: () => import('@mobile/index.vue'),
  children: [
    ...users,
    ...service,
    ...orders,
    {
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@mobile/pages/dashboard/index.vue'),
    },
  ],
}

export default mobile
