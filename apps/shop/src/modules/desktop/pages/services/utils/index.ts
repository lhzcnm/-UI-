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

export enum ToolStatus {
  ROOT     = 0,
  LANGUAGE = 1,
  GROUP    = 2,
  ORDER    = 3,
}

export interface ToolGlobalStore {
  toolStatus: ToolStatus
}

export const SERVICE_STORE: IK<ServiceStore> = Symbol('service-store')
export const TOOL_STORE: IK<ToolGlobalStore> = Symbol('tool-store')
