import type { RouteRecordRaw } from 'vue-router'

const orders: RouteRecordRaw[] = [
  {
    path: '/orders/all',
    name: 'OrderAll',
    component: () => import('@desktop/pages/orders/index.vue'),
  },
  {
    path: '/orders/verify',
    name: 'OrderVerify',
    component: () => import('@desktop/pages/orders/verify.vue'),
  },
  {
    path: '/orders/pending',
    name: 'OrderPending',
    component: () => import('@desktop/pages/orders/pending.vue'),
  },
  {
    path: '/orders/processing',
    name: 'OrderProcessing',
    component: () => import('@desktop/pages/orders/processing.vue'),
  },
]

export default orders
