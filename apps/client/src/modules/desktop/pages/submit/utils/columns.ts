import { XTag } from '@3un/ui'

import type { TableColumn } from '@3un/ui'
import { ORDER_STATUS, ORDER_STATUS_MAP } from '@3un/shared/enums'

import type { OrderTableView } from '@/api/orders'

/**
 * 创建默认列定义
 * @returns 默认列定义数组
 */
export function createDefaultColumns(): TableColumn[] {
  return [
    { key: 'index', title: '序号', width: 64 },
    {
      key: 'service',
      title: '服务',
      width: 220,
      render: (_: any, row: OrderTableView) => {
        if (!row) return '请选择服务'
        if (row.serviceId) {
          return `${row.serviceId} - ${row.serviceName}`
        }
        return '请选择服务'
      }
    },
    { key: 'imei', title: 'IMEI/SN', width: 164 },
    { key: 'credits', title: '积分', width: 88 },
    {
      key: 'status',
      title: '订单状态',
      width: 128,
      render: (_: any, row: OrderTableView) => {
        const id = row?.status || ORDER_STATUS.WAIT
        const tag = ORDER_STATUS_MAP[id]
        return h(XTag, {
          color: tag?.color,
          label: tag?.label
        })
      }
    },
    {
      key: 'result',
      title: '订单结果',
      width: 300,
      tdClassName: 'leading-6 py-1',
      render: (_: any, row: OrderTableView) => {
        return row?.result ?? '-'
      }
    },
    { key: 'remark', title: '备注', width: 180 }
  ]
}

/**
 * 合并默认列和动态服务列
 * @param serviceCols 服务自定义列
 * @returns 合并后的列定义数组
 */
export function mergeColumns(serviceCols: TableColumn[]): TableColumn[] {
  const defaultCols = createDefaultColumns()
  const len = defaultCols.length
  const frontCols = defaultCols.slice(0, len - 2)
  const endCols = defaultCols.slice(-1)

  return [
    ...frontCols,
    ...serviceCols,
    ...endCols
  ]
}
