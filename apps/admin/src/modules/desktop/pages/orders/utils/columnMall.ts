import { h } from 'vue'
import { toast } from 'vue-sonner'
import { XButton, XTag, type XColDef } from '@3un/ui'
import { ORDER_STATUS, ORDER_STATUS_MAP, REFUND_STATUS, REFUND_STATUS_MAP, SUBMIT_METHOD_MAP, xconfirm } from '@3un/utils'

import type { MallOrder, MallOrderRefundParams } from '@/inters/orders/mall'
import { refundMallOrder } from '@/api/orders'

export const columns: XColDef<MallOrder> = [
  {
    key: 'codeId',
    title: '订单号',
    width: 100,
  },
  {
    key: 'codeSentToOtherServer',
    title: '上游订单号',
    width: 100,
  },
  {
    key: 'packageId',
    title: '服务',
    width: 225,
    render(value) {
      const serviceStore = useServiceStore()
      const service = serviceStore.itemMap.get(value)
      return service ? `${service.packageId} - ${service.packageTitle}` : '--'
    }
  },
  {
    key: 'codeStatusId',
    title: '订单状态',
    width: 128,
    render(value) {
      return h(XTag, {
        ...ORDER_STATUS_MAP[value],
        solid: true,
      })
    }
  },
  {
    key: 'storePrice',
    title: '价格',
    width: 78,
  },
  {
    key: 'submitMethod',
    title: '提交方式',
    width: 108,
    render(value) {
      return SUBMIT_METHOD_MAP[value].label
    }
  },
  {
    key: 'speed',
    title: '耗时',
    width: 88,
    render(_, row) {
      const whiteList = [ORDER_STATUS.PROCESSING, ORDER_STATUS.WAIT]
      if (whiteList.includes(row.codeStatusId)) {
        return '--'
      }

      const updateTimeDate = new Date(row.updateTime).getTime()
      const requestedAtDate = new Date(row.requestedAt).getTime()
      const diffTime = updateTimeDate - requestedAtDate
      const diff = Math.round(diffTime / 1000)
      return diff < 1 ? '<1s' : `${diff}s`
    }
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
    key: 'requestedAt',
    title: '日期',
    width: 164,
    render(value, row) {
      const whiteList = [ORDER_STATUS.PROCESSING, ORDER_STATUS.WAIT]
      if (whiteList.includes(row.codeStatusId)) {
        return h('div', `请求：${value.slice(5)}`)
      }

      return [
        h('div', `请求：${value.slice(5)}`),
        h('div', `更新：${row.updateTime.slice(5)}`),
      ]
    }
  },
  {
    key: 'refundStatus',
    title: '退款状态',
    width: 128,
    render(value, row) {
      let status = REFUND_STATUS_MAP[value]

      if(row.codeStatusId === ORDER_STATUS.SUCCESS) {
        status = REFUND_STATUS_MAP[REFUND_STATUS.REJECTED]
      }

      return h(XTag, {
        color: status.color,
        label: status.label,
        solid: true,
      })
    }
  },
  {
    key: 'action',
    title: '操作',
    width: 108,
    fixed: 'right',
    render: (_, row) => {
      const isRefund = row.codeStatusId === ORDER_STATUS.SUCCESS || row.refundStatus === REFUND_STATUS.SOLVED
      async function handleRefund() {
        const params: MallOrderRefundParams = {
          paymentId: row.paymentId,
          codeId: row.codeId,
          refundAmount: row.storePrice,
        }

        if(!await xconfirm('是否确认退款, 该操作不可撤销')) return

        try {
          const data = await refundMallOrder(params)
          if(data.success)
            return toast.success('退款成功')
          return toast.error(data.message)
        } catch {
          return toast.error('退款失败')
        }
      }

      return h(XButton, {
        label: isRefund ? '不可退款' : '退款',
        color: 'danger',
        icon: 'lucide:dollar-sign',
        size: 'sm',
        disabled: isRefund,
        onClick: handleRefund,
      })
    }
  }
]
