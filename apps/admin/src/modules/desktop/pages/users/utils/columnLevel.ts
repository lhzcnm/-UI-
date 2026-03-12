import LevelAction from '../components/LevelAction.vue'

import type { XColDef } from '@3un/ui'
import { XSwitch } from '@3un/ui'
import { h } from 'vue'

import type { Level } from '@/inters/level'
import { updateLevel } from '@/api/level'
import { ACCESS_LEVEL, ACCESS_LEVEL_MAP } from '@3un/utils'

export const columns: XColDef<Level> = [
  {
    key: 'pricePlanId',
    title: '等级ID',
    align: 'center',
    width: 64,
  },
  {
    key: 'pricePlan',
    title: '等级名称(中文)',
    minWidth: 128,
  },
  {
    key: 'pricePlanLocal',
    title: '等级名称(英文)',
    minWidth: 128,
  },
  {
    key: 'accessLevel',
    title: '会员组权限',
    width: 208,
    render(value) {
      const { label } = ACCESS_LEVEL_MAP[value as ACCESS_LEVEL]
      return label
    }
  },
  {
    key: 'enableDevice',
    title: '启用设备页面',
    width: 128,
    render(value, row) {
      return h(XSwitch, {
        modelValue: value,
        'onUpdate:modelValue': async (val) => {
          const oldVal = row.enableDevice
          const response = updateLevel({
            pricePlanId: row.pricePlanId,
            enableDevice: val,
          })

          row.enableDevice = val
          response.catch(() => {
            setTimeout(() => row.enableDevice = oldVal, 1000)
          })
        },
      })
    },
  },
  {
    key: 'disablePricePlan',
    title: '是否禁用',
    width: 128,
    render(value, row) {
      return h(XSwitch, {
        modelValue: value,
        'onUpdate:modelValue': async (val) => {
          const oldVal = row.disablePricePlan
          const response = updateLevel({
            pricePlanId: row.pricePlanId,
            disablePricePlan: val,
          })

          row.disablePricePlan = val
          response.catch(() => {
            setTimeout(() => row.disablePricePlan = oldVal, 1000)
          })
        },
      })
    },
  },
  {
    key: 'action',
    title: '操作',
    width: 128,
    render(_, row, index) {
      return h(LevelAction, { index, row })
    },
  },
]
