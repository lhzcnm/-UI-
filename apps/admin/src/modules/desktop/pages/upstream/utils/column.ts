import UpstreamAction from '../components/UpstreamAction.vue'

import { XSwitch, type XColDef, XTag } from '@3un/ui'
import { API_TYPE_MAP } from '@3un/utils'
import { h } from 'vue'

import type { Upstream } from '@/inters/upstream'
import { updateUpstream } from '@/api/upstream'

export const columns: XColDef<Upstream> = [
  {
    key: 'apiTitle',
    title: 'API名称',
    width: 225,
  },  
  {
    key: 'accountId',
    title: '用户名',
    minWidth: 108,
  },
  {
    key: 'apiKey',
    title: 'API密钥',
    minWidth: 225,
  },
  {
    key: 'serverUrl',
    title: 'API地址',
    minWidth: 225,
    tdClassName: 'truncate',
  },
  {
    key: 'apiType',
    title: 'API类型',
    width: 108,
    render(value) {
      return h(XTag, API_TYPE_MAP[value])
    },
  },
  {
    key: 'disableApi',
    title: '禁用',
    width: 128,
    render(value, row) {
      return h(XSwitch, {
        modelValue: value,
        'onUpdate:modelValue': async (val) => {
          const oldVal = row.disableApi
          const response = updateUpstream({
            apiId: row.apiId,
            disableApi: val,
          })

          row.disableApi = val
          response.catch(() => {
            setTimeout(() => row.disableApi = oldVal, 1000)
          })
        },
      })
    },
  },
  {
    key: 'action',
    title: '操作',
    width: 88,
    render(_, row, index) {
      return h(UpstreamAction, { row, index })
    },
  },
]