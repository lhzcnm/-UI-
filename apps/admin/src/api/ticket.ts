import type { TicketList, TicketListParams, TicketReply, TicketReplyCreateParams, TicketType, TicketTypeCreateParams, TicketTypeUpdateParams, TicketUpdateParams } from '@/inters/ticket'
import { zTicket, zTicketReply, zTicketType } from '@/inters/ticket'
import http from '@/utils/http'

// Ticket
type TicketListFn = (params: TicketListParams) => Promise<TicketList>
export const getTickets: TicketListFn = async (params) => {
  const { data } = await http.post<TicketList>('/ticket', params)
  return { ...data, list: data.list.map(item => zTicket.parse(item)) }
}

type TicketUpdateFn = (params: TicketUpdateParams) => Promise<number>
export const updateTicket: TicketUpdateFn = async (params) => {
  return (await http.put('/ticket', params)).data
}

type TicketDeleteFn = (id: number) => Promise<void>
export const deleteTicket: TicketDeleteFn = async (id) => {
  await http.delete(`/ticket/${id}`)
}

// Ticket Reply
type TicketReplyListFn = (id: number) => Promise<TicketReply[]>
export const getTicketReplies: TicketReplyListFn = async (id) => {
  const { data } = await http.get<TicketReply[]>(`/ticket/msg?id=${id}`)
  return data.map(item => zTicketReply.parse(item))
}

type TicketReplyCreateFn = (params: TicketReplyCreateParams) => Promise<TicketReply>
export const createTicketReply: TicketReplyCreateFn = async (params) => {
  const { data } = await http.post<TicketReply>('/ticket/msg', params)
  return zTicketReply.parse(data)
}

// Ticket Type
type TicketTypeListFn = () => Promise<TicketType[]>
export const getTicketTypes: TicketTypeListFn = async () => {
  const { data } = await http.get<TicketType[]>('/ticket/department')
  return data.map(item => zTicketType.parse(item))
}

type TicketTypeCreateFn = (params: TicketTypeCreateParams) => Promise<TicketType>
export const createTicketType: TicketTypeCreateFn = async (params) => {
  const { data } = await http.post<TicketType>('/ticket/department', params)
  return zTicketType.parse(data)
}

type TicketTypeUpdateFn = (params: TicketTypeUpdateParams) => Promise<number>
export const updateTicketType: TicketTypeUpdateFn = async (params) => {
  return (await http.put('/ticket/department', params)).data
}

type TicketTypeDeleteFn = (id: number) => Promise<void>
export const deleteTicketType: TicketTypeDeleteFn = async (id) => {
  await http.delete(`/ticket/department/${id}`)
}
