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
  {
    path: 'service/unlock',
    name: 'Unlock',
    component: () => import('@desktop/pages/service/unlock.vue'),
  },
  {
    path: 'service/template',
    name: 'ServiceTemplate',
    component: () => import('@desktop/pages/service/template.vue'),
  },
]

export default service
