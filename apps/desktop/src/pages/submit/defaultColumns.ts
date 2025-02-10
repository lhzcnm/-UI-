import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import type { OrderItem } from '@3un/shared/orders'

import { ORDER_STATUS, ORDER_STATUS_MAP } from '@3un/utils'
import TheTag from '@/components/TheTag.vue'

type SCRP = ICellRendererParams<OrderItem>
interface TableOrderItem {
  index: number
  service: string
  imei: string
  credits: number
  status: ORDER_STATUS
  result: string
  remark: string
}

export const defaultColumns: ColDef<TableOrderItem>[] = [
  { field: 'index', headerName: '序号', width: 64 },
  {
    field: 'service',
    headerName: '服务',
    width: 220,
    cellRenderer: (params: SCRP) => {
      const id = params.data?.serviceId ?? 0
      const title = params.data?.serviceTitle ?? '找不到服务'
      return `${id} - ${title}`
    },
  },
  { field: 'imei', headerName: 'IMEI/SN', width: 164 },
  { field: 'credits', headerName: '积分', width: 88 },
  {
    field: 'status',
    headerName: '订单状态',
    width: 128,
    cellRenderer: TheTag,
    cellRendererParams: (params: SCRP) => {
      const id = params.data?.status ?? ORDER_STATUS.WAIT
      return ORDER_STATUS_MAP[id]
    },
  },
  {
    field: 'result',
    headerName: '订单结果',
    flex: 1,
    minWidth: 300,
    wrapText: true,
    autoHeight: true,
    cellClass: 'leading-6 py-1',
    cellRenderer: (params: SCRP) => {
      return params.data?.result ?? '-'
    },
  },
  { field: 'remark', headerName: '备注', minWidth: 180, flex: 1 },
]
