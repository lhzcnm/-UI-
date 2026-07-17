import type { RouteRecordRaw } from 'vue-router'

const tools: RouteRecordRaw[] = [
  {
    path: 'editor/:type?/:code?',
    name: 'Editor',
    component: () => import('@desktop/pages/editor/index.vue'),
  },
  {
    path: 'batch-edit-orders',
    name: 'BatchEditOrders',
    component: () => import('@desktop/pages/orders-edit/index.vue'),
  },
]

export default tools
