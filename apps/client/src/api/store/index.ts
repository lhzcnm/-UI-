import type { R } from '@3un/shared'

import http from '@/utils/http'
import type { ChatAiParams, OrderSearchParams, OrderSubmitResp, ServiceDetail, ServiceParams, StorePayParams, SubmitParams } from './types'

export async function storeAuth(): R<string> {
  return await http.post("/mall/entry")
}

export async function storeServices(params?: ServiceParams): R<ServiceDetail[]> {
  return await http.get('/mall/ServerQuery', { params })
}

export async function storeSubmit(data: SubmitParams): R<OrderSubmitResp[]> {
  return await http.post("/mall/order/submit", data)
}

export async function storePay(data: StorePayParams): R<string> {
  return await http.post('/mall/pay', data)
}

export async function checkQrcode(): R<boolean> {
  return await http.get('/mall/pay/check')
}

export async function chatAi(params: ChatAiParams): R<string> {
  return await http.get('/ai/chat', { params })
}

export async function orderSearch(params: OrderSearchParams): R<string> {
  return await http.get('/mall/order/query', { params })
}
