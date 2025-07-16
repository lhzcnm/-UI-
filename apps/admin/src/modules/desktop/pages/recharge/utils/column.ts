import { PAYMENT_METHOD_MAP, PAYMENT_STATUS_MAP } from '@3un/utils'
import { XTag, type XColDef } from '@3un/ui'
import { h } from 'vue'

import RechargeAction from '../components/RechargeAction.vue'
import type { Recharge } from '@/inters/recharge'

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
    render(value) {
      return h('a', {
        href: `/users?uid=${value}`,
        class: 'underline hover:text-success',
        target: '_blank',
        rel: 'opener',
      }, value)
    },
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
    key: 'byAdmin',
    title: '管理员添加',
    width: 98,
    render: (value) => {
      return value ? 'YES' : 'NO'
    },
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
    width: 128,
    render: (value) => {
      const packageStore = usePackageStore()
      const pkg = packageStore.packageMap.get(value)
      return pkg ? pkg.shopName : '积分充值'
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
  {
    key: 'action',
    title: '操作',
    width: 154,
    fixed: 'right',
    render: (_, row, index) => {
      return h(RechargeAction, { row, index })
    },
  },
]
