import { h } from 'vue'
import { XInputNumber, type XColDef } from '@3un/ui'

import type { Quotation, QuotationUpdateParams } from '@/inters/quotation'
import { OLD_QUOTATION_STORE } from '.'
import { updateOldQuotations } from '@/api/quotation'
import { toast } from 'vue-sonner'
import OldQuotationAction from '../components/OldQuotationAction.vue'

export const columns: XColDef<Quotation> = [
  {
    key: 'id',
    title: 'ID',
    width: 72,
  },
  {
    key: 'modelCategory',
    title: '设备型号',
    width: 256,
  },
  {
    key: 'model',
    title: '设备类型',
    width: 256,
  },
  {
    key: 'big',
    title: '设备内存',
    width: 88,
  },
  {
    key: 'status',
    title: '设备状态',
    width: 128,
  },
  {
    key: 'statusLocal',
    title: '设备状态En',
    width: 128,
  },
  {
    key: 'basePrice',
    title: '基础价格',
    width: 128,
    render: (_, row) => {
      const store = inject(OLD_QUOTATION_STORE)!
      async function handleChange() {
        const data: QuotationUpdateParams = {
          ...row,
          quoteCategory: store.category
        }

        try {
          await updateOldQuotations(data)
          return toast.success('修改成功')
        } catch {
          return toast.error('修改失败')
        }
      }

      return h(XInputNumber, {
        modelValue: row.basePrice,
        'onUpdate:modelValue': (val) => {
          row.basePrice = val
        },
        onChange: handleChange
      })
    } 
  },
  {
    key: 'action',
    title: '操作',
    width: 98,
    fixed: 'right',
    render: (_, row) => {
      return h(OldQuotationAction, {
        row: row,
      })
    }
  }
]
