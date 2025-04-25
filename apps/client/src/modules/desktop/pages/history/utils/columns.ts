import { ORDER_STATUS, ORDER_STATUS_MAP, ORDER_VERTIFY, ORDER_VERTIFY_MAP } from '@3un/shared/enums'
import TableActions from '../components/TableActions.vue'
import { XTag } from '@3un/ui'

import type { XTableColumn } from '@3un/ui'
import type { Order } from '@/api/orders'

const serviceStore = useServiceStore()

export const columns: XTableColumn[] = [
  { key: 'id', title: '订单号', width: 98 },
  {
    key: 'service',
    title: '服务',
    width: 220,
    render: (_: any, row: Order) => {
      const service = serviceStore.services.get(row.serviceId)

      if (!service) return '服务不存在'
      return `${service.id} - ${service.title}`
    },
  },
  { key: 'imei', title: 'IMEI/SN', width: 158 },
  { key: 'credits', title: '积分', width: 58 },
  {
    key: 'status',
    title: '订单状态',
    width: 88,
    render: (value: ORDER_STATUS) => {
      const tag = ORDER_STATUS_MAP[value]
      return h(XTag, tag)
    }
  },
  {
    key: 'verify',
    title: '验证状态',
    width: 88,
    render(value: ORDER_VERTIFY) {
      const tag = ORDER_VERTIFY_MAP[value]
      return h(XTag, tag)
    }
  },
  {
    key: 'result',
    title: '订单结果',
    minWidth: 320,
    render(value: string) {
      return h('div', { innerHTML: value })
    }
  },
  { key: 'createTime', title: '提交时间', minWidth: 148, },
  { key: 'remark', title: '备注', minWidth: 168, },
  {
    key: 'action',
    title: '操作',
    fixed: 'right',
    width: 200,
    render(_, row: Order, index) {
      return h(TableActions, { row, index })
    }
  }
]
