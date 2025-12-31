import type { ActivityItem } from "@/api/recharge"
import type { InvoicesResponse } from "@/api/user"

export interface RechargeStore {
  url: string
  visible: boolean
  isComplete: boolean
  refresh: boolean
  timer: number
  bills: InvoicesResponse
  activity: ActivityItem | null,
}

type RechargeStoreKey = InjectionKey<RechargeStore>
export const RECHARGE_STORE = Symbol('rechargeStore') as RechargeStoreKey

export type TabMode = 'recharge' | 'membership' | 'voucher'
