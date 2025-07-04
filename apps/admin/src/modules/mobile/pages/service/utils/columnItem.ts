import { SERVICE_STORE } from '.'

import { updateService } from '@/api/services'
import { zService, type Service } from '@/inters/services'

import { XButton, XInputNumber, XSwitch, type XColDef } from '@3un/ui'
import { h } from 'vue'

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
      const serviceStore = useServiceStore()
      const group = serviceStore.groupMap.get(value)
      return group ? group.category : '默认服务组'
    }
  },
  {
    key: 'tmpTitle',
    title: '服务简称',
    minWidth: 220,
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
    key: 'packagePrice',
    title: '服务价格',
    width: 88,
  },
  {
    key: 'apiId',
    title: '服务 API',
    width: 200,
    render(value, row) {
      const serviceStore = useServiceStore()
      const store = inject(SERVICE_STORE)!
      const api = serviceStore.items
        .find(item => item.apiId === value)

      function openUpstream() {
        store.visibleUpstream = true
        store.formUpstream = {
          serviceId: row.packageId,
          apiId: value === -1 ? undefined : value,
          externalNetworkId: row.externalNetworkId,
        }
      }
      
      return h(
        'a',
        {
          href: 'javascript:void(0)',
          class: 'hover:text-success underline',
          onClick: openUpstream,
        },
        api?.apiName || '编辑'
      )
    }
  },
  {
    key: 'packageOrderBy',
    title: '排序',
    width: 128,
    render(value, row) {
      return h(XInputNumber, {
        size: 'sm',
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
    width: 108,
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
      const serviceStore = useServiceStore()
      const store = inject(SERVICE_STORE)!
      const onClick = () => {
        store.formBase = zService.parse(row)
        store.index = serviceStore.items
          .findIndex(item => item.packageId === row.packageId)
        store.visibleBase = true
      }
      
      return h(XButton, { size: 'sm', label: '编辑', onClick })
    }
  }
]
