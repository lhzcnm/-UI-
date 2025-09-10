import type { StatusMap } from '@3un/shared'

// User Role
export enum USER_ROLE {
  USER        = 0,
  ADMIN       = 1,
  SUPER_ADMIN = 2,
}
export const USER_ROLE_MAP: StatusMap = {
  [USER_ROLE.USER]        : { color: 'info', label: '普通用户' },
  [USER_ROLE.ADMIN]       : { color: 'warning', label: '管理员' },
  [USER_ROLE.SUPER_ADMIN] : { color: 'danger', label: '超级管理员' },
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
  APP     = 5,
}
export const SUBMIT_METHOD_MAP: StatusMap = {
  [SUBMIT_METHOD.NONE]    : { color: 'info', label: '未知' },
  [SUBMIT_METHOD.API]     : { color: 'danger', label: 'API Endpoint' },
  [SUBMIT_METHOD.DESKTOP] : { color: 'primary', label: '桌面端' },
  [SUBMIT_METHOD.WECHAT]  : { color: 'success', label: '公众号' },
  [SUBMIT_METHOD.WEB]     : { color: 'warning', label: '网页端' },
  [SUBMIT_METHOD.APP]     : { color: 'success', label: 'app端'},
}
export const SUBMIT_METHOD_LIST = [
  { value: SUBMIT_METHOD.NONE, label: '未知' },
  { value: SUBMIT_METHOD.API, label: 'API Endpoint' },
  { value: SUBMIT_METHOD.DESKTOP, label: '桌面端' },
  { value: SUBMIT_METHOD.WECHAT, label: '公众号' },
  { value: SUBMIT_METHOD.WEB, label: '网页端' },
  { value: SUBMIT_METHOD.APP, label: 'app端' },
]

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
  [API_TYPE.DATABASE] : { color: 'warning', label: '数据库' },
  [API_TYPE.CUSTOM]   : { color: 'info', label: '自定义' },
}
export const API_TYPE_LIST = [
  { value: API_TYPE.REALTIME, label: '实时查询' },
  { value: API_TYPE.DHRU, label: 'DHRU' },
  { value: API_TYPE.DATABASE, label: '数据库' },
  { value: API_TYPE.CUSTOM, label: '自定义' },
]

// Order
export enum ORDER_STATUS {
  WAIT        = 1,
  SUCCESS     = 2,
  FAILED      = 3,
  PROCESSING  = 4,
}
export const ORDER_STATUS_MAP: StatusMap = {
  [ORDER_STATUS.WAIT]       : { color: 'info', label: '等待提交', key: 'status.order.1' },
  [ORDER_STATUS.SUCCESS]    : { color: 'success', label: '处理成功', key: 'status.order.2' },
  [ORDER_STATUS.FAILED]     : { color: 'danger', label: '处理失败', key: 'status.order.3' },
  [ORDER_STATUS.PROCESSING] : { color: 'primary', label: '正在处理', key: 'status.order.4' },
}
export const ORDER_STATUS_LIST = [
  { value: ORDER_STATUS.WAIT, label: 'status.order.1' },
  { value: ORDER_STATUS.SUCCESS, label: 'status.order.2' },
  { value: ORDER_STATUS.FAILED, label: 'status.order.3' },
  { value: ORDER_STATUS.PROCESSING, label: 'status.order.4' },
]

// Order Verify
export enum ORDER_VERIFY {
  NORMAL    = 0,
  REPLIED   = 1,
  SOLVED    = 2,
  REFUNDED  = 3,
}
export const ORDER_VERIFY_MAP: StatusMap = {
  [ORDER_VERIFY.NORMAL]    : { color: 'info', label: '正常', key: 'status.vertify.0' },
  [ORDER_VERIFY.REPLIED]   : { color: 'primary', label: '已反馈', key: 'status.vertify.1' },
  [ORDER_VERIFY.SOLVED]    : { color: 'success', label: '已解决', key: 'status.vertify.2' },
  [ORDER_VERIFY.REFUNDED]  : { color: 'danger', label: '已退款', key: 'status.vertify.3' },
}
export const ORDER_VERIFY_LIST = [
  { value: ORDER_VERIFY.NORMAL, label: '正常' },
  { value: ORDER_VERIFY.REPLIED, label: '已反馈' },
  { value: ORDER_VERIFY.SOLVED, label: '已解决' },
  { value: ORDER_VERIFY.REFUNDED, label: '已退款' },
]

// Ticket
export enum TICKET_STATUS {
  WAIT    = 0,
  PROCESS = 1,
  SOLVED  = 2,
}
export const TICKET_STATUS_MAP: StatusMap = {
  [TICKET_STATUS.WAIT]    : { color: 'primary', label: '未处理' },
  [TICKET_STATUS.PROCESS] : { color: 'warning', label: '处理中' },
  [TICKET_STATUS.SOLVED]  : { color: 'success', label: '已解决' },
}
export const TICKET_STATUS_LIST = [
  { value: TICKET_STATUS.WAIT, label: '未处理' },
  { value: TICKET_STATUS.PROCESS, label: '处理中' },
  { value: TICKET_STATUS.SOLVED, label: '已解决' },
]

// Ticket Priority
export enum TICKET_PRIORITY {
  HIGH   = 0,
  MEDIUM = 1,
  LOW    = 2,
}
export const TICKET_PRIORITY_MAP: StatusMap = {
  [TICKET_PRIORITY.HIGH]   : { color: 'danger', label: '紧急', key: 'status.ticket.0' },
  [TICKET_PRIORITY.MEDIUM] : { color: 'primary', label: '普通', key: 'status.ticket.1' },
  [TICKET_PRIORITY.LOW]    : { color: 'info', label: '可以等待', key: 'status.ticket.2' },
}
export const TICKET_PRIORITY_LIST = [
  { value: TICKET_PRIORITY.HIGH, label: '紧急', key: 'status.ticket.0' },
  { value: TICKET_PRIORITY.MEDIUM, label: '普通', key: 'status.ticket.1' },
  { value: TICKET_PRIORITY.LOW, label: '可以等待', key: 'status.ticket.2' },
]

// Ticket Type
export enum TICKET_TYPE {
  RECHARGE = 16,
  ORDER    = 17,
}
export const TICKET_TYPE_MAP: StatusMap = {
  [TICKET_TYPE.RECHARGE] : { color: 'success', label: '充值退款问题' },
  [TICKET_TYPE.ORDER]    : { color: 'warning', label: '订单问题' },
}
export const TICKET_TYPE_LIST = [
  { value: TICKET_TYPE.RECHARGE, label: '充值退款问题' },
  { value: TICKET_TYPE.ORDER, label: '订单问题' },
]
