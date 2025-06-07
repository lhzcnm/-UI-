import type { RouteRecordRaw } from 'vue-router'

const orders: RouteRecordRaw[] = [
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@desktop/pages/orders/index.vue'),
  },
  {
    path: '/orders/verify',
    name: 'OrdersVerify',
    component: () => import('@desktop/pages/orders/verify.vue'),
  },
]

export default orders
