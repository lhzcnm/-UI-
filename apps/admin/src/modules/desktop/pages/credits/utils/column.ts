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
      const isSubmit = /提交订单|order|订单提交|Code Request/.test(row.description)
      const isReduce = value < 0 || isSubmit
      let label = Math.abs(value).toString()
      let color, text

      if (isReduce) {
        color = 'text-danger'
        text = `-${label}`
      }
      else {
        color = 'text-success'
        text = `+${label}`
      }

      return h('span', { class: color }, text)
    }
  },
  {
    key: 'creditsLeft',
    title: '剩余积分',
    width: 88,
  },
  {
    key: 'voucherCreditsLeft',
    title: '剩余查询积分',
    width: 128,
  },
  {
    key: 'unlockedCreditsLeft',
    title: '剩余解锁积分',
    width: 128,
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
