import type { RouteRecordRaw } from 'vue-router'

const auth: RouteRecordRaw[] = [
  {
    path: '/auth',
    name: 'AuthDesktop',
    component: () => import('@auth/desktop01.vue'),
    meta: {
      isAuth: true,
    },
  },
  {
    path: '/auth/key',
    name: 'AuthDesktopKey',
    component: () => import('@auth/desktop02.vue'),
    meta: {
      isAuth: true,
    },
  },
  {
    path: '/auth-code',
    name: 'AuthByCode',
    component: () => import('@auth/AuthByCode.vue'),
    meta: {
      isAuth: true,
      force: true,
    },
  },
  {
    path: '/m/auth-code',
    name: 'AuthByCodeMobile',
    component: () => import('@auth/AuthByCode.vue'),
    meta: {
      isAuth: true,
      force: true,
    },
  },
  {
    path: '/m/auth',
    name: 'AuthMobile',
    component: () => import('@auth/mobile01.vue'),
    meta: {
      isAuth: true,
    },
  },
  {
    path: '/m/auth/key',
    name: 'AuthMobileKey',
    component: () => import('@auth/mobile02.vue'),
    meta: {
      isAuth: true,
    },
  },
]

export default auth
