import { IMEI_TYPE } from '@3un/shared/enums'

export interface ServiceItem {
  apiId: number
  apiName: string
  categoryId: number
  cronNo: number
  deliveryTime: string
  deliveryTimeLocal: string
  disablePackage: boolean
  duplicateImeiNotAllowed: number
  externalNetworkId: string
  fileName: string
  hideModel: boolean
  highlight: boolean
  htmlTitle: string
  imeiFieldType: IMEI_TYPE
  isNew: boolean
  metaKw: string
  metaTags: string
  mustRead: string
  mustReadLocal: string
  packageDetail: string
  packageDetailLocal: string
  packageId: number
  packageImage: string
  packageOrderBy: number
  packagePrice: number
  packageTitle: string
  packageTitleLocal: string
  pushMsg: boolean
  seoUrlName: string
  sl3lbf: boolean
  testimonials: boolean
  timeTaken: string
  timeTakenLocal: string
  tmpTitle: string
  toolForUnlockBase: string
  isHot: boolean
  isUnlock: boolean
}

// ------------
// Base
// ------------
export interface ServiceView {
  apiId: number
  apiName: string
  categoryId: number
  disablePackage: boolean
  duplicateImeiNotAllowed: number
  externalNetworkId: string
  imeiFieldType: IMEI_TYPE
  mustRead: string
  mustReadLocal: string
  packageId: number
  packageOrderBy: number
  packagePrice: number
  packageTitle: string
  packageTitleLocal: string
  pushMsg: boolean
  timeTaken: string
  timeTakenLocal: string
  isNew: boolean
  isHot: boolean
  isUnlock: boolean
  testimonials: boolean
}

// export type ServiceScope = TableScope<ServiceView>
export type ServiceForm = Omit<ServiceView, 'apiId' | 'apiName' | 'packageId' | 'externalNetworkId'>

// ------------
// Create
// ------------
export type ServiceCreateParams = {
  categoryId: number
  disablePackage?: boolean
  duplicateImeiNotAllowed?: number
  imeiFieldType?: IMEI_TYPE
  mustRead?: string
  mustReadLocal?: string
  packageOrderBy?: number
  packagePrice: number
  packageTitle: string
  packageTitleLocal: string
  pushMsg?: boolean
  timeTaken: string
  timeTakenLocal: string
  isNew?: boolean
  isHot?: boolean
  isUnlock?: boolean
  testimonials?: boolean
}
export type ServiceCreateForm = {
  categoryId: number
  disablePackage: boolean
  duplicateImeiNotAllowed: number
  imeiFieldType: IMEI_TYPE
  mustRead: string
  mustReadLocal: string
  packageOrderBy: number
  packagePrice: number
  packageTitle: string
  packageTitleLocal: string
  pushMsg: boolean
  timeTaken: string
  timeTakenLocal: string
  isNew: boolean
  isHot: boolean
  isUnlock: boolean
  testimonials: boolean
}

// ------------
// Update
// ------------
export type ServiceUpdateParams = {
  packageId: number
  categoryId?: number
  disablePackage?: boolean
  duplicateImeiNotAllowed?: number
  imeiFieldType?: IMEI_TYPE
  mustRead?: string
  mustReadLocal?: string
  packageOrderBy?: number
  packagePrice?: number
  packageTitle?: string
  packageTitleLocal?: string
  pushMsg?: boolean
  timeTaken?: string
  timeTakenLocal?: string
  isNew?: boolean
  isHot?: boolean
  isUnlock?: boolean
  testimonials?: boolean
}
export type ServiceUpdateForm = {
  packageId: number
  categoryId: number
  disablePackage: boolean
  duplicateImeiNotAllowed: number
  imeiFieldType: IMEI_TYPE
  mustRead: string
  mustReadLocal: string
  packageOrderBy: number
  packagePrice: number
  packageTitle: string
  packageTitleLocal: string
  pushMsg: boolean
  timeTaken: string
  timeTakenLocal: string
  isNew: boolean
  isHot: boolean
  isUnlock: boolean
  testimonials: boolean
}

// -----------
// 服务API
// -----------
export interface ServiceSyncItem {
  id: number
  apiId: number
  serviceId: string
  serviceName: string
  servicePrice: string
  serviceTime?: string
  serviceType: number
}
export interface ServiceSyncParams {
  apiId: number
  serviceId?: number
  externalNetworkId?: string
  serviceName?: string
  serviceTime?: string
}
export interface SelectApiForm {
  apiId?: number
  serviceId?: number
  externalNetworkId?: string
}
