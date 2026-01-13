import type { MonitorUser } from "@/inters/monitor/user";
import type { XColDef } from "@3un/ui";
import { h } from "vue";
import UserAction from "../components/UserAction.vue";

export const columns: XColDef<MonitorUser> = [
  {
    key: "id",
    title: "ID",
    width: 88,
  },
  {
    key: "username",
    title: "用户名",
    width: 158,
  },
  {
    key: "password",
    title: "密码",
    width: 158,
  },
  {
    key: "action",
    title: "操作",
    width: 28,
    fixed: "right",
    render: (_, row) => {
      return h(UserAction, {
        row: row,
      })
    }
  }
]
