import TableActions from '../components/TableActions.vue'

import { ORDER_STATUS, ORDER_STATUS_MAP, ORDER_VERIFY, ORDER_VERIFY_MAP } from '@3un/utils'
import { XTag, type XColDef } from '@3un/ui'
import { h } from 'vue'

import type { Order } from '@/api/orders'

const serviceStore = useServiceStore()

export function getOrderColumns(): XColDef<Order> {
  const { t } = useI18n()

  return [
    { key: 'id', title: 'ID', width: 98 },
    {
      key: 'serviceId',
      title: t('order.listCol.service'),
      width: 220,
      render: (value) => {
        const service = serviceStore.services.get(value)
        return service
          ? `${service.id} - ${service.title}`
          : t('service.notFound')
      },
    },
    { key: 'imei', title: 'IMEI/SN', width: 158 },
    { key: 'credits', title: t('service.point'), width: 58 },
    {
      key: 'status',
      title: t('order.listCol.status'),
      width: 108,
      render: (value: ORDER_STATUS) => {
        return h(XTag, {
          label: t(ORDER_STATUS_MAP[value].key!),
          color: ORDER_STATUS_MAP[value].color,
        })
      }
    },
    {
      key: 'verify',
      title: t('order.listCol.vertify'),
      width: 108,
      render(value: ORDER_VERIFY) {
        return h(XTag, {
          label: t(ORDER_VERIFY_MAP[value].key!),
          color: ORDER_VERIFY_MAP[value].color,
        })
      }
    },
    {
      key: 'result',
      title: t('order.listCol.result'),
      minWidth: 320,
      render(value: string) {
        return h('div', { innerHTML: value })
      }
    },
    { key: 'createTime', title: t('order.listCol.creaTime'), width: 148, thClassName: 'text-center' },
    { key: 'remark', title: t('order.listCol.remark'), width: 168, },
    {
      key: 'action',
      title: t('action.operation'),
      fixed: 'right',
      width: 128,
      render(_, row, index) {
        return h(TableActions, { row, index })
      }
    }
  ]
}
