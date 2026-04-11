import type { User, UserCreateParams, UserExtraInfo, UserList, UserListParams, UserLoginFront, UserPaidList, UserPaidListParams, UserPointForm, UserService, UserServiceCreateParams, UserServiceUpdateParams, UserUpdateParams } from '@/inters/users'
import { zUser, zUserPaid, zUserService } from '@/inters/users'

import type { AxiosResponse } from 'axios'
import http from '@/utils/http'

// User
type UserFn = (id: number) => Promise<User>
export const getUser: UserFn = async (id) => {
  const { data } = await http.get<User>(`/user/${id}`)
  return zUser.parse(data)
}

type UserListFn = (body: UserListParams) => Promise<UserList>
export const getUsers: UserListFn = async (body) => {
  const { data } = await http.post<UserList>('/user/list', body)
  return { ...data, list: data.list.map(item => zUser.parse(item)) }
}

type UserCreateFn = (body: UserCreateParams) => Promise<User>
export const createUser: UserCreateFn = async (body) => {
  const { data } = await http.post<User>('/user', body)
  return zUser.parse(data)
}

type UserUpdateFn = (body: UserUpdateParams) => Promise<number>
export const updateUser: UserUpdateFn = async (body) => {
  return (await http.put('/user', body)).data
}

type UserDeleteFn = (id: number) => Promise<void>
export const deleteUser: UserDeleteFn = async (id) => {
  await http.delete(`/user?id=${id}`)
}

// Paid user
type UserPaidListFn = (body: UserPaidListParams) => Promise<UserPaidList>
export const getUserPaidList: UserPaidListFn = async (body) => {
  const { data } = await http.post<UserPaidList>('/user/member/package', body)
  return { ...data, list: data.list.map(item => zUserPaid.parse(item)) }
}

// Extra info
type ExtraInfoFn = (id: number) => Promise<UserExtraInfo>
export const getExtraInfo: ExtraInfoFn = async (id) => {
  const { data } = await http.get<UserExtraInfo>(`/user/extra/${id}`)
  return data
}

// Keys
// type RefreshApiKeyFn = (id: number) => Promise<string>
export const refreshApiKey = async (id: number) => {
  return (await http.post<string>(`/user/key/${id}`)).data
}

// type RefreshBulkApiKeyFn = (id: number) => Promise<string>
export const refreshBulkApiKey = async (id: number) => {
  return (await http.put(`/user/bulkKey/${id}`)).data
}

// Service
type ServiceListFn = (id: number) => Promise<UserService[]>
export const getUserServices: ServiceListFn = async (id) => {
  const { data } = await http.get<UserService[]>(`/user/price/${id}`)
  return data.map(item => zUserService.parse(item))
}

type ServiceCreateFn = (body: UserServiceCreateParams) => Promise<UserService>
export const createUserService: ServiceCreateFn = async (body) => {
  return (await http.post<UserService>('/user/price', body)).data
}

type ServiceUpdateFn = (body: UserServiceUpdateParams) => Promise<number>
export const updateUserService: ServiceUpdateFn = async (body) => {
  return (await http.put<number>('/user/price', body)).data
}

type ServiceDeleteFn = (ids: number[]) => Promise<void>
export const deleteUserService: ServiceDeleteFn = async (data) => {
  await http.delete(`/user/price`, { data })
}

// Point
type PointUpdateFn = (body: UserPointForm) => Promise<AxiosResponse>
export const updateUserPoint: PointUpdateFn = (body) => {
  return http.put('/user/point', body)
}

// Api key
type ApiKeyUpdateFn = (userId: number) => Promise<string>
export const updateUserApiKey: ApiKeyUpdateFn = async (userId) => {
  return (await http.post(`/user/key/${userId}`)).data
}

// Bulk api key
type BulkApiKeyUpdateFn = (userId: number) => Promise<string>
export const updateUserBulkApiKey: BulkApiKeyUpdateFn = async (userId) => {
  return (await http.get(`/user/bulkKey/${userId}`)).data
}

type LoginFrontFn = (body: UserLoginFront) => Promise<string>
export const loginUserFront: LoginFrontFn = async (body) => {
  const { data } = await http.post<string>('/user/generateCode', body)
  return data
}
