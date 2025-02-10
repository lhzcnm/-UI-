import type { RouteRecordRaw } from 'vue-router'

const test: RouteRecordRaw = {
  path: '/test',
  component: () => import('@/pages/test/Index.vue'),
}

export default test
