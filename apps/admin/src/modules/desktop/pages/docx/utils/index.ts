import type { IllustrateImageItem, IllustrateSubmitForm } from "@/inters/illustrate"
import type { IK } from "@3un/shared"

export interface DocxStore {
  docxImageMap: Map<string, IllustrateImageItem[]>

  visibleImage: boolean
  visibleBase: boolean

  formBase: IllustrateSubmitForm
  
  index: number | undefined
  refresh: boolean
}

export const DOCX_STORE: IK<DocxStore> = Symbol('docx-store')

let confirmFn: ((html: string) => Promise<boolean>) | null = null

export function registerIllustrateConfirm(fn: typeof confirmFn) {
  confirmFn = fn
}

export function illustrateConfirm(html: string): Promise<boolean> {
  if (!confirmFn) throw new Error("confirmFn is not Registered")
  
  return confirmFn(html)
}
