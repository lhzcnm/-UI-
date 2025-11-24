import type { IK } from "@3un/shared"

export enum ToolStatus {
  ROOT     = 0,
  LANGUAGE = 1,
  GROUP    = 2,
  ORDER    = 3,
}

export interface ToolGlobalStore {
  toolStatus: ToolStatus
}

export const TOOL_STORE: IK<ToolGlobalStore> = Symbol('tool-store')
