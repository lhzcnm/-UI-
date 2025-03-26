import type { RouteRecordRaw } from 'vue-router'

const desktop: RouteRecordRaw = {
  path: '/',
  component: () => import('@/modules/desktop/index.vue'),
  children: [
    {
      path: 'auth',
      name: 'Auth',
      component: () => import('@desktop/pages/auth/index.vue'),
    },
    {
      path: 'auth/key',
      name: 'AuthKey',
      component: () => import('@desktop/pages/auth/index02.vue'),
    },
    {
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@desktop/pages/dashboard/index.vue'),
    },
  ],
}

export default desktop
