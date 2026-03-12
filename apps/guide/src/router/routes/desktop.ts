import type { RouteRecordRaw } from 'vue-router'

const guide: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'desktop',
    component: () => import('@client/index.vue'),
  },
  {
    path: '/admin',
    name: '/admin',
    component: () => import('@admin/index.vue'),
  },
]

export default guide