import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"

import { desktop } from "./desktop"
import { mobile } from "./mobile"
import { ua } from "@3un/utils"

declare module "vue-router" {
  interface RouteMeta {
    hideHeader?: boolean,
    hideFooter?: boolean,
  }
}

const routes: RouteRecordRaw[] = ua.isMobile ? mobile : desktop

const router = createRouter({
  routes: routes,
  history: createWebHistory(),
})

router.beforeEach((to) => {
  if(to.name === "shopDetail" && !to.params.id) {
    return "/shop/services"
  }

  const isMobilePath = to.path.startsWith("/m")

  if(ua.isMobile && !isMobilePath) {
    return `/m${to.path}`
  }

  if(!ua.isMobile && isMobilePath) {
    return to.path.replace("/m", "")
  }

  return true
})

export default router
