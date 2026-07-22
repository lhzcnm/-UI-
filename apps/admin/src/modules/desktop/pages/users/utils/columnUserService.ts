import UserServiceAction from '../components/UserServiceAction.vue'

import { type XColDef, XInputNumber } from '@3un/ui'
import { h } from 'vue'

import type { UserService } from '@/inters/users'

export const columns: XColDef<UserService> = [
  {
    key: 'packageId',
    title: '服务',
    minWidth: 210,
    render: (value) => {
      const serviceStore = useServiceStore()
      const service = serviceStore.itemMap.get(value)
      return service ? `${service.packageId} - ${service.packageTitle}` : '--'
    },
  },
  {
    key: 'original',
    title: '原始点数',
    width: 72,
    render: (_, row) => {
      const serviceStore = useServiceStore()
      const service = serviceStore.itemMap.get(row.packageId)
      return service ? service.packagePrice : '--'
    }
  },
  {
    key: 'price',
    title: '修改价格',
    width: 120,
    render: (_, row) => {
      return h(XInputNumber, {
        modelValue: row.price,
        step: 0.01,
        precision: 2,
        size: 'sm',
        "onUpdate:modelValue": (val) => {
          row.price = val
        }
      })
    },
  },
  {
    key: 'actions',
    title: '操作',
    width: 138,
    fixed: 'right',
    render: (_, row, index) => {
      return h(UserServiceAction, {
        row,
        index,
      })
    },
  },
]
