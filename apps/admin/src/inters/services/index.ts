import type { ServiceGroup } from './groups'
import type { Service } from './items'

export * from './items'
export * from './groups'
export * from './fields'

export interface ServiceDetail extends ServiceGroup {
  children: Service[]
}
