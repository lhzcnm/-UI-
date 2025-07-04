import type { RouteRecordRaw } from 'vue-router'

const service: RouteRecordRaw[] = [
  {
    path: 'service/groups',
    name: 'AllGroup',
    component: () => import('@mobile/pages/service/groups.vue'),
  },
  {
    path: 'service/items',
    name: 'AllItem',
    component: () => import('@mobile/pages/service/items.vue'),
  },
  {
    path: 'service/fields',
    name: 'AllField',
    component: () => import('@mobile/pages/service/fields.vue'),
  },
  {
    path: 'service/unlock',
    name: 'Unlock',
    component: () => import('@mobile/pages/service/unlock.vue'),
  },
]

export default service
