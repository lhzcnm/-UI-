import { ORDER_STATUS, ORDER_STATUS_MAP } from '@3un/utils'
import type { OrderTableView } from '@/api/orders'
import type { XTableColumn } from '@3un/ui'
import { XTag } from '@3un/ui'

export const getDefaultColumns = (): XTableColumn[] => ([
  {
    key: 'index',
    title: '序号',
    align: 'center',
    width: 64
  },
  {
    key: 'service',
    title: '服务',
    width: 220,
    render: (_: any, row: OrderTableView) => {
      if (!row || !row.serviceId) return '请选择服务'
      return `${row.serviceId} - ${row.serviceName}`
    }
  },
  { key: 'imei', title: 'IMEI/SN', width: 158 },
  { key: 'credits', title: '积分', width: 58 },
  {
    key: 'status',
    title: '订单状态',
    width: 88,
    render: (value: ORDER_STATUS) => {
      const id = value || ORDER_STATUS.WAIT
      const tag = ORDER_STATUS_MAP[id]
      return h(XTag, tag)
    }
  },
  {
    key: 'result',
    title: '订单结果',
    minWidth: 320,
    tdClassName: 'leading-6 py-1',
    render: (value: string) => {
      return h('span', { innerHTML: value })
    }
  },
  { key: 'remark', title: '备注', minWidth: 180 }
])

export function mergeColumns(serviceCols: XTableColumn[]): XTableColumn[] {
  const defaultCols = getDefaultColumns()
  const len = defaultCols.length
  const frontCols = defaultCols.slice(0, len - 2)
  const endCols = defaultCols.slice(-1)

  return [
    ...frontCols,
    ...serviceCols,
    ...endCols
  ]
}
