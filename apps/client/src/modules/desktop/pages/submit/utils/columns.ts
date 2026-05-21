import UnlockRecommendAction from '../components/UnlockRecommendAction.vue'

import type { OrderTableView } from '@/api/orders'

import { ORDER_STATUS, ORDER_STATUS_MAP } from '@3un/utils'
import { XTag, type XTableColumn } from '@3un/ui'
import { h } from 'vue'

import { getLanuagestring } from "@/utils/constant"

const iStore = useSystemStore()

export function getDefaultColumns(t: (key: string) => string): XTableColumn[] {
  return [
    {
      key: 'index',
      title: t('query.listCol.index'),
      align: 'center',
      width: 64,
      render: (_, __, index) => {
        return index + 1
      }
    },
    {
      key: 'service',
      title: t('query.listCol.service'),
      width: 220,
      render: (_: any, row: OrderTableView) => {
        if (!row || !row.serviceId) return t('service.placeholder')
        return `${row.serviceId} - ${row.serviceName}`
      }
    },
    { key: 'imei', title: 'IMEI/SN', width: 158 },
    { key: 'credits', title: t('service.point'), width: 58 },
    {
      key: 'status',
      title: t('query.listCol.status'),
      width: 108,
      render: (value: ORDER_STATUS) => {
        const id = value || ORDER_STATUS.WAIT
        const tag = ORDER_STATUS_MAP[id]
        return h(XTag, {
          label: t(tag.key!),
          color: tag.color,
        })
      }
    },
    {
      key: 'result',
      title: t('query.listCol.result'),
      minWidth: 320,
      tdClassName: 'leading-6 py-1',
      isColDel: true,
      render: (value: string) => {
        return h('span', { innerHTML: value })
      },
    },
    { key: 'remark', title: t('query.listCol.remark'), minWidth: 160, isColDel: true, isFilter: true },
    {
      key: 'recommends',
      title: getLanuagestring("unlock_recommend_column", iStore.lang),
      width: 238,
      isColDel: true,
      render(_, row: OrderTableView) {
        if (!row.isStorage && (!row.recommends || row.recommends.length === 0 || row.status !== ORDER_STATUS.SUCCESS)) {
          return getLanuagestring("no_unlock_recommend", iStore.lang)
        }
        return h(UnlockRecommendAction, {
          order: row,
        })
      }
    },
  ]
}

export function getDefaultResultColumns(t: (key: string) => string): XTableColumn {
  return {
    key: 'result',
    title: t('query.listCol.result'),
    minWidth: 320,
    tdClassName: 'leading-6 py-1',
    isColDel: true,
    render: (value: string) => {
      return h('span', { innerHTML: value })
    },
  }
}
