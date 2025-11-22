import { type RouteRecordRaw } from 'vue-router'

export const desktop: RouteRecordRaw[] = [
  {
    path: '/shop',
    name: "Shop",
    redirect: '/shop/home',
    component: () => import('@desktop/index.vue'),
    children: [
      {
        path: 'home',
        name: 'shopHome',
        component: () => import('@desktop/pages/home/index.vue'),
      },
      {
        path: 'services',
        name: 'shopServices',
        component: () => import('@desktop/pages/services/index.vue'),
      },
      {
        path: 'detail/:id(\\d{4})?',
        name: 'shopDetail',
        component: () => import('@desktop/pages/detail/index.vue'),
      },
      {
        path: 'history/:codeId?',
        name: 'shopHistory',
        component: () => import('@desktop/pages/history/index.vue'),
      },
    ],
  }
]
