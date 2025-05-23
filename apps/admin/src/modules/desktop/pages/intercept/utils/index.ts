import type { Intercept, InterceptForm } from '@/inters/intercept'
import type { IK } from '@3un/shared'

export interface InterceptStore {
  intercepts: Intercept[]
  formBase: InterceptForm
  visibleBase: boolean
  index: number | undefined
}

// Store
export const INTERCEPT_STORE: IK<InterceptStore> = Symbol('intercept')
