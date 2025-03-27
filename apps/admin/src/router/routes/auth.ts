import type { RouteRecordRaw } from 'vue-router'

const auth: RouteRecordRaw[] = [
  {
    path: '/auth',
    name: 'AuthDesktop',
    component: () => import('@auth/desktop01.vue'),
  },
  {
    path: '/auth/key',
    name: 'AuthDesktopKey',
    component: () => import('@auth/desktop02.vue'),
  },
  {
    path: '/m/auth',
    name: 'AuthMobile',
    component: () => import('@auth/mobile01.vue'),
  },
  {
    path: '/m/auth/key',
    name: 'AuthMobileKey',
    component: () => import('@auth/mobile02.vue'),
  },
]

export default auth
