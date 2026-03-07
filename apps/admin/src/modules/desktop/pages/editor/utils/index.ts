import type { Activity } from "@/inters/activity"
import type { IllustrateMap } from "@/inters/settings"
import type { IK } from "@3un/shared"

export const EDITOR_STORE: IK<EditorStore> = Symbol('editor')

export interface EditorStore {
  settings: Record<string, string | boolean>
  selectedService: number
  selectedType: string
  selectActivity: number
  selectIllustrate: string
  visibleIllustrateCreate: boolean

  activityMap: Map<number, Activity>
  illustrates: IllustrateMap,
}
