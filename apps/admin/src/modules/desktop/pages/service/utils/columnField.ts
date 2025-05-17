import FieldAction from '../components/FieldAction.vue'

import type { XColDef } from "@3un/ui"
import { XSwitch, XInputNumber } from '@3un/ui'

import type { ServiceField } from '@/inters/services'
import { updateServiceField } from "@/api/services"

const serviceStore = useServiceStore()
export const columns: XColDef<ServiceField> = [
  {
    key: 'id',
    title: '字段 ID',
    width: 64,
  },
  {
    key: 'service',
    title: '服务',
    width: 500,
    render(_, row) {
      const service = serviceStore.itemMap.get(row.serviceId)!
      if (!service) return '服务不存在'

      return `${service.packageId} - ${service.packageTitle}`
    },
  },
  {
    key: 'name',
    title: '字段名称',
    width: 128,
  },
  {
    key: 'width',
    title: '字段宽度',
    width: 128,
  },
  {
    key: 'status',
    title: '显示',
    width: 98,
    render(value, row) {
      return h(XSwitch, {
        modelValue: value,
        activeValue: 1,
        inactiveValue: 0,
        'onUpdate:modelValue': async (val) => {
          const oldVal = row.status
          const response = updateServiceField({
            id: row.id,
            status: val,
          })
          
          row.status = val
          response.catch(() => {
            setTimeout(() => row.status = oldVal, 1000)
          })
        },
      })
    }
  },
  {
    key: 'sortNum',
    title: '排序(值越大越靠前)',
    width: 164,
    render(value, row) {
      return h(XInputNumber, {
        size: 'sm',
        modelValue: value,
        'onUpdate:modelValue': (val) => {
          const oldVal = row.sortNum
          const response = updateServiceField({
            id: row.id,
            sortNum: +val,
          })

          row.sortNum = +val
          response.catch(() => {
            setTimeout(() => row.sortNum = oldVal, 1000)
          })
        },
      })
    },
  },
  {
    key: 'action',
    title: '操作',
    minWidth: 88,
    fixed: 'right',
    render: (_, row, index) => {
      return h(FieldAction, { row, index })
    }
  }
]
