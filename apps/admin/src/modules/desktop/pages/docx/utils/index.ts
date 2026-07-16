import type { IllustrateImageItem } from "@/inters/illustrate"
import type { IK } from "@3un/shared"

export interface DocxStore {
  docxImageMap: Map<string, IllustrateImageItem[]>

  visibleImage: boolean
  
  index: number | undefined
}

export const DOCX_STORE: IK<DocxStore> = Symbol('docx-store')
