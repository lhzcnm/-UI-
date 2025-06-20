import type { IK } from "@3un/shared"

export const EDITOR_STORE: IK<EditorStore> = Symbol('editor')

export interface EditorStore {
  settings: Record<string, string | boolean>
  selectedService: number
  selectedType: string
  result: string
}
