import type { StatusMap } from '@3un/shared'

// User Role
export enum USER_ROLE {
  USER        = 0,
  ADMIN       = 1,
  SUPER_ADMIN = 2,
}

// Imei Type
export enum IMEI_TYPE {
  NONE       = 5,
  IMEI       = 2,
  SN         = 4,
  IMEI_OR_SN = 6,
}

// Recharge Type
export enum RECHARGE_TYPE {
  BALANCE    = 1,
  MEMBERSHIP = 2,
}

// Payment Status
export enum PAYMENT_STATUS {
  UNPAID = 1,
  PAID   = 2,
}
export const PAYMENT_STATUS_MAP: StatusMap = {
  [PAYMENT_STATUS.UNPAID] : { color: 'info', label: '未支付' },
  [PAYMENT_STATUS.PAID]   : { color: 'success', label: '已支付' },
}
export const PAYMENT_STATUS_LIST = [
  { value: PAYMENT_STATUS.UNPAID, label: '未支付' },
  { value: PAYMENT_STATUS.PAID, label: '已支付' },
]

// Payment Method
export enum PAYMENT_METHOD {
  ADMIN  = 5,
  ALIPAY = 8,
  WECHAT = 9,
}
export const PAYMENT_METHOD_MAP: StatusMap = {
  [PAYMENT_METHOD.ADMIN]  : { color: 'warning', label: '管理员充值' },
  [PAYMENT_METHOD.ALIPAY] : { color: 'primary', label: '支付宝' },
  [PAYMENT_METHOD.WECHAT] : { color: 'success', label: '微信' },
}
export const PAYMENT_METHOD_LIST = [
  { value: PAYMENT_METHOD.ADMIN, label: '管理员充值' },
  { value: PAYMENT_METHOD.ALIPAY, label: '支付宝' },
  { value: PAYMENT_METHOD.WECHAT, label: '微信' },
]

// Submit Method
export enum SUBMIT_METHOD {
  NONE    = 0,
  API     = 1,
  DESKTOP = 2,
  WECHAT  = 3,
  WEB     = 4,
}

// API Type
export enum API_TYPE {
  REALTIME = 0,
  DHRU     = 2,
  CUSTOM   = 3,
  DATABASE = 5,
}
export const API_TYPE_MAP: StatusMap = {
  [API_TYPE.REALTIME] : { color: 'success', label: '实时查询' },
  [API_TYPE.DHRU]     : { color: 'primary', label: 'DHRU' },
  [API_TYPE.CUSTOM]   : { color: 'info', label: '自定义' },
  [API_TYPE.DATABASE] : { color: 'danger', label: '数据库' },
}
export const API_TYPE_LIST = [
  { value: API_TYPE.REALTIME, label: '实时查询' },
  { value: API_TYPE.DHRU, label: 'DHRU' },
  { value: API_TYPE.CUSTOM, label: '自定义' },
  { value: API_TYPE.DATABASE, label: '数据库' },
]

// Shop
export enum SHOP_NAME {
  CREDIT   = 1,
  MONTHLY1 = 2,
  MONTHLY2 = 3,
  MONTHLY3 = 4,
}
export const SHOP_NAME_MAP: StatusMap = {
  [SHOP_NAME.CREDIT]   : { color: 'success', label: '积分充值' },
  [SHOP_NAME.MONTHLY1] : { color: 'primary', label: '包月会员一个月' },
  [SHOP_NAME.MONTHLY2] : { color: 'warning', label: '包月会员两个月' },
  [SHOP_NAME.MONTHLY3] : { color: 'danger', label: '包月会员三个月' },
}

// Order
export enum ORDER_STATUS {
  WAIT        = 1,
  SUCCESS     = 2,
  FAILED      = 3,
  PROCESSING  = 4,
}
export const ORDER_STATUS_MAP: StatusMap = {
  [ORDER_STATUS.WAIT]       : { color: 'info', label: '等待提交' },
  [ORDER_STATUS.SUCCESS]    : { color: 'success', label: '处理成功' },
  [ORDER_STATUS.FAILED]     : { color: 'danger', label: '处理失败' },
  [ORDER_STATUS.PROCESSING] : { color: 'primary', label: '正在处理' },
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
  [ORDER_VERTIFY.NORMAL]    : { color: 'info', label: '正常' },
  [ORDER_VERTIFY.REPLIED]   : { color: 'primary', label: '已反馈' },
  [ORDER_VERTIFY.SOLVED]    : { color: 'success', label: '已解决' },
  [ORDER_VERTIFY.REFUNDED]  : { color: 'danger', label: '已退款' },
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
  [TICKET_STATUS.WAIT]    : { color: 'info', label: '未处理' },
  [TICKET_STATUS.PROCESS] : { color: 'primary', label: '处理中' },
  [TICKET_STATUS.SOLVED]  : { color: 'success', label: '已解决' },
}

// Ticket Priority
export enum TICKET_PRIORITY {
  HIGH   = 0,
  MEDIUM = 1,
  LOW    = 2,
}
export const TICKET_PRIORITY_MAP: StatusMap = {
  [TICKET_PRIORITY.HIGH]   : { color: 'danger', label: '紧急' },
  [TICKET_PRIORITY.MEDIUM] : { color: 'primary', label: '普通' },
  [TICKET_PRIORITY.LOW]    : { color: 'info', label: '可以等待' },
}
export const TICKET_PRIORITY_LIST = [
  { value: TICKET_PRIORITY.HIGH, label: '紧急' },
  { value: TICKET_PRIORITY.MEDIUM, label: '普通' },
  { value: TICKET_PRIORITY.LOW, label: '可以等待' },
]

// Ticket Type
export enum TICKET_TYPE {
  RECHARGE = 0,
  ORDER    = 1,
}
export const TICKET_TYPE_MAP: StatusMap = {
  [TICKET_TYPE.RECHARGE] : { color: 'success', label: '充值退款问题' },
  [TICKET_TYPE.ORDER]    : { color: 'success', label: '订单问题' },
}
export const TICKET_TYPE_LIST = [
  { value: TICKET_TYPE.RECHARGE, label: '充值退款问题' },
  { value: TICKET_TYPE.ORDER, label: '订单问题' },
]
