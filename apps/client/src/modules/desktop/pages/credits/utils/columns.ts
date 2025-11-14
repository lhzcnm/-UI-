import type { CreditLogItem } from '@/api/user'
import type { XColDef } from '@3un/ui'
import { h } from 'vue'

const store = useServiceStore()

export function getCreditColumns(): XColDef<CreditLogItem> {
  const { t } = useI18n()

  return [
    {
      key: 'packageId',
      title: t('credit.listCol.service'),
      width: 220,
      render: (value) => {
        if (!value) return '积分充值'
        const service = store.services.get(value)
        return service ? `${service.id} - ${service.title}` : t('service.notFound')
      }
    },
    {
      key: 'imeiNo',
      title: 'IMEI',
      width: 180
    },
    {
      key: 'credits',
      title: t('credit.listCol.amount'),
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
      key: 'description',
      title: t('credit.listCol.reason'),
      width: 280
    },
    {
      key: 'historyDtTm',
      title: t('credit.listCol.time'),
      width: 180
    },
    {
      key: 'ip',
      title: 'IP',
      width: 180
    },
    {
      key: 'comments',
      title: t('credit.listCol.commment'),
      minWidth: 180
    }
  ]
}
