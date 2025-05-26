import type { RechargeList, RechargeSearchForm } from "@/inters/recharge"
import type { IK } from "@3un/shared"

export interface RechargeStore {
  recharges: RechargeList
  formSearch: RechargeSearchForm
  visibleSearch: boolean
  index: number | undefined
  refresh: boolean
  page: number
  limit: number
}

export const RECHARGE_STORE: IK<RechargeStore> = Symbol('recharge')
