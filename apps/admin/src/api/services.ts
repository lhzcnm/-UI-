import type { Service, ServiceGroup, ServiceCreateParams, ServiceUpdateParams, ServiceGroupCreateParams, ServiceGroupUpdateParams, ServiceField, ServiceFieldCreateParams, ServiceFieldUpdateParams, ServiceFieldListParams, ServiceFieldList, Unlock, UnlockCreateParams, UnlockUpdateParams, UpstreamServiceSyncParams, ServiceSearch } from '@/inters/services'
import type { AxiosResponse } from 'axios'

import { zService, zServiceField, zServiceGroup, zUnlock } from '@/inters/services'
import http from '@/utils/http'

// service
type ServicesFn = (params?: ServiceSearch) => Promise<Service[]>
export const getServices: ServicesFn = async (params) => {
  const { data } = await http.get<any[]>('/service', { params })
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

// reset service price
type ResetServicePriceFn = (id: number) => Promise<AxiosResponse>
export const resetServicePrice: ResetServicePriceFn = (id) => {
  return http.delete(`/service/clean/${id}`)
}

// upstream service
type UpstreamServiceUpdateFn = (body: UpstreamServiceSyncParams) => Promise<void>
export const updateUpstreamService: UpstreamServiceUpdateFn = async (body) => {
  await http.put('/api/service/edit', body)
}

// service group
type ServiceGroupsFn = () => Promise<ServiceGroup[]>
export const getServiceGroups: ServiceGroupsFn = async () => {
  const { data } = await http.get<any[]>('/service/group')
  return data.map((item) => zServiceGroup.parse(item))
}

type ServiceGroupCreateFn = (body: ServiceGroupCreateParams) => Promise<ServiceGroup>
export const createServiceGroup: ServiceGroupCreateFn = async (body) => {
  const { data } = await http.post('/service/group', body)
  return zServiceGroup.parse(data)
}

type ServiceGroupUpdateFn = (body: ServiceGroupUpdateParams) => Promise<number>
export const updateServiceGroup: ServiceGroupUpdateFn = async (body) => {
  return (await http.put('/service/group', body)).data
}

type ServiceGroupDeleteFn = (id: number) => Promise<void>
export const deleteServiceGroup: ServiceGroupDeleteFn = async (id) => {
  await http.delete(`/service/group/${id}`)
}

// service field
type ServiceFieldListFn = (params: ServiceFieldListParams) => Promise<ServiceFieldList>
export const getServiceFields: ServiceFieldListFn = async (params) => {
  const { data } = await http.get<ServiceFieldList>('/services/field', { params })
  return { ...data, list: data.list.map((item) => zServiceField.parse(item)) }
}

type ServiceFieldCreateFn = (body: ServiceFieldCreateParams) => Promise<ServiceField>
export const createServiceField: ServiceFieldCreateFn = async (body) => {
  const { data } = await http.post('/services/field', body)
  return zServiceField.parse(data)
}

type ServiceFieldUpdateFn = (body: ServiceFieldUpdateParams) => Promise<number>
export const updateServiceField: ServiceFieldUpdateFn = async (body) => {
  return (await http.put('/services/field', body)).data
}

type ServiceFieldDeleteFn = (data: number[]) => Promise<void>
export const deleteServiceField: ServiceFieldDeleteFn = async (data) => {
  await http.delete(`/services/field`, { data })
}

// unlock
type UnlockListFn = () => Promise<Unlock[]>
export const getUnlockList: UnlockListFn = async () => {
  const { data } = await http.get<Unlock[]>('/recommend')
  return data.map((item) => zUnlock.parse(item))
}

type UnlockCreateFn = (body: UnlockCreateParams) => Promise<Unlock>
export const createUnlock: UnlockCreateFn = async (body) => {
  const { data } = await http.post('/recommend', body)
  return zUnlock.parse(data)
}

type UnlockUpdateFn = (body: UnlockUpdateParams) => Promise<number>
export const updateUnlock: UnlockUpdateFn = async (body) => {
  return (await http.put('/recommend', body)).data
}

type UnlockDeleteFn = (id: number) => Promise<void>
export const deleteUnlock: UnlockDeleteFn = async (id) => {
  await http.delete(`/recommend/${id}`)
}
