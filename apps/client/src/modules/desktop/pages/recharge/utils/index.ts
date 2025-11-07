export interface RechargeStore {
  url: string
  visible: boolean
  isComplete: boolean
  timer: number
}

type RechargeStoreKey = InjectionKey<RechargeStore>
export const RECHARGE_STORE = Symbol('rechargeStore') as RechargeStoreKey

export type TabMode = 'recharge' | 'membership' | 'voucher'
