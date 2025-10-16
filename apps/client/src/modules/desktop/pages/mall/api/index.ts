import type { R } from '@3un/shared'

import http from '@/utils/http'
import type { ServiceGroup, ServiceParams } from './types'

export async function storeAuth(): R<string> {
  return await http.post("/mall/entry")
}

export async function storeServices(params?: ServiceParams): R<ServiceGroup[]> {
  return await http.get('/mall/ServerQuery', { params })
}
