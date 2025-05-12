import { XButton, XInput, XSwitch, type XColDef } from '@3un/ui'
import { zService, type Service } from '@/inters/services'
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
          class: 'hover:text-success underline',
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
    render(value, row) {
      return h(XInput, {
        modelValue: value,
        'onUpdate:modelValue': (val) => {
          const oldVal = row.packageOrderBy
          const response = updateService({
            packageId: row.packageId,
            packageOrderBy: +val,
          })

          row.packageOrderBy = +val
          response.catch(() => {
            setTimeout(() => row.packageOrderBy = oldVal, 1000)
          })
        },
      })
    },
  },
  {
    key: 'disablePackage',
    title: '禁用',
    width: 128,
    render(value, row) {
      return h(XSwitch, {
        modelValue: value,
        'onUpdate:modelValue': async (val) => {
          const oldVal = row.disablePackage
          const response = updateService({
            packageId: row.packageId,
            disablePackage: val,
          })

          row.disablePackage = val
          response.catch(() => {
            setTimeout(() => row.disablePackage = oldVal, 1000)
          })
        },
      })
    },
  },
  {
    key: 'action',
    title: '操作',
    width: 64,
    fixed: 'right',
    render: (_, row) => {
      const store = inject(SERVICE_STORE)!
      const onClick = () => {
        store.form = zService.parse(row)
        store.visible = true
      }
      
      return h(XButton, { size: 'sm', onClick }, () => '编辑')
    }
  }
]
