import type { StatOrder, StatService } from '@/inters/dashboard'
import type { IK } from '@3un/shared'

export const STORE: IK<StatStore> = Symbol('StatStore')

export interface StatExtra {
  incomeToday: string
  incomeYesterday: string

  orderToday: number
  orderYesterday: number
}

export interface StatStore {
  extraInfo  : StatExtra
  income     : Record<string, string>
  orders     : StatOrder[]
  services   : StatService[]

  incomeTrend: Array<[string, number]>
  orderTrend: Array<[string, number]>
}
