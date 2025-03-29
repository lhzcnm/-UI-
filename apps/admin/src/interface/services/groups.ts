import { ACTIVE_STATUS } from '@3un/shared/enums'

export interface ServiceGroup {
  category: string
  categoryId: number
  categoryLocal: string
  disableCategory: ACTIVE_STATUS
  htmlTitle: string
  metaKw: string
  metaTags: string
  orderBy: number
  seoUrlName: string
}

// ------------
// Base
// ------------
export interface ServiceGroupView {
  category: string
  categoryId: number
  categoryLocal: string
  disableCategory: ACTIVE_STATUS
  orderBy: number
}

// export type ServiceGroupScope = TableScope<ServiceGroupView>
export interface ServiceGroupForm {
  category: string
  categoryLocal: string
  disableCategory: ACTIVE_STATUS
  orderBy: number
}

// ------------
// Create
// ------------
export interface ServiceGroupCreateParams {
  category: string
  categoryLocal: string
  disableCategory: ACTIVE_STATUS
  orderBy: number
}
export interface ServiceGroupCreateForm {
  category: string
  categoryLocal: string
  disableCategory: ACTIVE_STATUS
  orderBy: number
}

// ------------
// Update
// ------------
export interface ServiceGroupUpdateParams {
  categoryId: number
  category?: string
  categoryLocal?: string
  disableCategory?: ACTIVE_STATUS
  orderBy?: number
}
export interface ServiceGroupUpdateForm {
  categoryId: number
  category: string
  categoryLocal: string
  disableCategory: ACTIVE_STATUS
  orderBy: number
}
