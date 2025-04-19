import type { ServiceGroup } from '@/inters/services'
import { XButton, XInput, XSwitch, type ColDef } from "@3un/ui"
import { updateServiceGroup } from '@/api/services'
import { toast } from 'vue-sonner'

const serviceStore =  useServiceStore()
export const columns: ColDef<ServiceGroup> = [ 
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
      return h(
        XInput,
        {
          modelValue: value,
          'onUpdate:modelValue': (val) => {
            row.orderBy = +val
          },
        },
      )
    },
  },
  {
    key: 'disableCategory',
    title: '禁用',
    width: 168,
    render(value, row, index) {
      return h(
        XSwitch,
        {
          modelValue: value,
          'onUpdate:modelValue': async (val) => {
            const response = updateServiceGroup({
              categoryId: row.categoryId,
              disableCategory: val,
            })
            const current = serviceStore.groups[index]
            response.then(() => current.disableCategory = val)
            response.catch(() => {
              toast.warning('禁用失败')
              current.disableCategory = !val
            })
          },
        },
      )
    },
  },
  {
    key: 'action',
    title: '操作',
    width: 164,
    fixed: 'right',
    render: () => {
      return [
        h(XButton, { size: 'sm' }, () => '编辑'),
        h(XButton, { size: 'sm', color: 'emerald' }, () => '查看服务'),
      ]
    }
  }
]
