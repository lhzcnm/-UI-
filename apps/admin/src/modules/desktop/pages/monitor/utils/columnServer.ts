import type { MonitorServer } from "@/inters/monitor/server"
import type { XColDef } from "@3un/ui"
import { h } from "vue"
import ServerAction from "../components/ServerAction.vue"

export const columns: XColDef<MonitorServer> = [
  {
    key: "serverId",
    title: "ID",
    width: 58,
  },
  {
    key: "serverIp",
    title: "IP",
    width: 128,
  },
  {
    key: "serverName",
    title: "服务器名称",
    width: 158,
  },
  {
    key: "domain",
    title: "订单数据来源",
    width: 158,
  },
  {
    key: "domainName",
    title: "公众号名称",
    width: 128,
  },
  {
    key: "action",
    title: "操作",
    width: 28,
    fixed: "right",
    render: (_, row) => {
      return h(ServerAction, {
        row: row,
      })
    }
  }
]
