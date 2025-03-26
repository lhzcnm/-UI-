import type { RouteRecordRaw } from 'vue-router'

const desktop: RouteRecordRaw = {
  path: '/',
  component: () => import('@/modules/desktop/index.vue'),
  children: [
    {
      path: 'auth',
      name: 'Auth',
      component: () => import('@auth/desktop01.vue'),
    },
    {
      path: 'auth/key',
      name: 'AuthKey',
      component: () => import('@auth/desktop02.vue'),
    },
    {
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@desktop/pages/dashboard/index.vue'),
    },
  ],
}

export default desktop
