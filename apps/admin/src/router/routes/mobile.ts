import type { RouteRecordRaw } from 'vue-router'

const mobile: RouteRecordRaw = {
  path: '/m',
  name: 'Mobile',
  component: () => import('@mobile/index.vue'),
  children: [
    {
      path: 'auth',
      name: 'Auth',
      component: () => import('@mobile/pages/auth/index.vue'),
    },
  ],
}

export default mobile
