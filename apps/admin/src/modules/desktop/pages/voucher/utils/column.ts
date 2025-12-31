import type { Voucher, VoucherUpdateForm } from '@/inters/voucher'
import { XButton, XTag, type XColDef } from '@3un/ui'
import dayjs from 'dayjs'
import { h } from 'vue'
import VoucherUpdate from '../components/VoucherUpdate.vue'
import { VOUCHER_TYPE_MAP, xconfirm, type VOUCHER_STATUS } from '@3un/utils'
import { deleteVoucher, invalidCode } from '@/api/voucher'
import { toast } from 'vue-sonner'
import { VOUCHER_STORE } from '.'

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
    key: 'type',
    title: '类型',
    minWidth: 88,
    render: (value) => {
      // return VOUCHER_TYPE_MAP[value as VOUCHER_TYPE].label
      const status = VOUCHER_TYPE_MAP[value]
      return h(XTag, {
        color: status.color,
        label: status.label,
      })
    }
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
  {
    key: 'action',
    title: '操作',
    width: 88,
    fixed: 'right',
    render: (_, row) => {
      const store = inject(VOUCHER_STORE)!
      async function handleClick() {
        if (!await xconfirm("是否确认删除改代金券")) return

        try {
          await deleteVoucher(row.id)

          const index = store.vouchers.list.findIndex(v => v.id === row.id)

          if (index !== -1) {
            store.vouchers.list.splice(index, 1)
            toast.success("删除成功")
            store.refresh = !store.refresh
          }
        } catch {
          toast.success("删除失败, 请重试")
        }
      }

      return h(XButton, {
        color: 'danger',
        label: '删除',
        icon: 'lucide:trash-2',
        size: 'sm',
        onclick: handleClick,
      })
    }
  }
]