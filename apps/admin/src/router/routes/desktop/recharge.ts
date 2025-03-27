import type { RouteRecordRaw } from 'vue-router'

const recharge: RouteRecordRaw[] = [
  {
    path: 'recharge/all',
    name: 'AllRecharge',
    component: () => import('@desktop/pages/recharge/index.vue'),
  },
  {
    path: 'recharge/today',
    name: 'TodayRecharge',
    component: () => import('@desktop/pages/recharge/today.vue'),
  },
  {
    path: 'recharge/admin',
    name: 'AdminRecharge',
    component: () => import('@desktop/pages/recharge/admin.vue'),
  },
]

export default recharge
