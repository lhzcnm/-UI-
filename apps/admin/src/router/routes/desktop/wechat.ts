import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/wechat/menu',
    component: () => import('@/modules/desktop/pages/wechat/menu.vue'),
  },
  {
    path: '/wechat/message',
    component: () => import('@/modules/desktop/pages/wechat/message.vue'),
  },
]

export default routes
