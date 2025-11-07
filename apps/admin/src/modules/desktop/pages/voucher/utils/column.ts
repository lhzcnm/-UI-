import type { Voucher, VoucherUpdateForm } from '@/inters/voucher'
import { type XColDef } from '@3un/ui'
import dayjs from 'dayjs'
import { h } from 'vue'
import VoucherUpdate from '../components/VoucherUpdate.vue'
import type { VOUCHER_STATUS } from '@3un/utils'
import { invalidCode } from '@/api/voucher'
import { toast } from 'vue-sonner'

export const columns: XColDef<Voucher> = [
  {
    key: 'id',
    title: 'ID',
    width: 108,
    thClassName: 'text-center',
    tdClassName: 'text-center'
  },
  {
    key: 'code',
    title: '券码',
    minWidth: 128,
    thClassName: 'text-center',
    tdClassName: 'text-center'
  },
  {
    key: 'userId',
    title: '充值用户',
    width: 128,
    render: (value) => {
      if(value) {
        return h('a', {
          href: `/users?uid=${value}`,
          class: 'underline hover:text-success'
        }, value)
      }

      return "--"
    }
  },
  {
    key: 'amount',
    title: '充值积分',
    width: 158,
  },
  {
    key: 'createTime',
    title: '生成时间',
    width: 208,
    render: (value) => {
      if(value) {
        const timestamp = dayjs(value).valueOf()
        return dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss")
      }
      return "-"
    }
  },
  {
    key: 'expireTs',
    title: '过期时间',
    width: 208,
    render: (value, row) => {
      if(value) {
        const timestamp = dayjs(row.createTime).valueOf()
        return dayjs(timestamp).add(value, 'day').format("YYYY-MM-DD HH:mm:ss")
      }
      return "-"
    }
  },
  {
    key: 'useTime',
    title: '使用时间',
    width: 208,
    render: (value) => {
      if(value) {
        return value
      }
      return "--"
    }
  },
  {
    key: 'status',
    title: '状态',
    width: 128,
    render: (_, row) => {
      async function handleChange(value: VOUCHER_STATUS) {
        const body: VoucherUpdateForm = {
          code: row.code,
          status: value,
        }

        try {
          await invalidCode(body)
          return toast.success("更新成功")
        } catch(err) {
          console.error(err)
        }
      }

      return h(VoucherUpdate, {
        row: row,
        onChange: handleChange
      })
    }
  },
  // {
  //   key: 'action',
  //   title: '操作',
  //   width: 88,
  //   fixed: 'right',
  //   render: (_, row) => {
  //     function handleInvalid() {
  //       invalidCode(row.code).then((res) => {
  //         console.log(res)
  //       })
  //     }

  //     return h(XButton, {
  //       color: 'danger',
  //       label: '停用',
  //       size: 'sm',
  //       onclick: handleInvalid,
  //     })
  //   }
  // }
]