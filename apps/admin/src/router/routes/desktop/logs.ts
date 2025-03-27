import type { RouteRecordRaw } from 'vue-router'

const logs: RouteRecordRaw[] = [
  {
    path: 'logs/user',
    name: 'UserLog',
    component: () => import('@desktop/pages/logs/user.vue'),
  },
  {
    path: 'logs/admin',
    name: 'AdminLog',
    component: () => import('@desktop/pages/logs/admin.vue'),
  },
]

export default logs
