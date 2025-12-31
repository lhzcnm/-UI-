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
  // {
  //   path: 'recharge/activity',
  //   name: 'Rechargeactivity',
  //   component: () => import('@desktop/pages/recharge/activity.vue'),
  // },
]

export default recharge
