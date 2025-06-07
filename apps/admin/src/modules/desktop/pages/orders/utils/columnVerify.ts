import OrderVerifyAction from '../components/OrderVerifyAction.vue'
import type { Order } from '@/inters/orders'

import { type XColDef, XTextarea } from '@3un/ui'
import { ORDER_STATUS, SUBMIT_METHOD_MAP } from '@3un/utils'
import { h } from 'vue'

const serviceStore = useServiceStore()
export const columns: XColDef<Order> = [
  {
    key: 'codeId',
    title: '订单号',
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
    key: 'credits',
    title: '积分',
    width: 78,
  },
  {
    key: 'imeiNo',
    title: 'IMEI/SN',
    width: 154,
  },
  {
    key: 'code',
    title: '订单结果',
    minWidth: 280,
    render(value) {
      return h(
        XTextarea, {
          'modelValue': value.split('<br>').join('\n'),
          rows: 6,
        },
      )
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
    width: 88,
    render(value, row) {
      const whiteList = [ORDER_STATUS.PROCESSING, ORDER_STATUS.WAIT]
      if (whiteList.includes(row.codeStatusId)) {
        return '--'
      }

      const updateTimeDate = new Date(row.updateTime).getTime()
      const requestedAtDate = new Date(value).getTime()
      const diffTime = updateTimeDate - requestedAtDate
      const diff = Math.round(diffTime / 1000)
      return diff < 1 ? '<1s' : `${diff}s`
    }
  },
  {
    key: 'updateTime',
    title: '日期',
    width: 164,
    render(value, row) {
      const whiteList = [ORDER_STATUS.PROCESSING, ORDER_STATUS.WAIT]
      if (whiteList.includes(row.codeStatusId)) {
        return h('div', value.slice(5))
      }

      return [
        h('div', row.requestedAt.slice(5)),
        h('div', value.slice(5)),
      ]
    }
  },
  {
    key: 'action',
    title: '操作',
    width: 164,
    fixed: 'right',
    render(_, row, index) {
      return h(OrderVerifyAction, { row, index })
    }
  }
]
