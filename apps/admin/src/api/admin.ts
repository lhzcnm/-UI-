import type { AdminCreateParams, AdminUpdateParams, User } from '@/inters/users'
import { zUser } from '@/inters/users'
import http from '@/utils/http'

type AdminListFn = () => Promise<User[]>
export const getAdmins: AdminListFn = async () => {
  const { data } = await http.get<User[]>('')
  return data.map(item => zUser.parse(item))
}

type AdminCreateFn = (params: AdminCreateParams) => Promise<User>
export const createAdmin: AdminCreateFn = async (params) => {
  const { data } = await http.post<User>('', params)
  return zUser.parse(data)
}

type AdminUpdateFn = (params: AdminUpdateParams) => Promise<number>
export const updateAdmin: AdminUpdateFn = async (params) => {
  return (await http.put<number>('', params)).data
}

type AdminDeleteFn = (id: number) => Promise<void>
export const deleteAdmin: AdminDeleteFn = async (id) => {
  await http.delete(`/${id}`)
}
