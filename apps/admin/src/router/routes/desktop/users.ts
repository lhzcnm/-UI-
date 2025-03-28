import type { RouteRecordRaw } from 'vue-router'

const users: RouteRecordRaw[] = [
  {
    path: 'users/all',
    name: 'AllUser',
    component: () => import('@desktop/pages/users/index.vue'),
  },
  {
    path: 'users/admin',
    name: 'AllAdmin',
    component: () => import('@desktop/pages/users/admin.vue'),
  },
  {
    path: 'users/level',
    name: 'AllLevel',
    component: () => import('@desktop/pages/users/level.vue'),
  },
  {
    path: 'users/paid',
    name: 'AllPaid',
    component: () => import('@desktop/pages/users/paid.vue'),
  },
]

export default users

