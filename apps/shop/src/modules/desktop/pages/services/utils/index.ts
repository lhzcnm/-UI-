import type { Service, ServiceDetail, ServiceParams } from "@/inters/services"
import type { IK } from "@3un/shared"

export interface ServiceStore {
  visibleTool: boolean,

  services: ServiceDetail[],
  serviceMap: Map<number, Service>,
  groupMap: Map<number, string>,
  groupServiceMap: Map<number, Service[]>,

  searchForm: ServiceParams,
}

export const SERVICE_STORE: IK<ServiceStore> = Symbol('service-store')
