import type { RouteRecordRaw } from 'vue-router'

const recharge: RouteRecordRaw[] = [
  {
    path: 'recharge',
    name: 'Recharge',
    component: () => import('@desktop/pages/recharge/index.vue'),
  },
  {
    path: 'recharge/packages',
    name: 'RechargePackages',
    component: () => import('@desktop/pages/recharge/packages.vue'),
  },
]

export default recharge
