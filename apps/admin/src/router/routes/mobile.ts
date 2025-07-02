import type { RouteRecordRaw } from 'vue-router'

const mobile: RouteRecordRaw = {
  path: '/m',
  name: 'Mobile',
  redirect: '/m/dashboard',
  component: () => import('@mobile/index.vue'),
  children: [
    {
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@mobile/pages/dashboard/index.vue'),
    },
    {
      path: 'orders',
      name: 'Orders',
      component: () => import('@mobile/pages/orders/index.vue'),
    },
  ],
}

export default mobile
