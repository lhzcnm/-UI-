import type { OrderTableDefs, OrderSCRP, OrderTableView } from '@/api/orders'
import type { ColDef } from 'ag-grid-community'

import { ORDER_STATUS, ORDER_STATUS_MAP, ORDER_VERTIFY, ORDER_VERTIFY_MAP } from '@3un/shared/enums'
import TableAction from '../components/TableAction.vue'
import TheTag from '@desktop/components/TheTag.vue'

const store = useServiceStore()

export const columnOpts: ColDef = {
  resizable: false,
  sortable: false,
}

export const defaultColumns: OrderTableDefs = [
  { field: 'id', headerName: 'ID', width: 108 },
  {
    field: 'service',
    headerName: '服务',
    valueFormatter: ({ data }) => {
      const id = (data as any).serviceId ?? 0
      const service = store.services.get(id)
      const title = service?.title ?? '找不到服务'
      return `${id} - ${title}`
    },
  },
  { field: 'imei', headerName: 'IMEI/SN', resizable: false, width: 164 },
  { field: 'credits', headerName: '积分', resizable: false, width: 88 },
  {
    field: 'status',
    headerName: '订单状态',
    width: 128,
    cellRenderer: TheTag,
    cellRendererParams: ({ data }: OrderSCRP) => {
      const id = data?.status ?? ORDER_STATUS.WAIT
      return ORDER_STATUS_MAP[id]
    },
  },
  {
    field: 'verify',
    headerName: '验证状态',
    width: 128,
    cellRenderer: TheTag,
    cellRendererParams: ({ data }: OrderSCRP) => {
      const id = data?.verify ?? ORDER_VERTIFY.NORMAL
      return ORDER_VERTIFY_MAP[id]
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
    cellRenderer: ({ data }: OrderSCRP) => {
      return data?.result ?? '-'
    },
  },
  { field: 'remark', headerName: '备注', minWidth: 180 },
  {
    field: 'action',
    headerName: '操作',
    pinned: 'right',
    width: 280,
    cellRenderer: TableAction,
    cellRendererParams: ({ data }: OrderSCRP) => data,
  },
]
