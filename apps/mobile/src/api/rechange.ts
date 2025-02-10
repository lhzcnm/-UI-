import type { RechangeApiCollection } from '@3un/shared/rechange'
import http from '@/utils/http'

const rechangeApi: RechangeApiCollection = {
  create: (params) => http.post('pay', params),
  verify: () => http.get('pay/check'),

  invoices: params => http.get('user/invoices', { params }),
  invoiceExport: () => http.post('user/invoices/export'),
}

export default rechangeApi
