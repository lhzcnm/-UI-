import type { R } from '@3un/shared'

import http from '@/utils/http'
import type { ServiceDetail, ServiceParams, StorePayParams, SubmitParams } from './types'

export async function storeAuth(): R<string> {
  return await http.post("/mall/entry")
}

export async function storeServices(params?: ServiceParams): R<ServiceDetail[]> {
  return await http.get('/mall/ServerQuery', { params })
}

export async function storeSubmit(data: SubmitParams): R<any> {
  return await http.post("/mall/order/submit", data)
}

export async function storePay(data: StorePayParams): R<any> {
  return await http.post('/mall/pay', data)
}

export async function checkQrcode(): R<boolean> {
  return await http.get('/mall/pay/check')
}
