import AdminAction from '../components/AdminAction.vue'

import { XSwitch, type XColDef } from '@3un/ui'
import { h } from 'vue'

import type { User } from '@/inters/users'
import { updateUser } from '@/api/users'

export const columns: XColDef<User> = [
  { key: 'userId', title: '管理员ID', width: 88 },
  { key: 'userName', title: '账号', minWidth: 144 },
  { key: 'nickName', title: '昵称', minWidth: 144 },
  { key: 'addedAt', title: '创建时间', width: 180 },
  {
    key: 'disableUser',
    title: '禁用',
    width: 128,
    render(value, row) {
      return h(XSwitch, {
        modelValue: value,
        'onUpdate:modelValue': async (val) => {
          const oldVal = row.disableUser
          const response = updateUser({
            userId: row.userId,
            disableUser: val,
          })

          row.disableUser = val
          response.catch(() => {
            setTimeout(() => row.disableUser = oldVal, 1000)
          })
        },
      })
    },
  },
  {
    key: 'action',
    title: '操作',
    width: 164,
    fixed: 'right',
    render(_, row, index) {
      return h(AdminAction, { index, row })
    },
  },
]
