import TableActions from '../components/TableActions.vue'

import { ORDER_STATUS, ORDER_STATUS_MAP, ORDER_VERTIFY, ORDER_VERTIFY_MAP } from '@3un/utils'
import { XTag, type XColDef } from '@3un/ui'
import { h } from 'vue'

import type { Order } from '@/api/orders'

const serviceStore = useServiceStore()

export const columns: XColDef<Order> = [
  { key: 'id', title: '订单号', width: 98 },
  {
    key: 'serviceId',
    title: '服务',
    width: 220,
    render: (value) => {
      const service = serviceStore.services.get(value)
      return service ? `${service.id} - ${service.title}` : '服务不存在'
    },
  },
  { key: 'imei', title: 'IMEI/SN', width: 158 },
  { key: 'credits', title: '积分', width: 58 },
  {
    key: 'status',
    title: '订单状态',
    width: 88,
    render: (value: ORDER_STATUS) => {
      return h(XTag, ORDER_STATUS_MAP[value])
    }
  },
  {
    key: 'verify',
    title: '验证状态',
    width: 88,
    render(value: ORDER_VERTIFY) {
      return h(XTag, ORDER_VERTIFY_MAP[value])
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
  { key: 'createTime', title: '提交时间', width: 148, },
  { key: 'remark', title: '备注', width: 168, },
  {
    key: 'action',
    title: '操作',
    fixed: 'right',
    width: 200,
    render(_, row, index) {
      return h(TableActions, { row, index })
    }
  }
]
