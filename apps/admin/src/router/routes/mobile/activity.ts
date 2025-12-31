import type { RouteRecordRaw } from 'vue-router'

export const activities: RouteRecordRaw[] = [
  {
    path: 'activity',
    name: 'officalActivityPage',
    component: () => import('@mobile/pages/activity/index.vue'),
  },
  {
    path: 'activity/recharge',
    name: 'officalActivityRecharge',
    component: () => import('@mobile/pages/activity/recharge.vue'),
  },
]
