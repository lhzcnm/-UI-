import type { RouteRecordRaw } from 'vue-router'

const quotations: RouteRecordRaw[] = [
  {
    path: 'quotations',
    name: 'QuotaitonsIndex',
    component: () => import('@desktop/pages/quotation/index.vue'),
  },
  {
    path: 'quotations/remarks',
    name: 'QuotationsRemarks',
    component: () => import('@desktop/pages/quotation/remarks.vue'),
  },
]

export default quotations
