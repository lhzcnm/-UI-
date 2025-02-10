import type { RouteRecordRaw } from 'vue-router'

const notFound: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'notFound',
  component: () => import('@/pages/NotFound.vue'),
}

export default notFound
