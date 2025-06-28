import type { Dayjs } from 'dayjs'
import type { IK } from '@3un/shared'

export const STORE: IK<StatStore> = Symbol('StatStore')

export interface StatStore {
  today     : Dayjs
  tomorrow  : Dayjs
  yesterday : Dayjs
}
