export type Colors = 'zinc' | 'emerald' | 'rose' | 'blue'
type StatusMap = Record<number, { color: Colors, label: string }>

// Imei Type
export enum IMEI_TYPE {
  NONE = 5,
  IMEI = 2,
  SN   = 4,
  IMEI_OR_SN = 6,
}

// Recharge Type
export enum RECHARGE_TYPE {
  BALANCE = 1,
  MEMBERSHIP = 2,
}

// Payment Status
export enum PAYMENT_STATUS {
  UNPAID = 1,
  PAID   = 2,
}
export const PAYMENT_STATUS_MAP: StatusMap = {
  [PAYMENT_STATUS.UNPAID] : { color: 'zinc', label: '未支付' },
  [PAYMENT_STATUS.PAID]   : { color: 'emerald', label: '已支付' },
}

// Shop
export enum SHOP_NAME {
  CREDIT = 1,
  MONTHLY1 = 2,
  MONTHLY2 = 3,
  MONTHLY3 = 4,
}

// Order
export enum ORDER_STATUS {
  WAIT     = 1,
  SUCCESS  = 2,
  FAILED     = 3,
  PROCESSING  = 4,
}
export const ORDER_STATUS_MAP: StatusMap = {
  [ORDER_STATUS.WAIT]    : { color: 'zinc', label: '等待提交' },
  [ORDER_STATUS.SUCCESS] : { color: 'emerald', label: '处理成功' },
  [ORDER_STATUS.FAILED]    : { color: 'rose', label: '处理失败' },
  [ORDER_STATUS.PROCESSING] : { color: 'blue', label: '正在处理' },
}
export const ORDER_STATUS_LIST = [
  { value: ORDER_STATUS.WAIT, label: '等待提交' },
  { value: ORDER_STATUS.SUCCESS, label: '处理成功' },
  { value: ORDER_STATUS.FAILED, label: '处理失败' },
  { value: ORDER_STATUS.PROCESSING, label: '正在处理' },
]

// Order Verify
export enum ORDER_VERTIFY {
  NORMAL    = 0,
  REPLIED   = 1,
  SOLVED    = 2,
  REFUNDED  = 3,
}
export const ORDER_VERTIFY_MAP: StatusMap = {
  [ORDER_VERTIFY.NORMAL]    : { color: 'zinc', label: '正常' },
  [ORDER_VERTIFY.REPLIED]   : { color: 'blue', label: '已反馈' },
  [ORDER_VERTIFY.SOLVED]    : { color: 'emerald', label: '已解决' },
  [ORDER_VERTIFY.REFUNDED]  : { color: 'rose', label: '已退款' },
}
export const ORDER_VERIFY_LIST = [
  { value: ORDER_VERTIFY.NORMAL, label: '正常' },
  { value: ORDER_VERTIFY.REPLIED, label: '已反馈' },
  { value: ORDER_VERTIFY.SOLVED, label: '已解决' },
  { value: ORDER_VERTIFY.REFUNDED, label: '已退款' },
]

// Ticket
export enum TICKET_STATUS {
  WAIT    = 0,
  PROCESS = 1,
  SOLVED  = 2,
}
export const TICKET_STATUS_MAP: StatusMap = {
  [TICKET_STATUS.WAIT]    : { color: 'zinc', label: '未处理' },
  [TICKET_STATUS.PROCESS] : { color: 'blue', label: '处理中' },
  [TICKET_STATUS.SOLVED]  : { color: 'emerald', label: '已解决' },
}

// Ticket Priority
export enum TICKET_PRIORITY {
  HIGH = 0,
  MEDIUM = 1,
  LOW = 2,
}
export const TICKET_PRIORITY_MAP: StatusMap = {
  [TICKET_PRIORITY.HIGH] : { color: 'rose', label: '紧急' },
  [TICKET_PRIORITY.MEDIUM] : { color: 'blue', label: '普通' },
  [TICKET_PRIORITY.LOW] : { color: 'zinc', label: '可以等待' },
}
export const TICKET_PRIORITY_LIST = [
  { value: TICKET_PRIORITY.HIGH, label: '紧急' },
  { value: TICKET_PRIORITY.MEDIUM, label: '普通' },
  { value: TICKET_PRIORITY.LOW, label: '可以等待' },
]

// Ticket Type
export enum TICKET_TYPE {
  RECHARGE = 0,
  ORDER = 1,
}
export const TICKET_TYPE_MAP: StatusMap = {
  [TICKET_TYPE.RECHARGE] : { color: 'emerald', label: '充值退款问题' },
  [TICKET_TYPE.ORDER] : { color: 'emerald', label: '订单问题' },
}
export const TICKET_TYPE_LIST = [
  { value: TICKET_TYPE.RECHARGE, label: '充值退款问题' },
  { value: TICKET_TYPE.ORDER, label: '订单问题' },
]
