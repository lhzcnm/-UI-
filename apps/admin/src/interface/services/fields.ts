import type { IPage, IList } from '@3un/shared'
import { ACTIVE_STATUS } from '@3un/shared/enums'

export interface ServiceField {
  id: number
  serviceId: number
  width: number
  name: string
  sortNum: number
  status: ACTIVE_STATUS
}

// ------------
// Base
// ------------
export type ServiceFieldView = ServiceField
export type ServiceFieldListParams = IPage & { serviceId?: number }
export type ServiceFieldListResponse = IList<ServiceField>

// export type ServiceFieldScope = TableScope<ServiceFieldView>
export type ServiceFieldForm = {
  serviceId: number | undefined
  width: number | undefined
  name: string
  sortNum: number
  status: ACTIVE_STATUS
}

// ------------
// Create
// ------------
export type ServiceFieldCreateParams = {
  serviceId: number | undefined
  width: number | undefined
  name: string
  sortNum: number
  status?: ACTIVE_STATUS
}
export type ServiceFieldCreateForm = {
  serviceId: number | undefined
  width: number | undefined
  name: string
  sortNum: number
  status: ACTIVE_STATUS
}

// ------------
// Update
// ------------
export interface ServiceFieldUpdateParams {
  id: number
  serviceId?: number
  width?: number
  name?: string
  sortNum?: number
  status?: ACTIVE_STATUS
}
export type ServiceFieldUpdateForm = {
  id: number
  serviceId: number | undefined
  width: number | undefined
  name: string
  sortNum: number
  status: ACTIVE_STATUS
}
