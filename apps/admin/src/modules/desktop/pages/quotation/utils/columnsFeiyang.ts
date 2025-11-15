import type { Feiyang } from "@/inters/quotation/feiyang"
import type { XColDef } from "@3un/ui"
import { h } from "vue"
import TableAction from "../components/TableAction.vue"

export const columnsFeiyang: XColDef<Feiyang> = [
  {
    key: 'id',
    title: 'ID',
    width: 64,
  },
  {
    key: 'model',
    title: '设备',
    width: 128,
  },
  {
    key: 'memory',
    title: '容量',
    width: 128,
  },
  {
    key: 'appearanceDesc',
    title: '设备状态',
    width: 128,
  },
  {
    key: 'price',
    title: '价格',
    width: 64,
  },
  {
    key: 'updateTime',
    title: '更新时间',
    width: 158,
  },
  {
    key: 'remarkId',
    title: '设备备注',
    tdClassName: 'underline hover:text-success cursor-pointer',
    width: 88,
  },
  {
    key: 'action',
    title: '操作',
    width: 38,
    fixed: 'right',
    render: (_, row) => {
      return h(TableAction, {
        row: row
      })
    }
  }
]