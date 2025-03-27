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
      path: 'order',
      name: 'Order',
      component: () => import('@mobile/pages/order/index.vue'),
    },
  ],
}

export default mobile
