import UpstreamAction from '../components/UpstreamAction.vue'

import { XSwitch, type XColDef, XTag } from '@3un/ui'
import { API_TYPE_MAP } from '@3un/utils'
import { h } from 'vue'

import type { Upstream } from '@/inters/upstream'
import { updateUpstream } from '@/api/upstream'

export const columns: XColDef<Upstream> = [
  { key: 'apiTitle', title: 'API名称', width: 225 },
  {
    key: 'accountId',
    title: '用户名',
    width: 108,
    cellEmpty: '--'
  },
  {
    key: 'apiKey',
    title: 'API密钥',
    width: 300,
    cellEmpty: '--'
  },
  {
    key: 'apiType',
    title: 'API类型',
    width: 88,
    render(value) {
      return h(XTag, API_TYPE_MAP[value])
    },
  },
  {
    key: 'serverUrl',
    title: 'API地址',
    minWidth: 350,
    render(value) {
      const [url, query] = value.split('?')
      if (query) {
        const list = query.split('&')
        return h('div', [
          h('div', { class: 'underline' }, url),
          ...list.map((item: string) => {
            const [key, value] = item.split('=')
            return h('div', `${key}：${value || '--'}`)
          }),
        ])
      }

      return h('div', url)
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
    width: 154,
    fixed: 'right',
    render(_, row, index) {
      return h(UpstreamAction, { row, index })
    },
  },
]