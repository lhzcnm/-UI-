import type { RouteRecordRaw } from 'vue-router'

const recharge: RouteRecordRaw[] = [
  {
    path: 'recharge',
    name: 'Recharge',
    component: () => import('@mobile/pages/recharge/index.vue'),
  },
  {
    path: 'recharge/packages',
    name: 'RechargePackages',
    component: () => import('@mobile/pages/recharge/packages.vue'),
  },
]

export default recharge
