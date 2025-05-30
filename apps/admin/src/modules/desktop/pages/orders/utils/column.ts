import type { Order } from '@/inters/orders'

import { ORDER_STATUS_MAP, SUBMIT_METHOD_MAP } from '@3un/utils'
import { XTag, type XColDef } from "@3un/ui"
import { h } from 'vue'

const serviceStore = useServiceStore()

export const columns: XColDef<Order> = [
  {
    key: 'codeId',
    title: '订单号',
    width: 100,
  },
  {
    key: 'orderIdFromServer',
    title: '上游订单号',
    width: 100,
  },
  {
    key: 'packageId',
    title: '服务',
    width: 225,
    render(value) {
      const service = serviceStore.itemMap.get(value)
      return service ? `${service.packageId} - ${service.packageTitle}` : '--'
    }
  },
  {
    key: 'userId',
    title: '用户',
    width: 88,
  },
  {
    key: 'codeStatusId',
    title: '订单状态',
    width: 108,
    render(value) {
      return h(XTag, {
        ...ORDER_STATUS_MAP[value],
        solid: true,
      })
    }
  },
  {
    key: 'downloaded',
    title: '已经推送',
    width: 100,
    render(value) {
      return value ? 'YES' : 'NO'
    }
  },
  {
    key: 'credits',
    title: '积分',
    width: 78,
  },
  {
    key: 'code',
    title: '订单结果',
    minWidth: 280,
    render(value) {
      return h('span', { innerHTML: value })
    }
  },
  {
    key: 'submitMethod',
    title: '提交方式',
    width: 100,
    render(value) {
      return SUBMIT_METHOD_MAP[value].label
    }
  },
  {
    key: 'requestedAt',
    title: '耗时',
    width: 100,
    render(value, row) {
      const updateTimeDate = new Date(row.updateTime).getTime()
      const requestedAtDate = new Date(value).getTime()
      const diffTime = updateTimeDate - requestedAtDate
      const diff = Math.round(diffTime / 1000)
      return diff < 1 ? '<1s' : `${diff}s`
    }
  },
]
