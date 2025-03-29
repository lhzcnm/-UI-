import type { OrderTableDefs, OrderSCRP } from '@/api/orders'
import type { ColDef } from 'ag-grid-community'

import { ORDER_STATUS, ORDER_STATUS_MAP } from '@3un/shared/enums'
import TheTag from '@desktop/components/TheTag.vue'

export const columnOpts: ColDef = {
  resizable: false,
  sortable: false,
}

export const defaultColumns: OrderTableDefs = [
  { field: 'index', headerName: '序号', width: 64 },
  {
    field: 'service',
    headerName: '服务',
    width: 220,
    valueFormatter: ({ data }) => {
      if (data && (data as any).serviceId) {
        const { serviceId, serviceName } = data as any
        return `${serviceId} - ${serviceName}`
      }

      return '请选择服务'
    },
  },
  { field: 'imei', headerName: 'IMEI/SN', width: 164 },
  { field: 'credits', headerName: '积分', width: 88 },
  {
    field: 'status',
    headerName: '订单状态',
    width: 128,
    cellRenderer: TheTag,
    cellRendererParams: ({ data }: OrderSCRP) => {
      const id = data?.status || ORDER_STATUS.WAIT
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
    cellRenderer: ({ data }: OrderSCRP) => {
      return data?.result ?? '-'
    },
  },
  {
    field: 'remark',
    headerName: '备注',
    minWidth: 180,
    flex: 1,
  },
]
