import type { RouteRecordRaw } from 'vue-router'

const guideMobile: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'mibile',
    component: () => import('@client/mobile.vue'),
  },
  {
    path: '/admin',
    name: '/admin',
    component: () => import('@admin/mobile.vue'),
  },
]

export default guideMobile
