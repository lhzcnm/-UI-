import type { RouteRecordRaw } from 'vue-router'

export const desktop: RouteRecordRaw[] = [
  {
    path: '/auction',
    name: 'AuctionDesktop',
    component: () => import('@desktop/index.vue'),
    redirect: '/auction/home',
    children: [
      {
        path: 'home',
        name: 'AuctionHome',
        component: () => import('@desktop/pages/home/index.vue'),
      },
    ]
  },
]