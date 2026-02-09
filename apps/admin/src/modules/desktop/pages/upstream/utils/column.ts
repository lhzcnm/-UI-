import UpstreamAction from '../components/UpstreamAction.vue'

import { XSwitch, type XColDef, XTag } from '@3un/ui'
import { API_TYPE_MAP } from '@3un/utils'
import { h } from 'vue'

import type { Upstream } from '@/inters/upstream'
import { updateUpstream } from '@/api/upstream'
import { toast } from 'vue-sonner'

export const columns: XColDef<Upstream> = [
  { key: 'apiId', title: 'APIID', width: 68 },
  {
    key: 'apiTitle',
    title: 'API名称',
    width: 225,
    isTwoClick: true,
    isTwoClickType: 'input',
    async onSave(val, row) {
      const body = { ...row, apiTitle: val }
      await updateUpstream(body)
      toast.success('更新成功')
    },
    render(value) {
      return h('div', value)
    }
  },
  {
    key: 'serverUrl',
    title: 'API地址',
    minWidth: 350,
    isTwoClick: true,
    isTwoClickType: 'input',
    async onSave(val, row) {
      const body = { ...row, serverUrl: val }
      await updateUpstream(body)
      toast.success('更新成功')
    },
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
    key: 'accountId',
    title: '用户名',
    width: 108,
    cellEmpty: '--',
    isTwoClick: true,
    isTwoClickType: 'input',
    async onSave(val, row) {
      const body = { ...row, accountId: val }
      await updateUpstream(body)
      toast.success('更新成功')
    },
    render(value) {
      return h('div', value)
    }
  },
  {
    key: 'apiKey',
    title: 'API密钥',
    width: 300,
    cellEmpty: '--',
    isTwoClick: true,
    isTwoClickType: 'input',
    async onSave(val, row) {
      const body = { ...row, apiKey: val }
      await updateUpstream(body)
      toast.success('更新成功')
    },
    render(value) {
      return h('div', value)
    }
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