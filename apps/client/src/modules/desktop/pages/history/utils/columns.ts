import type { TableColumn } from '@3un/ui'
import { XTag } from '@3un/ui'
import TableActions from '../components/TableActions.vue'
import { ORDER_STATUS_MAP, ORDER_VERTIFY_MAP } from '@3un/shared/enums'
import type { Order } from '@/api/orders'

const serviceStore = useServiceStore()

let isServiceLoaded = false
async function ensureServicesLoaded() {
  if (!isServiceLoaded) {
    await serviceStore.getServices()
    isServiceLoaded = true
  }
}

export const columns: TableColumn[] = [
  { key: 'id', title: 'ID', width: 108 },
  {
    key: 'service',
    title: '服务',
    width: 220,
    render: async (_, row: Order) => {
      await ensureServicesLoaded()
      const service = serviceStore.services.get(row.serviceId)
      if (!service) return '未知'
      return `${service.id} - ${service.title}`
    }
  },
  { key: 'imei', title: 'IMEI/SN', width: 168 },
  { key: 'credits', title: '积分', width: 68 },
  {
    key: 'status',
    title: '订单状态',
    width: 98,
    render: (value: any) => {
      const tag = ORDER_STATUS_MAP[value]
      return h(XTag, {
        color: tag?.color,
        label: tag?.label
      })
    }
  },
  {
    key: 'verify',
    title: '验证状态',
    width: 98,
    render: (value: any) => {
      const tag = ORDER_VERTIFY_MAP[value]
      return h(XTag, {
        color: tag?.color,
        label: tag?.label
      })
    }
  },
  {
    key: 'result',
    title: '订单结果',
    width: 320,
    tdClassName: 'leading-6 py-1',
    render: (value: any) => {
      return h('div', { innerHTML: value })
    }
  },
  { key: 'remark', title: '备注', width: 180 },
  {
    key: 'action',
    title: '操作',
    fixed: 'right',
    width: 280,
    render: (_, row: Order) => {
      return h(TableActions, { row })
    }
  }
]