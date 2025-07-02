import type { RouteRecordRaw } from 'vue-router'

const users: RouteRecordRaw[] = [
  {
    path: 'users',
    name: 'AllUser',
    component: () => import('@mobile/pages/users/index.vue'),
  },
  {
    path: 'users/level',
    name: 'AllLevel',
    component: () => import('@mobile/pages/users/level.vue'),
  },
  {
    path: 'users/paid',
    name: 'AllPaid',
    component: () => import('@mobile/pages/users/paid.vue'),
  },
]

export default users
