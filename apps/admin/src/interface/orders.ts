export enum OrderStatus {
  WAITING    = 1,
  SUCCESS    = 2,
  FAILED     = 3,
  PROCESSING = 4,
}

export enum OrderVerify {
  NORMAL     = 1,
  PROCESSING = 2,
  VERIFIED   = 3,
  REFUND     = 4,
}

export enum OrderSubmitMethod {
  API     = 1,
  DESKTOP = 2,
  WECHAT  = 3,
  WEB     = 4,
}

export type Order = {
  id: number
  userId: number
  serviceId: number
  imei: string
  credits: number
  status: OrderStatus
  verify: OrderVerify
  submitMethod: OrderSubmitMethod
  result: string | null
  orderIdFromServer: string
  messageFromServer: string | null
  isPushed: boolean
  isBulk: boolean
  ip: string | null
  remark: string | null
  createdTime: string
  updatedTime: string
}
