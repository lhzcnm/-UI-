export type ConfirmOptions = {
  title?: string
  text?: string
  cancelText?: string
  confirmText?: string
}

let confirmFn: ((text: string, options?: ConfirmOptions) => Promise<boolean>) | null = null

export function registerConfirm(fn: typeof confirmFn) {
  confirmFn = fn
}

export function xconfirm(text: string, options?: ConfirmOptions): Promise<boolean>
export function xconfirm(strings: TemplateStringsArray, ...values: any[]): Promise<boolean>
export function xconfirm(first: string | TemplateStringsArray, ...rest: any[]): Promise<boolean> {
  if (!confirmFn) throw new Error('confirmFn is not registered')
  if (Array.isArray(first)) {
    const text = first.reduce((acc, str, i) => acc + str + (rest[i] ?? ''), '')
    return confirmFn(text)
  }

  return confirmFn(first as string, rest[0])
}
