import type { RouteRecordRaw } from 'vue-router'

const notFound: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  component: () => import('@other/NotFound.vue'),
}

export default notFound
