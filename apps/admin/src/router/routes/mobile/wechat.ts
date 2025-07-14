import type { RouteRecordRaw } from 'vue-router'

const wechat: RouteRecordRaw[] = [
  {
    path: 'wechat/menu',
    component: () => import('@mobile/pages/wechat/menu.vue'),
  },
  {
    path: 'wechat/message',
    component: () => import('@mobile/pages/wechat/message.vue'),
  },
]

export default wechat
