import type { RouteRecordRaw } from 'vue-router'

const service: RouteRecordRaw[] = [
  {
    path: 'service/groups',
    name: 'AllGroup',
    component: () => import('@desktop/pages/service/groups.vue'),
  },
  {
    path: 'service/items',
    name: 'AllItem',
    component: () => import('@desktop/pages/service/items.vue'),
  },
  {
    path: 'service/fields',
    name: 'AllField',
    component: () => import('@desktop/pages/service/fields.vue'),
  },
]

export default service
