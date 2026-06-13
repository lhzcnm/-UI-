import type { RouteRecordRaw } from 'vue-router'

const local: RouteRecordRaw[] = [
  {
    path: 'local',
    name: 'local',
    component: () => import('@mobile/pages/local/index.vue'),
  },
]

export default local