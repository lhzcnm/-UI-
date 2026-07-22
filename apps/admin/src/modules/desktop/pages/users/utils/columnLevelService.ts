import LevelServiceAction from '../components/LevelServiceAction.vue'

import { type XColDef, XInputNumber } from '@3un/ui'
import { h } from 'vue'

import type { LevelService } from '@/inters/level'

export const columns: XColDef<LevelService> = [
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
    title: '价格',
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
    key: 'freeCount',
    title: '免费次数',
    width: 120,
    render: (_, row) => {
      return h(XInputNumber, {
        modelValue: row.freeCount,
        step: 1,
        precision: 2,
        size: 'sm',
        "onUpdate:modelValue": (val) => {
          row.freeCount = val
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
      return h(LevelServiceAction, {
        row,
        index
      })
    },
  },
]
