import type { RechargeHandleFee, RechargeList, RechargeSearchForm, RechargeUpdateParams } from "@/inters/recharge"
import type { RechargePackage, RechargePackageForm } from "@/inters/recharge/package"
import type { IK } from "@3un/shared"

export const RECHARGE_STORE: IK<RechargeStore> = Symbol('recharge')
export const PACKAGE_STORE: IK<PackageStore> = Symbol('package')

export interface RechargeStore {
  recharges: RechargeList

  formSearch: RechargeSearchForm
  formUpdate: RechargeUpdateParams
  handleFee: RechargeHandleFee

  visibleSearch: boolean
  visibleUpdate: boolean
  visibleHandleFee: boolean

  refresh: boolean
  index  : number | undefined
  page   : number
  limit  : number

}

export interface PackageStore {
  packages: RechargePackage[]

  formBase: RechargePackageForm
  visibleBase: boolean

  refresh: boolean
  index  : number | undefined
}
