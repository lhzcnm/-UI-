import type { RouteRecordRaw } from "vue-router";

export const mobile: RouteRecordRaw[] = [
  {
    path: "/m/shop",
    name: "mobileShop",
    redirect: "/m/shop/home",
    component: () => import("@mobile/index.vue"),
    children: [
      {
        path: "home",
        name: "mobileShopHome_shop",
        component: () => import("@mobile/pages/home/index.vue"),
        meta: {
          hideFooter: true,
        }
      },
      {
        path: "services",
        name: "mobileShopService_shop",
        component: () => import("@mobile/pages/services/index.vue"),
      },
      {
        path: "profile",
        name: "mobileShopProfile_profile",
        component: () => import("@mobile/pages/profile/index.vue"),
      },
      {
        path: "history/:codeId?",
        name: "mobileShopHistory_history",
        component: () => import("@mobile/pages/history/index.vue"),
      }
    ]
  }
]
