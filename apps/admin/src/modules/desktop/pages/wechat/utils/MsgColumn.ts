import MsgAction from '../components/MsgAction.vue'

import type { CustomMsg } from '@/inters/wechat'
import type { XColDef } from '@3un/ui'
import { h } from 'vue'

export const columns: XColDef<CustomMsg> = [
  { key: 'id', title: '消息ID', width: 72 },
  { key: 'keywords', title: '关键词', width: 300 },
  {
    key: 'content',
    title: '内容',
    minWidth: 320,
    render: (value) => {
      value = value.replaceAll('\n', '<br>')
      return h('div', { innerHTML: value })
    }
  },
  {
    key: 'action',
    title: '操作',
    width: 148,
    render: (_, row, index) => {
      return h(MsgAction, { row, index })
    }
  },
]
