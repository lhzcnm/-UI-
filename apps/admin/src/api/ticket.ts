import type { Ticket, TicketIssue, TicketIssueCreateParams, TicketIssueUpdateParams, TicketList, TicketListParams, TicketReply, TicketReplyCreateParams, TicketUpdateParams } from '@/inters/ticket'
import { zTicket, zTicketIssue, zTicketReply } from '@/inters/ticket'
import http from '@/utils/http'

// Ticket
type TicketListFn = (params: TicketListParams) => Promise<TicketList>
export const getTickets: TicketListFn = async (params) => {
  const { data } = await http.get<TicketList>('/ticket', { params })
  return { ...data, list: data.list.map(item => zTicket.parse(item)) }
}

type TicketUpdateFn = (params: TicketUpdateParams) => Promise<Ticket>
export const updateTicket: TicketUpdateFn = async (params) => {
  const { data } = await http.put<Ticket>('/ticket', params)
  return zTicket.parse(data)
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

// Ticket Issue
type TicketIssueListFn = () => Promise<TicketIssue[]>
export const getTicketIssues: TicketIssueListFn = async () => {
  const { data } = await http.get<TicketIssue[]>('/ticket/department')
  return data.map(item => zTicketIssue.parse(item))
}

type TicketIssueCreateFn = (params: TicketIssueCreateParams) => Promise<TicketIssue>
export const createTicketIssue: TicketIssueCreateFn = async (params) => {
  const { data } = await http.post<TicketIssue>('/ticket/department', params)
  return zTicketIssue.parse(data)
}

type TicketIssueUpdateFn = (params: TicketIssueUpdateParams) => Promise<number>
export const updateTicketIssue: TicketIssueUpdateFn = async (params) => {
  return (await http.put('/ticket/department', params)).data
}

type TicketIssueDeleteFn = (id: number) => Promise<void>
export const deleteTicketIssue: TicketIssueDeleteFn = async (id) => {
  await http.delete(`/ticket/department/${id}`)
}
