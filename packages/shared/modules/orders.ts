import type { ORDER_STATUS, ORDER_VERTIFY } from '@3un/utils'
import type { R, IList, IPage } from '..'

export interface OrderApiCollection {
  item(id: number): R<OrderItem>
  list(data: OrderListParams): R<IList<OrderItem>>
  export(data: OrderExportParams): R<string>

  submit(data: OrderSubmitParams): R<OrderSubmitResult[]>
  submitExport(data: number[]): R<string>

  verify(id: number): R<void>
}

export interface OrderItem {
  id: number
  serviceId: number
  serviceName: string
  status: ORDER_STATUS
  verify: ORDER_VERTIFY
  imei: string
  credits: number
  remark: string
  result: string
}

// --------
// Base
// --------
export type OrderListResponse = IList<OrderItem>

export interface OrderTableView {
  index: number
  id: number
  serviceId: number
  serviceName: string
  status: ORDER_STATUS
  verify: ORDER_VERTIFY
  imei: string
  credits: number
  remark: string
  result: string
}

// --------
// List
// --------
export type OrderListParams = IPage & {
  serviceId?: number
  status?: ORDER_STATUS
  verify?: ORDER_VERTIFY
  imeiList?: string[]
  startTime?: string
  endTime?: string
}
export interface OrderSearchForm {
  serviceId: number
  status: ORDER_STATUS | 'all'
  verify: ORDER_VERTIFY | 'all'
  imei: string
  date: [string, string]
}

// --------
// Export
// --------
export interface OrderExportParams {
  serviceId?: number
  status?: ORDER_STATUS
  verify?: ORDER_VERTIFY
  imeiList?: string[]
  startTime?: string
  endTime?: string
}
export interface OrderExportForm {
  status: ORDER_STATUS | 'all'
  verify: ORDER_VERTIFY | 'all'
  serviceId: number
  imei: string
  date: [string, string]
}

// --------
// Submit
// --------
export interface OrderSubmitForm {
  serviceId: number
  groupId: number
  imeiList: string
  remark: string
}

export interface OrderSubmitParams {
  serviceId: number
  groupId: number
  imeiList: string[]
  remark?: string
}
export interface OrderSubmitResult {
  status: ORDER_STATUS
  imei: string
  message: string
}
