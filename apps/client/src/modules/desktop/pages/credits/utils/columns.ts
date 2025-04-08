import type { TableColumn } from '@3un/ui'

import type { CreditLogItem } from '@/api/user'

export const columns: TableColumn[] = [
  {
    key: 'service',
    title: '项目',
    width: 220,
    render: (_, row: CreditLogItem) => {
      if (!row) return '-'
      if (row.packageId) {
        const id = row.packageId ?? 0
        const title = row.packageTitle ?? '找不到服务'
        return `${id} - ${title}`
      }
      return '积分充值'
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
    width: 108,
    render: (_, row: CreditLogItem) => {
      if (!row) return '-'
      const isSubmit = row.description.includes('订单提交')
      const value = isSubmit ? `-${row.credits}` : `+${row.credits}`
      const color = isSubmit ? 'text-rose-500' : 'text-emerald-500'
      return h('span', { class: color }, value)
    }
  },
  {
    key: 'creditsLeft',
    title: '余额',
    width: 64
  },
  {
    key: 'description',
    title: '变更原因',
    width: 220
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
    width: 180
  }
]
