import TableActions from '../components/TableActions.vue'

import { ORDER_STATUS, ORDER_STATUS_MAP, ORDER_VERIFY, ORDER_VERIFY_MAP } from '@3un/utils'
import { XTag, type XColDef } from '@3un/ui'
import { h } from 'vue'

import type { Order } from '@/api/orders'

const serviceStore = useServiceStore()
const localStore = useLocalStore()

export function getOrderColumns(): XColDef<Order> {

  return [
    { key: 'id', title: 'ID', width: 98 },
    {
      key: 'serviceId',
      title: localStore.localData['history_TableHeadServuce'],
      width: 220,
      render: (value) => {
        const service = serviceStore.services.get(value)
        return service
          ? `${service.id} - ${service.title}`
          : localStore.localData['history_NotFount']
      },
    },
    { key: 'imei', title: 'IMEI/SN', width: 158 },
    { key: 'credits', title: localStore.localData['history_TableHeadPoints'], width: 58 },
    {
      key: 'status',
      title: localStore.localData['history_TableHeadOrderStatus'],
      width: 108,
      render: (value: ORDER_STATUS) => {
        return h(XTag, {
          label: localStore.localData[ORDER_STATUS_MAP[value].key!],
          color: ORDER_STATUS_MAP[value].color,
        })
      }
    },
    {
      key: 'verify',
      title: localStore.localData['history_TableHeadVerifyStatus'],
      width: 108,
      render(value: ORDER_VERIFY) {
        return h(XTag, {
          label: localStore.localData[ORDER_VERIFY_MAP[value].key!],
          color: ORDER_VERIFY_MAP[value].color,
        })
      }
    },
    {
      key: 'result',
      title: localStore.localData['history_TableHeadResult'],
      minWidth: 320,
      render(value: string) {
        return h('div', { innerHTML: value })
      }
    },
    { key: 'createTime', title: localStore.localData['history_TableHeadSubmitTime'], width: 148, thClassName: 'text-center' },
    { key: 'remark', title: localStore.localData['history_TableHeadRemarks'], width: 168, },
    {
      key: 'action',
      title: localStore.localData['history_TableHeadOperation'],
      fixed: 'right',
      width: 138,
      render(_, row, index) {
        return h(TableActions, { row, index })
      }
    }
  ]
}
