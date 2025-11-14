import type { RouteRecordRaw } from 'vue-router'

const quotations: RouteRecordRaw[] = [
  {
    path: 'quotations/feiyang',
    name: 'QuotaitonsFeiyang',
    component: () => import('@desktop/pages/quotation/feiyang.vue'),
  },
  {
    path: 'quotations/hk',
    name: 'QuotaitonsHk',
    component: () => import('@desktop/pages/quotation/hk.vue'),
  },
  {
    path: 'quotations/hqb',
    name: 'QuotaitonsHqb',
    component: () => import('@desktop/pages/quotation/hqb.vue'),
  },
]

export default quotations
