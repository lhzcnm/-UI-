import type { RouteRecordRaw } from 'vue-router'

const activities: RouteRecordRaw[] = [
  {
    path: 'activity',
    name: 'officalActivityPage',
    component: () => import('@desktop/pages/activity/index.vue'),
  },
  {
    path: 'activity/recharge',
    name: 'officalActivityRecharge',
    component: () => import('@desktop/pages/activity/recharge.vue'),
  },
]

export default activities
