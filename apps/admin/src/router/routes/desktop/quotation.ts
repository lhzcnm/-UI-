import type { RouteRecordRaw } from 'vue-router'

const quotaitons: RouteRecordRaw[] = [
  {
    path: 'quotaitons',
    name: 'Quotaitons',
    component: () => import('@desktop/pages/quotation/index.vue'),
  },
  {
    path: 'quotaitons/new',
    name: 'QuotaitonsNew',
    component: () => import('@desktop/pages/quotation/new.vue'),
  },
  {
    path: 'quotaitons/type',
    name: 'QuotaitonsType',
    component: () => import('@desktop/pages/quotation/type.vue'),
  },
]

export default quotaitons
