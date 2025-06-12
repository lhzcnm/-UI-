import type { RechargeList, RechargeSearchForm, RechargeUpdateParams } from "@/inters/recharge"
import type { RechargePackage, RechargePackageForm } from "@/inters/recharge/package"
import type { IK } from "@3un/shared"

export const RECHARGE_STORE: IK<RechargeStore> = Symbol('recharge')
export const PACKAGE_STORE: IK<PackageStore> = Symbol('package')

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

export interface PackageStore {
  packages: RechargePackage[]
  formBase: RechargePackageForm
  visibleBase: boolean
  index: number | undefined
  refresh: boolean
}
