import type { OrderTableView } from "@/api/orders"

export interface UnlockRecommentOption {
  order: OrderTableView,
}

let confirmFn: ((options: UnlockRecommentOption) => void) | null = null

export function registerUnlockRecommentConfirm(fn: typeof confirmFn) {
  confirmFn = fn
}

export function unlockRecommentConfirm(options: UnlockRecommentOption) {
  if (!confirmFn) return

  confirmFn(options)
}
