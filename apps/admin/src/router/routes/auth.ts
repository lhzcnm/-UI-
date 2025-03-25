import type { RouteRecordRaw } from 'vue-router'

const auth: RouteRecordRaw = {
  path: '/auth',
  component: () => import('@auth/index.vue'),
}

export default auth
