import type { RouteRecordRaw } from 'vue-router'

const guide: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'desktop',
    component: () => import('@client/desktop.vue'),
  },
  {
    path: '/admin',
    name: '/admin',
    component: () => import('@admin/desktop.vue'),
  },
]

export default guide
