import type { TableColumn } from '@3un/ui'
import type { CreditLogItem } from '@/api/user'

const store = useServiceStore()

export const columns: TableColumn[] = [
  {
    key: 'service',
    title: '项目',
    width: 220,
    render: (_, row: CreditLogItem) => {
      if (!row.packageId) return '积分充值'
      const service = store.services.get(row.packageId)!
      return `${service.id} - ${service.title}`
    }
  },
  {
    key: 'imeiNo',
    title: 'IMEI',
    width: 180
  },
  {
    key: 'credits',
    title: '变动金额',
    width: 88,
    render: (value: number, row: CreditLogItem) => {
      const isSubmit = /订单提交|Code Request/.test(row.description)
      const isReduce = isSubmit || row.description === '管理员扣除积分'
      const label = isReduce ? `-${Math.abs(value)}` : `+${value}`
      const color = isReduce ? 'text-rose-500' : 'text-emerald-500'

      return h('span', { class: color }, label)
    }
  },
  // {
  //   key: 'creditsLeft',
  //   title: '余额',
  //   width: 64
  // },
  {
    key: 'description',
    title: '变更原因',
    width: 280
  },
  {
    key: 'historyDtTm',
    title: '变更时间',
    width: 180
  },
  {
    key: 'ip',
    title: 'IP',
    width: 180
  },
  {
    key: 'comments',
    title: '备注',
    minWidth: 180
  }
]
