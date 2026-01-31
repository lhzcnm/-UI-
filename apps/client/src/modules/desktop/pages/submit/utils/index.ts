import type { ServiceCols } from "@/api/services"
import type { IK } from "@3un/shared"

export const SUBMIT_STORE: IK<SubmitStore> = Symbol("submit")

export interface SubmitStore {
  visibleHeaderFilter: boolean,

  serviceCols: ServiceCols[],
  selectHeaders: string[],
  selectId: number,
}
