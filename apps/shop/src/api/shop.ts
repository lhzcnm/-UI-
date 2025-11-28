import { zOrder, zSubmitResp, type Order, type OrderPayParams, type OrderSearchForm, type RefreshParams, type SubmitParams, type SubmitResp } from "@/inters/order"
import { zServiceDetail, type ServiceDetail, type ServiceParams } from "@/inters/services"
import { zTicket, type Ticket, type TicketForm } from "@/inters/ticket"
import { zUserInfo, type UserInfo } from "@/inters/user"
import http from "@/utils/http"
import type { IList } from "@3un/shared"
import type { AxiosResponse } from "axios"

export async function storeAuth(): Promise<string> {
  const { data } = await http.post<string>('mall/entry')
  return data
}

export async function getServices(params?: ServiceParams): Promise<ServiceDetail[]> {
  const { data } = await http.get<ServiceDetail[]>('mall/ServerQuery', { params }) 
  return data.map(item => zServiceDetail.parse(item))
}

export async function orderSearch(params: OrderSearchForm): Promise<IList<Order>> {
  const { data } = await http.get<IList<Order>>('mall/order/searchList', { params })
  return { ...data, list: data.list.map(item => zOrder.parse(item)) }
}

export async function orderPay(body: OrderPayParams): Promise<any> {
  const { data } = await http.post("/mall/pay", body)
  return data
}

export async function orderSubmit(body: SubmitParams): Promise<SubmitResp[]> {
  const { data } = await http.post<SubmitResp[]>("/mall/order/submit", body)
  return data.map(item => zSubmitResp.parse(item))
}

export async function checkQrcode(): Promise<AxiosResponse> {
  return await http.get<boolean>("/mall/pay/check")
}

export async function getTickets(): Promise<Ticket[]> {
  const { data } = await http.get<Ticket[]>('/mall/ticket/department')
  return data.map(item => zTicket.parse(item))
}

export async function createTicket(body: TicketForm): Promise<string> {
  const { data } = await http.post('/mall/ticket/create', body)
  return data
}

export async function getUserInfo(): Promise<UserInfo> {
  const { data } = await http.get<UserInfo>("/mall/User/info")
  return zUserInfo.parse(data)
}

export async function refreshOrders(body: RefreshParams): Promise<Order[]> {
  const { data } = await http.post<Order[]>("/mall/order/listOrder", body)
  return data.map(item => zOrder.parse(item))
}

export async function getPaymentStatus(id: string): Promise<boolean> {
  const { data } = await http.get<boolean>(`/mall/order/PayStatus/${id}`)
  return data
}
