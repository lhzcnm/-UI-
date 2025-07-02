import type { Credit } from "@/inters/credits"
import { type XColDef } from "@3un/ui"
import { h } from "vue"

export const columns: XColDef<Credit> = [
  { key: 'historyId', title: 'ID', width: 98 },
  {
    key: 'packageId',
    title: '项目',
    width: 300,
    render: (value) => {
      if (!value) return '积分充值'
      const store = useServiceStore()
      const service = store.itemMap.get(value)
      return service ? `${service.packageId} - ${service.packageTitle}` : '服务不存在'
    }
  },
  {
    key: 'userId',
    title: '用户',
    width: 88,
    render(value) {
      return h('a', {
        href: `/users?uid=${value}`,
        class: 'underline hover:text-success',
        target: '_blank',
        rel: 'opener',
      }, value)
    },
  },
  {
    key: 'imeiNo',
    title: 'IMEI',
    width: 180,
  },
  {
    key: 'credits',
    title: '变动金额',
    width: 88,
    render: (value: number, row) => {
      const isSubmit = /订单提交|查询订单|Code Request/.test(row.description)
      const isReduce = isSubmit || row.description === '管理员扣除积分'
      let label = Math.abs(value).toString()
      let color

      if (isReduce) {
        if (value > 0) label = `-${label}`
        color = 'text-danger' 
      }
      else {
        color = 'text-success'
        label = `+${label}`
      }

      return h('span', { class: color }, label)
    }
  },
  {
    key: 'creditsLeft',
    title: '剩余积分',
    width: 88,
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
    minWidth: 180
  }
]
