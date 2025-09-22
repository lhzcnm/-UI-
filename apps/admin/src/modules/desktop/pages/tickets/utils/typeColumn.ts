import { XButton, XInput, XInputNumber, XSwitch, type XBtnSplitOption, type XColDef } from "@3un/ui"
import { h, inject } from "vue"

import type { TicketType } from "@/inters/ticket"
import { updateTicketType, deleteTicketType } from "@/api/ticket"
import { TICKET_STORE } from "../utils"

export const column: XColDef<TicketType> = [
  {
    key: 'departmentName',
    title: '常见问题',
    minWidth: 150,
    render: (_, raw) => {
      return h(XInput, {
        modelValue: raw.departmentName,
        "onUpdate:modelValue": (val: string) => {
          raw.departmentName = val ?? ''
        }
      })
    }
  },
  {
    key: 'departmentNameEn',
    title: '常见问题En',
    minWidth: 150,
    render: (_, raw) => {
      return h(XInput, {
        modelValue: raw.departmentNameEn,
        "onUpdate:modelValue": (val: string) => {
          raw.departmentName = val ?? ''
        }
      })
    }
  },
  {
    key: 'status',
    title: '启用',
    width: 68,
    render: (value, row) => {
      return h(XSwitch, {
        size: 'sm',
        activeValue: 0,
        inactiveValue: 1,
        modelValue: value,
        'onUpdate:modelValue': async (val) => {
          const oldVal = row.status
          const response = updateTicketType({
            departmentId: row.departmentId,
            status: val,
          })

          row.status = val
          response.catch(() => {
            setTimeout(() => row.status = oldVal, 1000)
          })
        },
      })
    },
  },
  {
    key: 'deptOrder',
    title: '排序',
    width: 128,
    render: (value, row) => {
      return h(XInputNumber, {
        min: 1, step: 1,
        size: 'sm',
        modelValue: value,
        'onUpdate:modelValue': (value) => {
          const oldVal = row.deptOrder
          const response = updateTicketType({
            departmentId: row.departmentId,
            deptOrder: value,
          })
          
          row.deptOrder = value
          response.catch(() => {
            setTimeout(() => row.deptOrder = oldVal, 1000)
          })
        },
      })
    },
  },
  {
    key: 'action',
    title: '操作',
    width: 78,
    render: (_, row, index) => {
      const store = inject(TICKET_STORE)!

      const options: XBtnSplitOption[] = [
        {
          label: ""
        }
      ]
      const handleDelete = () => {
        deleteTicketType(row.departmentId).then(() => {
          store.types.splice(index, 1)
        })
      }

      return h(XButton, {
        icon: 'lucide:trash-2',
        color: 'danger',
        size: 'sm',
        label: '删除',
        onClick: handleDelete,
      })
    }
  },
]
