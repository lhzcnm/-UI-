import type { CreditList, CreditSearchForm } from "@/inters/credits";
import type { IK } from "@3un/shared";

export * from './column'

export const CREDIT_STORE: IK<CreditStore> = Symbol('CreditStore')

export interface CreditStore {
  credits: CreditList

  formSearch: CreditSearchForm
  visibleSearch: boolean

  refresh: boolean
  page   : number
  limit  : number
}
