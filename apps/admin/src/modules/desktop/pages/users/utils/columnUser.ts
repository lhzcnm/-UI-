import type { User } from '@/inters/users'
import { XSwitch, type XColDef } from '@3un/ui'

import UserAction from '../components/UserAction.vue'
import UserApiCell from '../components/UserApiCell.vue'
import { refreshApiKey, refreshBulkApiKey, updateUser } from '@/api/users'

const levelStore = useLevelStore()
export const columns: XColDef<User> = [
  {
    key: 'userId',
    title: 'ID',
    width: 64,
  },
  {
    key: 'userName',
    title: '用户名',
    width: 128,
  },
  {
    key: 'nickName',
    title: '昵称',
    width: 128,
  },
  {
    key: 'pricePlanId',
    title: '会员等级',
    width: 108,
    render(value) {
      const level = levelStore.levelMap.get(value)
      return level ? level.pricePlan : '未知'
    },
  },
  {
    key: 'credits',
    title: '积分',
    width: 88,
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
    key: 'apiKey',
    title: 'API Key',
    width: 138,
    render(value, row, index) {
      return h(UserApiCell, {
        value, row, index,
        refresh: refreshApiKey
      })
    },
  },
  {
    key: 'bulkCheckApi',
    title: 'Bulk API Key',
    width: 138,
    render(value, row, index) {
      return h(UserApiCell, {
        value, row, index,
        refresh: refreshBulkApiKey
      })
    },
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
    render(_, row, index) {
      return h(UserAction, { row, index })
    },
  },
]
