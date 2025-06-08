import type { RechargeList, RechargeSearchForm, RechargeUpdateParams } from "@/inters/recharge"
import type { IK } from "@3un/shared"

export * from './column'

export const RECHARGE_STORE: IK<RechargeStore> = Symbol('recharge')

export interface RechargeStore {
  recharges: RechargeList
  formSearch: RechargeSearchForm
  formUpdate: RechargeUpdateParams
  visibleSearch: boolean
  visibleUpdate: boolean
  index: number | undefined
  refresh: boolean
  page: number
  limit: number
}
