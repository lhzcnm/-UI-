import type { R } from '@3un/shared'

export interface StoreApi {
  service: (data: ServiceParams) => R<null>,
}

export interface ServiceParams {
  serviceId?: number,
  groupId?: number,
}

export interface ServiceItem {
  serviceId: number,
  name: string,
  desc: string,
}

export interface ServiceGroup {
  id: number,
  title: string,
  children: ServiceItem[]
}

export interface GroupOption {
  id: number,
  title: string,
}

export interface ServiceOption {
  serviceId: number,
  name: string,
}
