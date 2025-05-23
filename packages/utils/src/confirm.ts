export type ConfirmOptions = {
  title?: string
  text?: string
  cancelText?: string
  confirmText?: string
}

let confirmFn: ((options: string | ConfirmOptions) => Promise<boolean>) | null = null

export function registerConfirm(fn: typeof confirmFn) {
  confirmFn = fn
}

export function xconfirm(strings: TemplateStringsArray, ...values: any[]): Promise<boolean>
export function xconfirm(options: string | ConfirmOptions): Promise<boolean>
export function xconfirm(first: string | ConfirmOptions | TemplateStringsArray, ...values: any[]): Promise<boolean> {
  if (!confirmFn) throw new Error('confirmFn is not registered')

  if (Array.isArray(first) && 'raw' in first) {
    const text = (first).reduce(
      (acc, str, i) => acc + str + (values[i] ?? ''),
      ''
    )
    return confirmFn(text)
  }

  return confirmFn(first as string | ConfirmOptions)
}
