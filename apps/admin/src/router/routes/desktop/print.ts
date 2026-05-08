import type { RouteRecordRaw } from 'vue-router'

const print: RouteRecordRaw[] = [
  { 
    path: 'print/service',
    name: 'ServiceTemplate',
    component: () => import('@desktop/pages/print/service.vue'),
   },
  { 
    path: 'print/device',
    name: 'DeviceTemplate',
    component: () => import('@desktop/pages/print/device.vue'),
   },
]

export default print
