import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import type { CreditLogItem } from '@/api/user'

type SCRP = ICellRendererParams<CreditLogItem>
interface TableCreditLogItem {
  service: string
  imeiNo: string
  ip: string
  credits: number
  creditsLeft: string
  description: string
  historyDtTm: string
  comments: string
}

const columns: ColDef<TableCreditLogItem>[] = [
  {
    field: 'service',
    headerName: '项目',
    minWidth: 220,
    cellRenderer: (params: SCRP) => {
      if (!params.data) return '-'
      if (params.data.packageId) {
        const id = params.data.packageId ?? 0
        const title = params.data.packageTitle ?? '找不到服务'
        return `${id} - ${title}`
      }
      return '积分充值'
    },
  },
  {
    headerName: 'IMEI',
    field: 'imeiNo',
    minWidth: 180,
  },
  {
    headerName: '变动金额',
    field: 'credits',
    minWidth: 108,
    cellRenderer: (params: SCRP) => {
      if (!params.data) return '-'
      const isSubmit = params.data.description.includes('订单提交')
      const value = isSubmit ? `-${params.data.credits}` : `+${params.data.credits}`
      const color = isSubmit ? 'text-rose-500' : 'text-emerald-500'
      return `<span class="${color}">${value}</span>`
    },
  },
  {
    headerName: '余额',
    field: 'creditsLeft',
    minWidth: 64,
  },
  {
    headerName: '变更原因',
    field: 'description',
    minWidth: 220,
  },
  {
    headerName: '变更时间',
    field: 'historyDtTm',
    minWidth: 180,
  },
  {
    headerName: 'IP',
    field: 'ip',
    minWidth: 180,
  },
  {
    headerName: '备注',
    field: 'comments',
    minWidth: 180,
    flex: 1,
  },
]

export default columns
