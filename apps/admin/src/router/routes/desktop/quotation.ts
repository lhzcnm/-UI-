import type { RouteRecordRaw } from 'vue-router'

const quotations: RouteRecordRaw[] = [
  {
    path: 'quotations',
    name: 'QuotaitonsFeiyang',
    component: () => import('@desktop/pages/quotation/index.vue'),
  },
]

export default quotations
