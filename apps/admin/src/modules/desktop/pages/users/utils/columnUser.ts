import UserAction from '../components/UserAction.vue'

import { XSwitch, type XColDef } from '@3un/ui'
import { USER_ROLE_MAP } from '@3un/utils'
import { h } from 'vue'

import type { User } from '@/inters/users'
import { updateUser } from '@/api/users'

export const columns: XColDef<User> = [
  {
    key: 'userId',
    title: 'ID',
    width: 72,
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
    key: 'pricePlanId',
    title: '会员等级',
    width: 108,
    render(value) {
      const levelStore = useLevelStore()
      const level = levelStore.levelMap.get(value)
      return level ? level.pricePlan : '未知'
    },
  },
  {
    key: 'role',
    title: '角色',
    width: 108,
    render(value) {
      return USER_ROLE_MAP[value].label
    },
  },
  {
    key: 'credits',
    title: '积分',
    width: 88,
  },
  {
    key: 'voucherCredits',
    title: '赠送积分',
    width: 158,
    render: (_, row) => {
      return h(
        "div",
        { class: "flex flex-col" },
        [
          h("span", `查询类: ${row.voucherCredits}`),
          h("span", `解锁类: ${row.unlockCredits}`)
        ]
      )
    }
  },
  {
    key: 'weiXinOpenid',
    title: '微信ID',
    minWidth: 320,
  },
  {
    key: 'addedAt',
    title: '注册时间',
    width: 180,
  },
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
    width: 98,
    fixed: 'right',
    render(_, row, index) {
      return h(UserAction, { row, index })
    },
  },
]
