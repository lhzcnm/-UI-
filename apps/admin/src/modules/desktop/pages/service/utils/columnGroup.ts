import { zServiceGroup, type ServiceGroup } from '@/inters/services'
import { XButton, XInput, XSwitch, type XColDef } from "@3un/ui"
import { updateServiceGroup } from '@/api/services'
import { GROUP_STORE } from '.'

export const columns: XColDef<ServiceGroup> = [ 
  {
    key: 'categoryId',
    title: '服务组ID',
    width: 88,
  },
  {
    key: 'category',
    title: '服务组名称',
    width: 220,
  },
  {
    key: 'categoryLocal',
    title: '服务组名称EN',
    width: 320,
  },
  {
    key: 'orderBy',
    title: '排序(值越大越靠前)',
    minWidth: 180,
    render(value, row) {
      return h(XInput, {
        modelValue: value,
        'onUpdate:modelValue': (val) => {
          const oldVal = row.orderBy
          const response = updateServiceGroup({
            categoryId: row.categoryId,
            orderBy: +val,
          })

          row.orderBy = +val
          response.catch(() => {
            setTimeout(() => row.orderBy = oldVal, 1000)
          })
        },
      })
    },
  },
  {
    key: 'disableCategory',
    title: '禁用',
    width: 168,
    render(value, row) {
      return h(XSwitch, {
        modelValue: value,
        'onUpdate:modelValue': async (val) => {
          const oldVal = row.disableCategory
          const response = updateServiceGroup({
            categoryId: row.categoryId,
            disableCategory: val,
          })
          
          row.disableCategory = val
          response.catch(() => {
            setTimeout(() => row.disableCategory = oldVal, 1000)
          })
        },
      })
    },
  },
  {
    key: 'action',
    title: '操作',
    width: 164,
    fixed: 'right',
    render: (_, row) => {
      const store = inject(GROUP_STORE)!
      const onClick = () => {
        store.form = zServiceGroup.parse(row)
        store.visable = true
      }

      return [
        h(XButton, { size: 'sm', onClick }, () => '编辑'),
        h(XButton, { size: 'sm', color: 'success' }, () => '查看服务'),
      ]
    }
  }
]
