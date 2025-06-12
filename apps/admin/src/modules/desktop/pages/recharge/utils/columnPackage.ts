import { type XColDef } from '@3un/ui'
import { h } from 'vue'

import type { RechargePackage } from '@/inters/recharge/package'
import PackageAction from '../components/PackageAction.vue'

export const columns: XColDef<RechargePackage> = [
  { key: 'id', title: '套餐ID', width: 72, align: 'center' },
  { key: 'shopName', title: '商品名称', minWidth: 154 },
  { key: 'price', title: '价格', minWidth: 108 },
  { key: 'month', title: '月数', minWidth: 108 },
  { key: 'createTime', title: '创建时间', width: 180 },
  {
    key: 'action',
    title: '操作',
    width: 154,
    render: (_, row, index) => {
      return h(PackageAction, { row, index })
    },
  },
]
