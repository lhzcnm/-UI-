import { XButton, type XColDef, XInputNumber } from '@3un/ui'
import { h } from 'vue'

import type { LevelService } from '@/inters/level'
import { deleteLevelService } from '@/api/level'
import { USER_STORE } from '.'

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
    render: (value) => {
      return h(XInputNumber, {
        modelValue: value,
        step: 0.01,
        precision: 2,
        size: 'sm',
      })
    },
  },
  {
    key: 'actions',
    title: '操作',
    width: 80,
    render: (_, row, index) => {
      const store = inject(USER_STORE)!
      function handleDelete() {
        deleteLevelService(row.id).then(() => {
          store.services.splice(index, 1)
        })
      }

      return h(XButton, {
        size: 'sm',
        label: '删除',
        color: 'danger',
        icon: 'lucide:trash-2',
        onClick: handleDelete,
      })
    },
  },
]
