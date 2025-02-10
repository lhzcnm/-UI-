import type { R } from '..'

export interface ServiceApiCollection {
  list: () => R<Service[]>
  item: (id: number) => R<Service>
  groupList: () => R<ServiceGroup[]>

  header: (id: number) => R<ServiceItemHeader[]>
}

export enum ServiceImeiType {
  NO_CHECK = 1,
  IMEI     = 2,
  SN       = 3,
  IMEI_SN  = 4,
}

export type ServiceDetail = {
  id: number
  name: string
  nameEn: string
  children: Service[]
}

export interface ServiceGroup {
  id: number
  name: string
  nameEn: string
}

export interface Service {
  id: number
  groupId: number
  name: string
  nameEn: string
  simplifiedName: string
  simplifiedNameEn: string
  timeTaken: string
  timeTakenEn: string
  info: string | null
  infoEn: string | null
  price: number
  imeiType: ServiceImeiType
  isHot: boolean
  isUnlock: boolean
  isNew: boolean
}

export interface ServiceItemHeader {
  name: string
  serviceId: number
  sortNum: number
  width: number
}
