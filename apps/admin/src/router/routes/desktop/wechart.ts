import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/wechart/menu',
    component: () => import('@/modules/desktop/pages/wechart/menu.vue'),
  },
  {
    path: '/wechart/message',
    component: () => import('@/modules/desktop/pages/wechart/message.vue'),
  },
]

export default routes
