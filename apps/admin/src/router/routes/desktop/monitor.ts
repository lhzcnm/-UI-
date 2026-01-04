import type { RouteRecordRaw } from "vue-router"

export const monitors: RouteRecordRaw[] = [
  {
    path: "on-monitor",
    name: "serverMonitorPlatform",
    redirect: "/on-monitor/users",
    children: [
      {
        path: "users",
        name: "serverMonitorUsers",
        component: () => import("@desktop/pages/monitor/user.vue"),
      },
      {
        path: "servers",
        name: "serverMonitorServers",
        component: () => import("@desktop/pages/monitor/server.vue"),
      },
    ]
  }
]
