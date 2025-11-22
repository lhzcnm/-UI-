import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"

import { desktop } from "./desktop"

const routes: RouteRecordRaw[] = [
  ...desktop,
]

const router = createRouter({
  routes: routes,
  history: createWebHistory(),
})

router.beforeEach((to) => {
  if(to.name === "shopDetail" && !to.params.id) {
    return "/shop/services"
  }

  return true
})

export default router
