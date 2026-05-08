import type { RouteRecordRaw } from "vue-router"

const monitors: RouteRecordRaw[] = [
  {
    path: "on-monitor",
    name: "serverMonitorPlatform",
    redirect: "/on-monitor/users",
    children: [
      {
        path: "users",
        name: "serverMonitorUsers",
        component: () => import("@mobile/pages/monitor/user.vue"),
      },
      {
        path: "servers",
        name: "serverMonitorServers",
        component: () => import("@mobile/pages/monitor/server.vue"),
      },
    ]
  }
]

export default monitors
