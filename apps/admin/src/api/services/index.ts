import type { Service, ServiceGroup, ServiceCreateParams, ServiceUpdateParams } from '@/inters/services'
import { zService, zServiceGroup } from '@/inters/services'
import http from '@/utils/http'

type ServicesFn = () => Promise<Service[]>
export const getServices: ServicesFn = async () => {
  const { data } = await http.get<any[]>('/service')
  return data.map((item) => zService.parse(item))
}

type ServiceCreateFn = (body: ServiceCreateParams) => Promise<Service>
export const createService: ServiceCreateFn = async (body) => {
  const { data } = await http.post('/service', body)
  return zService.parse(data)
}

type ServiceUpdateFn = (body: ServiceUpdateParams) => Promise<number>
export const updateService: ServiceUpdateFn = async (body) => {
  return (await http.put('/service', body)).data
}

type ServiceDeleteFn = (id: number) => Promise<void>
export const deleteService: ServiceDeleteFn = async (id) => {
  await http.delete(`/service/${id}`)
}

type ServiceGroupsFn = () => Promise<ServiceGroup[]>
export const getServiceGroups: ServiceGroupsFn = async () => {
  const { data } = await http.get<any[]>('/service/group')
  return data.map((item) => zServiceGroup.parse(item))
}
