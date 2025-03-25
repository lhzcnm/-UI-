import type { RouteRecordRaw } from 'vue-router'

const mobile: RouteRecordRaw = {
  path: '/m',
  component: () => import('@mobile/index.vue'),
}

export default mobile
