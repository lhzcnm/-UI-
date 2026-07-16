import type { ConfirmOptions } from '@3un/utils'

let confirmFn: ((options: ConfirmOptions) => Promise<string>) | null = null

export function registerSetLinkConfirm(fn: typeof confirmFn) {
  confirmFn = fn
}

export function setLinkConfirm(options: ConfirmOptions): Promise<string> {
  if (!confirmFn) throw new Error("confirmFn is not registered")

  return confirmFn(options)
}
