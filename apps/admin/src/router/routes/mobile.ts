import type { RouteRecordRaw } from 'vue-router'

const mobile: RouteRecordRaw = {
  path: '/m',
  name: 'Mobile',
  component: () => import('@mobile/index.vue'),
  children: [
    {
      path: 'auth',
      name: 'Auth',
      component: () => import('@auth/mobile01.vue'),
    },
    {
      path: 'auth/key',
      name: 'AuthKey',
      component: () => import('@auth/mobile02.vue'),
    },
    {
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@mobile/pages/dashboard/index.vue'),
    },
    {
      path: 'history',
      name: 'History',
      component: () => import('@mobile/pages/history/index.vue'),
    },
  ],
}

export default mobile
