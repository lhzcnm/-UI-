import { XButton, XInputNumber, type XColDef } from '@3un/ui'
import { toast } from 'vue-sonner'
import { h } from 'vue'
import { debounce, xconfirm } from '@3un/utils'
import { SCOPE_TYPE, SCOPE_TYPE_MAP  } from '@3un/utils'

import { type Product, type ProductUpdate } from '@/inters/product'
import { deleteProduct, updateProductRecord } from '@/api/product'
import { HOME_STORE } from '.'

const handleChange = debounce(async (row: Product) => {
  try {
    const body: ProductUpdate = {
      id: row.id,
      sku: row.sku,
      model: row.model,
      color: row.colorName ?? '',
      capacity: row.capacity ?? '',
      grade: row.grade,
      price: row.price ?? 0.00,
      lockStatus: row.lockStatus,
      scopeType: row.scopeType,
    }
    await updateProductRecord([body])
    toast.success('更新价格成功')
  } catch {}
}, 300)

export const columns: XColDef<Product> = [
  {
    key: 'id',
    title: 'ID',
    width: 88,
  },
  {
    key: 'sku',
    title: 'SKU',
    width: 208,
  },
  {
    key: 'model',
    title: '型号',
    minWidth: 238,
  },
  {
    key: 'capacity',
    title: '内存',
    width: 108,
    render(value) {
      return h('span', {}, value || '无')
    }
  },
  {
    key: 'colorName',
    title: '颜色',
    width: 128,
    render(value) {
      return h('span', {}, value || '无')
    }
  },
  {
    key: 'scopeType',
    title: '匹配范围',
    width: 208,
    render(value: SCOPE_TYPE) {
      const type = SCOPE_TYPE_MAP[value]

      return type.label
    }
  },
  {
    key: 'lockStatus',
    title: '锁状态',
    width: 108,
  },
  {
    key: 'grade',
    title: '等级',
    width: 108,
  },
  {
    key: 'price',
    title: '价格',
    width: 178,
    render(_, row) {
      row.price = row.price ?? 0
      return h(
        XInputNumber,
        {
          uiInput: 'w-16',
          step: 0.01,
          precision: 2,
          modelValue: row.price,
          "onUpdate:modelValue": (value: number) => [
            row.price = value < 0 ? 0 : value,
          ],
          onInput: (e: Event) => {
            const target = e.target as HTMLInputElement
            
            target.value = target.value.replace(/[^0-9.]/g, '')

            const parts = target.value.split('.')
            if (parts.length > 2) {
              target.value = parts[0] + '.' + parts.slice(1).join('')
            }

            if (parts[1]?.length > 2) {
              target.value = parts[0] + '.' + parts[1].slice(0, 2)
            }

            row.price = Number(target.value) || 0
          },
          onChange: () => {
            if (row.price && row.price < 0) return
            const snapshot: Product = row
            handleChange(snapshot)
          },
        },
      )
    }
  },
  {
    key: 'time',
    title: '导入时间',
    width: 168,
  },
  {
    key: 'updatedAt',
    title: '更新时间',
    width: 168,
  },
  {
    key: 'action',
    title: '操作',
    width: 108,
    fixed: 'right',
    render(_, row) {
      const store = inject(HOME_STORE)!

      async function handleDelete() {
        if (!await xconfirm('是否确认删除该数据?')) return

        try {
          await deleteProduct([row.id])
          toast.success('删除成功')
          store.refresh = !store.refresh
        } catch {}
      }
      return h(XButton, {
        label: '删除',
        color: 'danger',
        size: 'sm',
        icon: 'tabler:trash',
        onClick: async () => {
          await handleDelete()
        }
      })
    }
  }
]
