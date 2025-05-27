import type { Recharge } from '@/inters/recharge'
import { PAYMENT_METHOD_MAP, PAYMENT_STATUS_MAP, SHOP_NAME_MAP } from '@3un/utils'
import { XTag, type XColDef } from '@3un/ui'

export const columns: XColDef<Recharge> = [
  {
    key: 'paymentId',
    title: '充值ID',
    width: 88,
  },
  {
    key: 'userId',
    title: '用户ID',
    width: 88,
  },
  {
    key: 'amount',
    title: '账单金额',
    width: 108,
  },
  {
    key: 'credits',
    title: '到账金额',
    width: 108,
  },
  {
    key: 'paymentMethod',
    title: '支付方式',
    width: 108,
    render: (value) => {
      const item = PAYMENT_METHOD_MAP[value]
      return item.label
    },
  },
  {
    key: 'paymentStatus',
    title: '支付状态',
    width: 108,
    render: (value) => {
      return h(XTag, PAYMENT_STATUS_MAP[value])
    },
  },
  {
    key: 'shopId',
    title: '充值类型',
    width: 108,
    render: (value) => {
      return SHOP_NAME_MAP[value].label
    },
  },
  {
    key: 'paymentDtTm',
    title: '支付时间',
    width: 180,
  },
  {
    key: 'transactionId',
    title: '交易ID',
    minWidth: 280,
  },
  {
    key: 'comments',
    title: '备注',
    minWidth: 180,
  },
]
