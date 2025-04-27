import { XButton, XInput, XSwitch, type XColDef } from '@3un/ui'
import type { Service } from '@/inters/services'
import { updateService } from '@/api/services'
import { SERVICE_STORE } from '.'

const serviceStore =  useServiceStore()
export const columns: XColDef<Service> = [
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
      const group = serviceStore.groupMap.get(value)
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
      const api = serviceStore.items
        .find(item => item.apiId === value)

      return h(
        'a',
        {
          href: 'javascript:void(0)',
          class: 'hover:text-success underline'
        },
        api?.apiName || '编辑'
      )
    }
  },
  {
    key: 'tmpTitle',
    title: '服务简称',
    width: 220,
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
    render(value, _, index) {
      return h(
        XInput,
        {
          modelValue: value,
          'onUpdate:modelValue': (val) => {
            serviceStore.items[index].packageOrderBy = +val
          },
        },
      )
    },
  },
  {
    key: 'disablePackage',
    title: '禁用',
    width: 168,
    render(value, row, index) {
      return h(
        XSwitch,
        {
          modelValue: value,
          'onUpdate:modelValue': async (val) => {
            const response = updateService({
              packageId: row.packageId,
              disablePackage: val,
            })
            const current = serviceStore.items[index]
            response.then(() => current.disablePackage = val)
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
      const store = inject(SERVICE_STORE)!
      const onClick = () => {
        store.index = index
        store.form = row
        store.visable = true
      }

      return h(XButton, { size: 'sm', onClick }, () => '编辑')
    }
  }
]
