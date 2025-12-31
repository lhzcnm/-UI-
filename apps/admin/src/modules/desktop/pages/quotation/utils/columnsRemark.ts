import type { XColDef } from '@3un/ui'

import type { Remark } from '@/inters/quotation/remark'
import { REMARK_STORE } from '.'
import RemarkTableAction from '../components/RemarkTableAction.vue'
import { h } from 'vue'
import { QUOTATION_MAP_LIST } from '@/utils/quotation'

export const columnsRemark: XColDef<Remark> = [
  {
    key: 'id',
    title: 'ID',
    width: 68,
  },
  {
    key: 'brand',
    title: '设备品牌',
    width: 198,
    render: (value) => {
      const store = inject(REMARK_STORE)!
      const desc = store.brandsMap.get(value) || "未知品牌"
      return desc
    }
  },
  {
    key: 'model',
    title: '设备',
    width: 208,
  },
  {
    key: 'priceType',
    title: '报价单',
    width: 208,
    render: (value) => {
      const quotation = QUOTATION_MAP_LIST.find(item => item.value === value)
      return quotation?.label
    }
  },
  {
    key: 'remark',
    title: '备注内容',
    minWidth: 138,
  },
  {
    key: 'remarkLocal',
    title: '备注内容En',
    minWidth: 158,
  },
  {
    key: 'updateTime',
    title: '上次更新时间',
    minWidth: 158,
  },
  {
    key: 'action',
    title: '操作',
    width: 88,
    fixed: 'right',
    render: (_, row) => {
      return h(RemarkTableAction, {
        row: row
      })
    }
  }
]
