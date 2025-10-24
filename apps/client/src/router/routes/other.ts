import type { RouteRecordRaw } from 'vue-router'

const other: RouteRecordRaw[] = [
  {
    path: '/scan',
    name: 'ScanCode',
    component: () => import('@/modules/other/ScanCode.vue'),
  },
  {
    path: '/service/:id(\\d{4})',
    name: 'ServiceInfo',
    component: () => import('@/modules/other/ServiceInfo.vue'),
    props: true,
  },
  {
    path: '/orderDetail',
    name: 'OrderInfo',
    component: () => import('@/modules/other/OrderInfo.vue'),
  },
  {
    path: '/quote',
    name: 'quote',
    component: () => import('@desktop/pages/quote/index.vue'),
  }
]

export default other
