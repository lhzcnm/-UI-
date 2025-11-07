import type { XColDef } from '@3un/ui'
import { h } from 'vue'

import type { UserPaid } from '@/inters/users'

export const columns: XColDef<UserPaid> = [
  {
    key: 'userId',
    title: 'ID',
    width: 72,
    render: (value) => {
      return h('a', {
        href: `/users?uid=${value}`,
        class: 'underline hover:text-success'
      }, value)
    }
  },
  {
    key: 'headImgUrl',
    title: '头像',
    width: 54,
    render(value) {
      const mode = import.meta.env.VITE_APP_MODE
      const defaultAvatar = `/${mode}/default_avatar.jpg`

      return h('img', {
        src: value || defaultAvatar,
        class: 'size-7 rounded border',
      })
    },
  },
  {
    key: 'userName',
    title: '账号',
    width: 128,
  },
  {
    key: 'nickName',
    title: '昵称',
    width: 154,
  },
  {
    key: 'credits',
    title: '积分',
    width: 88,
  },
  {
    key: 'weixinOpenId',
    title: '微信ID',
    minWidth: 320,
  },
  {
    key: 'memberExp',
    title: '会员到期时间',
    width: 180,
  },
  {
    key: 'remark',
    title: '备注',
    width: 180,
  },
]
