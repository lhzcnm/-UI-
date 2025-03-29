import type { R } from '@3un/shared'
import type {
  ServiceGroup,
  ServiceItem,
  ServiceView,
  ServiceField,
  ServiceGroupView,
  ServiceFieldListResponse,
  ServiceFieldListParams,
  ServiceSyncItem,
  ServiceSyncParams,
  ServiceCreateParams,
  ServiceUpdateParams,
  ServiceGroupCreateParams,
  ServiceGroupUpdateParams,
  ServiceFieldCreateParams,
  ServiceFieldUpdateParams,
} from '@/interface/services'

export interface ServiceApi {
  convertModel(data: ServiceItem): ServiceView
  convertGroupModel(data: ServiceGroup): ServiceGroupView

  items(): R<ServiceItem[]>
  createService(data: ServiceCreateParams): R<ServiceItem>
  updateService(data: ServiceUpdateParams): R<number>
  deleteService(id: number): R<null>

  cleanPrice(id: number): R<null>

  syncList(apiId: number): R<ServiceSyncItem[]>
  serviceSync(data: ServiceSyncParams): R<null>

  groups(): R<ServiceGroup[]>
  createGroup(data: ServiceGroupCreateParams): R<ServiceGroup>
  updateGroup(data: ServiceGroupUpdateParams): R<number>
  deleteGroup(id: number): R<null>

  fields(params: ServiceFieldListParams): R<ServiceFieldListResponse>
  createField(data: ServiceFieldCreateParams): R<ServiceField>
  updateField(data: ServiceFieldUpdateParams): R<number>
  deleteField(ids: number[]): R<null>
}
