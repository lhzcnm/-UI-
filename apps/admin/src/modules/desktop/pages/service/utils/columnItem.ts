import { XButton, XInput, XSwitch, type ColDef } from '@3un/ui'
import type { Service } from '@/inters/services'

const store =  useServiceStore()
export const columns: ColDef<Service> = [
  {
    key: 'packageId',
    title: '服务ID',
    width: 88,
  },
  {
    key: 'categoryId',
    title: '所在服务组',
    width: 180,
    render: (value) => {
      const group = store.groupMap.get(value)
      return group ? group.category : '未知'
    }
  },
  {
    key: 'packagePrice',
    title: '服务价格',
    width: 88,
  },
  {
    key: 'apiId',
    title: '服务 API',
    width: 200,
    render(value) {
      const api = store.items.find(item => item.apiId === value)
      return h(
        'a',
        {
          href: 'javascript:void(0)',
          class: 'hover:text-emerald-600 underline'
        },
        api?.apiName || '编辑'
      )
    }
  },
  {
    key: 'packageTitle',
    title: '服务名称',
    minWidth: 220,
  },
  {
    key: 'packageTitleLocal',
    title: '服务名称EN',
    minWidth: 220,
    tdClassName: 'break-words',
    cellEmpty: '-',
  },
  {
    key: 'packageOrderBy',
    title: '排序',
    width: 128,
    render(value, row) {
      return h(
        XInput,
        {
          modelValue: value,
          'onUpdate:modelValue': (val) => {
            row.packageOrderBy = +val
          },
        },
      )
    },
  },
  {
    key: 'disableCategory',
    title: '禁用',
    width: 168,
    render(value, row) {
      return h(
        XSwitch,
        {
          modelValue: value,
          'onUpdate:modelValue': (val) => {
            row.disablePackage = val
          },
        },
      )
    },
  },
  {
    key: 'action',
    title: '操作',
    width: 64,
    fixed: 'right',
    render: (_, row, index) => {
      return h(XButton, { size: 'sm' }, () => '编辑')
    }
  }
]
