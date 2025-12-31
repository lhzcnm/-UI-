import type { Hqb } from "@/inters/quotation/hqb"
import type { XColDef } from "@3un/ui"
import { h } from "vue"
import QuotationTableAction from "../components/QuotationTableAction.vue"
import { QUOTATION_STORE } from "."

export const columnsHqb: XColDef<Hqb> = [
  {
    key: 'id',
    title: 'ID',
    width: 68,
  },
  {
    key: 'model',
    title: '设备',
    width: 128,
  },
  {
    key: 'brand',
    title: '设备品牌',
    width: 128,
    render: (value) => {
      const store = inject(QUOTATION_STORE)!
      const desc = store.brandsMap.get(value) || "未知品牌"
      return desc
    }
  },
  {
    key: 'memory',
    title: '容量',
    width: 128,
  },
  {
    key: 'statusDesc',
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
      return h(QuotationTableAction, {
        row: row
      })
    }
  }
]
