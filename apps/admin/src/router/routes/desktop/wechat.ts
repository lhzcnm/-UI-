import type { RouteRecordRaw } from 'vue-router'

const wechat: RouteRecordRaw[] = [
  {
    path: 'wechat/menu',
    component: () => import('@desktop/pages/wechat/menu.vue'),
  },
  {
    path: 'wechat/message',
    component: () => import('@desktop/pages/wechat/message.vue'),
  },
]

export default wechat
