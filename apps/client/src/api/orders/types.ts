import type { ORDER_STATUS, ORDER_VERIFY } from '@3un/utils'
import type { IList, IPage, R } from '@3un/shared'

export interface OrderApi {
  item(id: number): R<Order>
  list(data: OrderListParams): R<OrderListResponse>
  export(data: OrderExportParams): R<string>

  submit(data: OrderSubmitParams): R<OrderSubmitResult[]>
  submitExport(data: OrderSubmitExportParams): R<string>

  verify(id: number): R<void>
}

export interface Order {
  id: number
  serviceId: number
  status: ORDER_STATUS
  verify: ORDER_VERIFY
  imei: string
  credits: number
  remark: string
  result: string
  createTime: string
  recommends: OrderRecommend[] | null
}

export interface OrderRecommend {
  packageId: number
  name: string
}

/** Table */
export interface OrderTableView {
  id: number
  index: number
  serviceId: number | null
  serviceName: string | null
  status: ORDER_STATUS
  verify: ORDER_VERIFY
  imei: string
  credits: number
  remark: string
  result: string
  createTime: string
}

/** List */
export type OrderListResponse = IList<Order>
export type OrderListParams = IPage & {
  serviceId?: number
  status?: ORDER_STATUS
  imeiList?: string[]
  startTime?: string
  endTime?: string
}
export interface OrderSearchForm {
  serviceId: number
  status: ORDER_STATUS | -1
  imei: string
  startTime: string
  endTime: string
}

/** Export */
export interface OrderExportParams {
  serviceId: number
  status?: ORDER_STATUS
  imeiList?: string[]
  orderIdList?: string[]
  startTime?: string
  endTime?: string
  excelHead?: string[]
}
export interface OrderExportForm {
  serviceId: number
  imei: string
  status: ORDER_STATUS | -1
  startTime: string
  endTime: string
}

/** Submit */
export interface OrderSubmitParams {
  serviceId: number
  imeiList: string[]
  isBulk: boolean
  language: string
  remark?: string
}
export interface OrderSubmitForm {
  serviceId: number
  groupId: number
  imeiList: string
  remark: string
  isBulk: boolean
}
export interface OrderSubmitResult {
  status: ORDER_STATUS
  message: string
  imei: string
}
export interface OrderSubmitExportParams {
  orderIdList: number[]
  imeiList: string[]
  serviceId: number
  excelHead: string[]
}

export interface GeneratePictureParms {
  code: string,
  codeStatusId: number,
  imei: string,
  credits: string,
  codeId: string,
  comments: string,
  dataTime: string,
  packageTitle: string,
}
