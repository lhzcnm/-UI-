import type { Intercept, InterceptForm } from '@/inters/intercept'
import type { IK } from '@3un/shared'

export const INTERCEPT_STORE: IK<InterceptStore> = Symbol('intercept')

export interface InterceptStore {
  intercepts: Intercept[]

  formBase: InterceptForm
  visibleBase: boolean

  index: number | undefined
}
