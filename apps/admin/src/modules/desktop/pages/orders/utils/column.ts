import { zOrderUpdateForm, type Order } from '@/inters/orders'
import { ORDER_STORE } from '../utils'

import { ORDER_STATUS_MAP, SUBMIT_METHOD_MAP } from '@3un/utils'
import { XButton, XTag, type XColDef } from "@3un/ui"
import { h } from 'vue'

const serviceStore = useServiceStore()

export const columns: XColDef<Order> = [
  {
    key: 'codeId',
    title: '订单号',
    width: 100,
  },
  {
    key: 'orderIdFromServer',
    title: '上游订单号',
    width: 100,
  },
  {
    key: 'packageId',
    title: '服务',
    width: 225,
    render(value) {
      const service = serviceStore.itemMap.get(value)
      return service ? `${service.packageId} - ${service.packageTitle}` : '--'
    }
  },
  {
    key: 'userId',
    title: '用户',
    width: 88,
  },
  {
    key: 'codeStatusId',
    title: '订单状态',
    width: 108,
    render(value) {
      return h(XTag, {
        ...ORDER_STATUS_MAP[value],
        solid: true,
      })
    }
  },
  {
    key: 'downloaded',
    title: '已经推送',
    width: 100,
    render(value) {
      return value ? 'YES' : 'NO'
    }
  },
  {
    key: 'credits',
    title: '积分',
    width: 78,
  },
  {
    key: 'imeiNo',
    title: 'IMEI/SN',
    width: 154,
  },
  {
    key: 'code',
    title: '订单结果',
    minWidth: 280,
    render(value) {
      return h('span', { innerHTML: value })
    }
  },
  {
    key: 'submitMethod',
    title: '提交方式',
    width: 100,
    render(value) {
      return SUBMIT_METHOD_MAP[value].label
    }
  },
  {
    key: 'requestedAt',
    title: '耗时',
    width: 180,
    render(value, row) {
      const updateTimeDate = new Date(row.updateTime).getTime()
      const requestedAtDate = new Date(value).getTime()
      const diffTime = updateTimeDate - requestedAtDate
      const diff = Math.round(diffTime / 1000)
      return diff < 1 ? '<1s' : `${diff}s`
    }
  },
  {
    key: 'action',
    title: '操作',
    width: 88,
    fixed: 'right',
    render(_, row, index) {
      const store = inject(ORDER_STORE)!
      function handleUpdate() {
        store.formUpdate = zOrderUpdateForm.parse({
          codeId: row.codeId,
          imeiNo: row.imeiNo,
          code: row.code.split('<br>').join('\n'),
          codeStatusId: row.codeStatusId,
          originalStatus: row.codeStatusId,
          messageFromServer: row.messageFromServer,
          orderIdFromServer: row.orderIdFromServer,
        })

        store.index = index
        store.visibleUpdate = true
      }

      return h(XButton, {
        icon: 'lucide:edit',
        size: 'sm', label: '编辑',
        onClick: handleUpdate,
      })
    }
  },
]
