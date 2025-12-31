import ActivityRechargeAction from "../components/ActivityRechargeAction.vue"

import { h } from "vue"
import { XTag, type XColDef } from "@3un/ui"
import { PAYMENT_STATUS_MAP } from "@3un/utils"

import type { ActivyRecharge } from "@/inters/activity/recharge"

export const columns: XColDef<ActivyRecharge> = [
  {
    key: "paymentId",
    title: "充值ID",
    width: 88,
  },
  {
    key: "userId",
    title: "用户ID",
    width: 88,
    render: (value) => {
      return h("a", {
        href: `/users?uid=${value}`,
        class: "underline hover:text-success",
        rel: "opener"
      }, value)
    }
  },
  {
    key: "amount",
    title: "账单金额",
    width: 108,
  },
  {
    key: "nonce",
    title: "赠送金额",
    width: 108,
  },
  {
    key: "credits",
    title: "到账金额",
    width: 108,
  },
  {
    key: "paymentStatus",
    title: "支付状态",
    width: 108,
    render: (value) => {
      return h(XTag, PAYMENT_STATUS_MAP[value])
    },
  },
  {
    key: "invoiceTime",
    title: "支付时间",
    width: 108,
  },
  {
    key: "voucherCode",
    title: "积分券码",
    width: 168,
    render: (value) => {
      return value ?? "-"
    },
  },
  {
    key: "action",
    title: "操作",
    width: 88,
    fixed: "right",
    render: (_, row, index) => {
      return h(ActivityRechargeAction, { row, index })
    }
  }
]
