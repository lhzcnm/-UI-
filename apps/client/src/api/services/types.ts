import type { IMEI_TYPE } from '@3un/utils'
import type { R } from '@3un/shared'

export interface ServiceApi {
  list: () => R<ServiceDetail[]>
  item: (id: number) => R<Service>
  header: (id: number) => R<ServiceHeader[]>
}

export interface ServiceDetail {
  id: number
  title: string
  children: Service[]
}

export interface Service {
  id: number
  parentId: number
  title: string
  price: number
  taken: string
  imeiType: IMEI_TYPE
  mustRead: string | null
  isNew: boolean
  isHot: boolean
  isUnlock: boolean
}
export interface ServiceView {
  id: number
  idHighlight?: string | number
  parentId: number
  title: string
  price: number
  taken: string
  imeiType: IMEI_TYPE
  mustRead: string | null
  isNew: boolean
  isHot: boolean
  isUnlock: boolean
}

export interface ServiceHeader {
  serviceId: number
  name: string
  nameEn: string
  width: number
  sortNum: number
}
