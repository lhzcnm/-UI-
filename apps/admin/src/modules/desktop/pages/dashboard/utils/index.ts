import type { IK } from '@3un/shared'

export const STORE: IK<StatStore> = Symbol('StatStore')

export interface StatStore {
  income: Record<string, string>
  orders: Array<{
    awaiting: number
    failure: number
    processing: number
    success: number
    orderTime: string
    total: number
  }>

  services: Array<{
    awaitOrder: number
    failOrder: number
    orderCount: number
    orderTime: string
    packageId: string | null
    processingOrder: number
    successOrder: number
  }>

  incomeTrend: Array<[string, number]>
  orderTrend: Array<[string, number]>
}
