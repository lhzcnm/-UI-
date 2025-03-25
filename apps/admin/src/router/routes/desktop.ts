import type { RouteRecordRaw } from 'vue-router'

const desktop: RouteRecordRaw = {
  path: '/',
  component: () => import('@/modules/desktop/index.vue'),
  children: [
    {
      path: 'dashboard',
      component: () => import('@desktop/pages/dashboard/index.vue'),
    },
  ],
}

export default desktop
