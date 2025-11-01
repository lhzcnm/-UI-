import type { Quotation } from '@/inters/quotation'
import type { XColDef } from '@3un/ui'

export const columns: XColDef<Quotation> = [
  {
    key: 'id',
    title: 'ID',
    width: 72,
  },
  {
    key: 'modelCategory',
    title: '设备型号',
    width: 256,
  },
  {
    key: 'model',
    title: '设备类型',
    width: 256,
  },
  {
    key: 'status',
    title: '设备状态',
    width: 128,
  },
  {
    key: 'basePrice',
    title: '基础价格',
    width: 128,
  },
]
