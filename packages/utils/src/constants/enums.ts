import type { StatusMap, TypeListItem, TypeMap } from '@3un/shared'
import { IMEI_AND_SN_REG, IMEI_REG, SN_REG, DOMESTIC_DEFAULT_REG, DOMESTIC_XIAOMI_REG, DOMESTIC_OPPO_REG, DOMESTIC_VIVO_REG } from './regexs'

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
  NULL       = 0,
  NONE       = 5,
  IMEI       = 2,
  SN         = 4,
  IMEI_OR_SN = 6,
  DOMESTIC = 7,
}
export const IMEI_TYPE_MAP: TypeMap = {
  [IMEI_TYPE.NULL]       : {
    value: IMEI_TYPE.NONE,
    label: 'IMEI/SN',
    key: 'type.imei.5',
    regex: IMEI_AND_SN_REG,
  },
  [IMEI_TYPE.NONE]       : {
    value: IMEI_TYPE.NONE,
    label: 'IMEI/SN',
    key: 'type.imei.5',
    regex: IMEI_AND_SN_REG,
  },
  [IMEI_TYPE.IMEI]       : {
    value: IMEI_TYPE.IMEI,
    label: 'IMEI',
    key: 'type.imei.2',
    regex: IMEI_REG,
  },
  [IMEI_TYPE.SN]         : {
    value: IMEI_TYPE.SN,
    label: 'SN',
    key: 'type.imei.4',
    regex: SN_REG,
  },
  [IMEI_TYPE.IMEI_OR_SN] : {
    value: IMEI_TYPE.IMEI_OR_SN,
    label: 'IMEI/SN',
    key: 'type.imei.6',
    regex: IMEI_AND_SN_REG,
  },
  // [IMEI_TYPE.DOMESTIC] : {
  //   value: IMEI_TYPE.DOMESTIC,
  //   label: 'DOMESTIC MACHINES',
  //   key: '',
  //   regex: DOMESTIC_REG,
  // }
}

export enum DOMESTIC_IMEI_TYPE {
  DEFAULT = 0,
  XIAOMI = 1,
  OPPO = 2,
  VIVO = 3,
}
export const DOMESTIC_IMEI_MAP: TypeMap = {
  [DOMESTIC_IMEI_TYPE.DEFAULT]: {
    value: DOMESTIC_IMEI_TYPE.DEFAULT,
    label: '未知类型',
    key: 'domestic.0',
    regex: DOMESTIC_DEFAULT_REG
  },
  [DOMESTIC_IMEI_TYPE.XIAOMI]: {
    value: DOMESTIC_IMEI_TYPE.XIAOMI,
    label: 'xiaomi',
    key: 'domestic.1',
    regex: DOMESTIC_XIAOMI_REG
  },
  [DOMESTIC_IMEI_TYPE.OPPO]: {
    value: DOMESTIC_IMEI_TYPE.OPPO,
    label: 'oppo',
    key: 'domestic.2',
    regex: DOMESTIC_OPPO_REG
  },
  [DOMESTIC_IMEI_TYPE.VIVO]: {
    value: DOMESTIC_IMEI_TYPE.VIVO,
    label: 'vivo',
    key: 'domestic.3',
    regex: DOMESTIC_VIVO_REG
  },
}
export const DOMESTIC_IMEI_LIST = [
  { value: DOMESTIC_IMEI_TYPE.DEFAULT, label: '默认规则' },
  { value: DOMESTIC_IMEI_TYPE.XIAOMI, label: '小米' },
  { value: DOMESTIC_IMEI_TYPE.OPPO, label: 'oppo' },
  { value: DOMESTIC_IMEI_TYPE.VIVO, label: 'vivo' },
]

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
  [PAYMENT_STATUS.UNPAID] : { color: 'info', label: '未支付', key: 'recharge_Unpaid' },
  [PAYMENT_STATUS.PAID]   : { color: 'success', label: '已支付', key: 'recharge_Paid' },
}

export const PAYMENT_STATUS_LIST = [
  { value: PAYMENT_STATUS.UNPAID, label: '未支付', key: 'recharge_Unpaid' },
  { value: PAYMENT_STATUS.PAID, label: '已支付', key: 'recharge_Paid' },
]

// Payment Method
export enum PAYMENT_METHOD {
  ADMIN    = 5,
  ACTIVITY = 6,
  // ADMINERR   = 7,
  ALIPAY   = 8,
  WECHAT   = 9,
  VOUCHER  = 10,
}
export const PAYMENT_METHOD_MAP: StatusMap = {
  [PAYMENT_METHOD.ADMIN]  : { color: 'warning', label: '管理员充值' },
  [PAYMENT_METHOD.ACTIVITY]  : { color: 'warning', label: '活动赠送' },
  [PAYMENT_METHOD.ALIPAY] : { color: 'primary', label: '支付宝' },
  [PAYMENT_METHOD.WECHAT] : { color: 'success', label: '微信' },
  [PAYMENT_METHOD.VOUCHER] : { color: 'success', label: '积分券' },
}
export const PAYMENT_METHOD_LIST = [
  { value: PAYMENT_METHOD.ADMIN, label: '管理员充值' },
  // { value: PAYMENT_METHOD.ADMINERR, label: '管理员充值' },
  { value: PAYMENT_METHOD.ALIPAY, label: '支付宝' },
  { value: PAYMENT_METHOD.WECHAT, label: '微信' },
  { value: PAYMENT_METHOD.VOUCHER, label: '积分券' },
]

// Submit Method
export enum SUBMIT_METHOD {
  NONE    = 0,
  API     = 1,
  DESKTOP = 2,
  WECHAT  = 3,
  WEB     = 4,
  APP     = 5,
  STORE   = 6,
}
export const SUBMIT_METHOD_MAP: StatusMap = {
  [SUBMIT_METHOD.NONE]    : { color: 'info', label: '未知' },
  [SUBMIT_METHOD.API]     : { color: 'danger', label: 'API Endpoint' },
  [SUBMIT_METHOD.DESKTOP] : { color: 'primary', label: '桌面端' },
  [SUBMIT_METHOD.WECHAT]  : { color: 'success', label: '公众号' },
  [SUBMIT_METHOD.WEB]     : { color: 'warning', label: '网页端' },
  [SUBMIT_METHOD.APP]     : { color: 'success', label: 'app端'},
  [SUBMIT_METHOD.STORE]     : { color: 'success', label: '商城'},
}
export const SUBMIT_METHOD_LIST = [
  { value: SUBMIT_METHOD.NONE, label: '未知' },
  { value: SUBMIT_METHOD.API, label: 'API Endpoint' },
  { value: SUBMIT_METHOD.DESKTOP, label: '桌面端' },
  { value: SUBMIT_METHOD.WECHAT, label: '公众号' },
  { value: SUBMIT_METHOD.WEB, label: '网页端' },
  { value: SUBMIT_METHOD.APP, label: 'app端' },
  { value: SUBMIT_METHOD.STORE, label: '商城' },
]

export enum ORDER_SEARCH_SUBMIT_METHOD {
  API     = 1,
  DESKTOP = 2,
  WECHAT  = 3,
  WEB     = 4,
  APP     = 5,
}
export const ORDER_SEARCH_SUBMIT_METHOD_LIST = [
  { value: ORDER_SEARCH_SUBMIT_METHOD.API, label: 'API提交' },
  { value: ORDER_SEARCH_SUBMIT_METHOD.DESKTOP, label: 'qt桌面端提交' },
  { value: ORDER_SEARCH_SUBMIT_METHOD.WECHAT, label: '公众号提交' },
  { value: ORDER_SEARCH_SUBMIT_METHOD.WEB, label: '网页端提交' },
  { value: ORDER_SEARCH_SUBMIT_METHOD.APP, label: 'go桌面端提交' },
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
  WAIT           = 1,
  SUCCESS        = 2,
  FAILED         = 3,
  PROCESSING     = 4,
}
export const ORDER_STATUS_MAP: StatusMap = {
  // [ORDER_STATUS.WAIT]       : { color: 'info', label: '等待提交', labelEn: 'Pending', key: 'status.order.1' },
  [ORDER_STATUS.WAIT]       : { color: 'info', label: '等待提交', labelEn: 'Pending', key: 'history_Pending_Submission' },
  [ORDER_STATUS.SUCCESS]    : { color: 'success', label: '处理成功', labelEn: 'Success', key: 'history_Success' },
  [ORDER_STATUS.FAILED]     : { color: 'danger', label: '处理失败', labelEn: 'Failed', key: 'history_Fail' },
  [ORDER_STATUS.PROCESSING] : { color: 'primary', label: '正在处理', labelEn: 'Processing', key: 'history_Processing' },
}
export const ORDER_STATUS_LIST = [
  { value: ORDER_STATUS.WAIT, label: '等待提交', key: 'history_Pending_Submission' },
  // { value: ORDER_STATUS.WAIT, label: '等待提交', key: 'status.order.5' },
  { value: ORDER_STATUS.SUCCESS, label: '处理成功', key: 'history_Success' },
  { value: ORDER_STATUS.FAILED, label: '处理失败', key: 'history_Fail' },
  { value: ORDER_STATUS.PROCESSING, label: '正在处理', key: 'history_Processing' },
]

// async order
export enum ASYNC_ORDER_STATUS {
  ASYNC_SUBMITED = 0,
  ASYNC_FAILED   = 1,
  WAIT           = 2,
}
export const ASYNC_ORDER_STATUS_MAP: StatusMap = {
  [ASYNC_ORDER_STATUS.ASYNC_SUBMITED] : { color: 'success', label: '提交成功', labelEn: 'Success', key: 'status.unlock.0' },
  [ASYNC_ORDER_STATUS.ASYNC_FAILED] : { color: 'danger', label: '提交失败', labelEn: 'Success', key: 'status.unlock.1' },
  [ASYNC_ORDER_STATUS.WAIT] : { color: 'info', label: '等待提交', labelEn: 'Pending', key: 'status.unlock.2' },
}

export const ASYNC_ORDER_STATUS_MAP_LOCALE: StatusMap = {
  [ASYNC_ORDER_STATUS.ASYNC_SUBMITED] : { color: 'success', label: '提交成功', labelEn: 'Success', key: 'submit_SuccessSubmit' },
  [ASYNC_ORDER_STATUS.ASYNC_FAILED] : { color: 'danger', label: '提交失败', labelEn: 'Success', key: 'submit_FailedSubmit' },
  [ASYNC_ORDER_STATUS.WAIT] : { color: 'info', label: '等待提交', labelEn: 'Pending', key: 'submit_WaitSubmit' },
}

// Order Verify
export enum ORDER_VERIFY {
  NORMAL    = 0,
  REPLIED   = 1,
  SOLVED    = 2,
  REFUNDED  = 3,
}
export const ORDER_VERIFY_MAP: StatusMap = {
  [ORDER_VERIFY.NORMAL]    : { color: 'info', label: '正常', labelEn: 'Normal', key: 'history_ORDER_VERIFY_MAP1' },
  [ORDER_VERIFY.REPLIED]   : { color: 'primary', label: '已反馈', labelEn: 'Feedback', key: 'history_ORDER_VERIFY_MAP2' },
  [ORDER_VERIFY.SOLVED]    : { color: 'success', label: '已解决', labelEn: 'Solved', key: 'history_ORDER_VERIFY_MAP3' },
  [ORDER_VERIFY.REFUNDED]  : { color: 'danger', label: '已退款', labelEn: 'Refund', key: 'history_ORDER_VERIFY_MAP4' },
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
  [TICKET_STATUS.WAIT]    : { color: 'primary', label: '未处理', key: 'status.workFold.0' },
  [TICKET_STATUS.PROCESS] : { color: 'warning', label: '处理中', key: 'status.workFold.1' },
  [TICKET_STATUS.SOLVED]  : { color: 'success', label: '已解决', key: 'status.workFold.2' },
}

export const TICKET_STATUS_MAP_LOCALE: StatusMap = {
  [TICKET_STATUS.WAIT]    : { color: 'primary', label: '未处理', key: 'submit_Pending' },
  [TICKET_STATUS.PROCESS] : { color: 'warning', label: '处理中', key: 'submit_Processing' },
  [TICKET_STATUS.SOLVED]  : { color: 'success', label: '已解决', key: 'submit_Resolved' },
}

export const TICKET_STATUS_LIST = [
  { value: TICKET_STATUS.WAIT, label: '未处理', key: 'status.workFold.0' },
  { value: TICKET_STATUS.PROCESS, label: '处理中', key: 'status.workFold.1' },
  { value: TICKET_STATUS.SOLVED, label: '已解决', key: 'status.workFold.2' },
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
  { value: TICKET_PRIORITY.HIGH, label: '紧急', key: 'ticket_StatusTicket0' },
  { value: TICKET_PRIORITY.MEDIUM, label: '普通', key: 'ticket_StatusTicket1' },
  { value: TICKET_PRIORITY.LOW, label: '可以等待', key: 'ticket_StatusTicket2' },
]

// Ticket Type
export enum TICKET_TYPE {
  RECHARGE = 16,
  ORDER    = 17,
}
export const TICKET_TYPE_MAP: StatusMap = {
  [TICKET_TYPE.RECHARGE] : { color: 'success', label: '充值退款问题', key: 'type.ticket.16' },
  [TICKET_TYPE.ORDER]    : { color: 'warning', label: '订单问题', key: 'type.ticket.17' },
}
export const TICKET_TYPE_LIST = [
  { value: TICKET_TYPE.RECHARGE, label: '充值退款问题', key: 'type.ticket.16' },
  { value: TICKET_TYPE.ORDER, label: '订单问题', key: 'type.ticket.17' },
]

// Store Device Type
export enum CATEGORY_MAP {
  ALL         = 0,
  PHONE       = 1,
  WATCH       = 2,
  ACCESSORIES = 3,
}

export const CATEGORY_MAP_LIST = {
  [CATEGORY_MAP.ALL]: {name: '全部'},
  [CATEGORY_MAP.PHONE]: { name: 'IPhone' },
  [CATEGORY_MAP.WATCH]: { name: 'Watch' },
  [CATEGORY_MAP.ACCESSORIES]: { name: 'Accessories' },
}

// Refund Status
export enum REFUND_STATUS {
  WAIT     = 5,
  SOLVED   = 6,
  REJECTED = 7,
}

export const REFUND_STATUS_MAP: StatusMap = {
  [REFUND_STATUS.WAIT]     : { color: 'primary', label: '退款待处理' },
  [REFUND_STATUS.SOLVED]   : { color: 'success', label: '退款处理完成' },
  [REFUND_STATUS.REJECTED] : { color: 'info', label: '不可退款' },
}

/**
 * voucher
 */
export enum VOUCHER_STATUS {
  USEFUL  = 0,
  USED    = 1,
  FAILURE = 2,
}

export const VOUCHER_STATUS_MAP: StatusMap = {
  [VOUCHER_STATUS.USEFUL] : { color: 'primary', label: '未使用' },
  [VOUCHER_STATUS.USED] : { color: 'success', label: '已使用' },
  [VOUCHER_STATUS.FAILURE] : { color: 'danger', label: '已失效' },
}

export const VOUCHER_STATUS_List: TypeListItem[] = [
  { value: VOUCHER_STATUS.USEFUL, label: '未使用' },
  { value: VOUCHER_STATUS.USED, label: '已使用' },
  { value: VOUCHER_STATUS.FAILURE, label: '已失效' },
]

export enum VOUCHER_ENUM {
  COMMON   = 1,
  ACTIVITY = 2,
}

export const VOUCHER_ENUM_MAP: StatusMap = {
  [VOUCHER_ENUM.COMMON]: { color: 'primary', label: "积分充值" },
  [VOUCHER_ENUM.ACTIVITY]: { color: 'success', label: "活动赠送" },
}

export enum VOUCHER_TYPE {
  COMMON = 1,
  QUERY  = 2,
  UNLOCK = 3,
}

export const VOUCHER_TYPE_MAP: StatusMap = {
  [VOUCHER_TYPE.COMMON]: { color: 'primary', label: "充值积分券" },
  [VOUCHER_TYPE.QUERY]: { color: 'success', label: "查询类积分券" },
  [VOUCHER_TYPE.UNLOCK]: { color: 'warning', label: "解锁类积分券" },
}

export const VOUCHER_TYPE_LIST = [
  { value: VOUCHER_TYPE.COMMON, label: "用户积分" },
  { value: VOUCHER_TYPE.QUERY, label: "查询类服务" },
  { value: VOUCHER_TYPE.UNLOCK, label: "解锁类服务" },
]

/**
 * quotation
 */
export enum BRAND_STATUS {
  IPHONE  = 1,
  SAMSUNG = 2,
}

export const BRAND_STATUS_MAP: StatusMap = {
  [BRAND_STATUS.IPHONE]: { color: 'primary', label: '苹果' },
  [BRAND_STATUS.SAMSUNG]: { color: 'success', label: '三星' }
}

/**
 * activity
 */
export enum ACTIVITY_STATUS {
  DISABLE = 0,
  ENABLE  = 1,
}

export const ACTIVITY_STATUS_LIST = [
  { value: ACTIVITY_STATUS.DISABLE, label: "禁用" },
  { value: ACTIVITY_STATUS.ENABLE, label: "启用" },
]

export const ACTIVITY_STATUS_MAP = {
  [ACTIVITY_STATUS.DISABLE]: { value: ACTIVITY_STATUS.DISABLE, label: "禁用", class: "text-danger" },
  [ACTIVITY_STATUS.ENABLE]: { value: ACTIVITY_STATUS.ENABLE, label: "启用", class: "text-success" }
}

export enum ACTIVITY_TRIGGER_TYPE {
  RECHARGE = 1,
  SIGN     = 2,
  SHARE    = 3,
}

export const ACTIVITY_TRIGGER_TYPE_LIST = [
  { value: ACTIVITY_TRIGGER_TYPE.RECHARGE, label: "充值" },
  { value: ACTIVITY_TRIGGER_TYPE.SIGN, label: "签到" },
  { value: ACTIVITY_TRIGGER_TYPE.SHARE, label: "分享" },
]

export const ACTIVITY_TRIGGER_TYPE_MAP = {
  [ACTIVITY_TRIGGER_TYPE.RECHARGE]: { value: ACTIVITY_TRIGGER_TYPE.RECHARGE, label: "充值", class: "text-danger" },
  [ACTIVITY_TRIGGER_TYPE.SIGN]: { value: ACTIVITY_TRIGGER_TYPE.SIGN, label: "签到", class: "text-success" },
  [ACTIVITY_TRIGGER_TYPE.SHARE]: { value: ACTIVITY_TRIGGER_TYPE.SHARE, label: "分享", class: "text-primary" },
}

export enum ACTIVITY_BONUS {
  BALANCE    = 1,
  QUERY      = 2,
  UNLOCK     = 3
}

export const ACTIVITY_BONUS_LIST = [
  { value: ACTIVITY_BONUS.BALANCE, label: "赠送余额" },
  { value: ACTIVITY_BONUS.QUERY, label: "赠送查询积分" },
  { value: ACTIVITY_BONUS.UNLOCK, label: "赠送解锁积分" },
]

// export enum ACTIVATE_STATUS {
//   OFF = 0,
//   ON  = 1,
// }

// export const ACTIVATE_STATUS_MAP = {
//   []
// }

export enum ACCESS_LEVEL {
  BASIC   = 0,
  AUCTION = 1,
}

export const ACCESS_LEVEL_MAP = {
  [ACCESS_LEVEL.BASIC]: { value: ACCESS_LEVEL.BASIC, label: "所有基础功能" },
  [ACCESS_LEVEL.AUCTION]: { value: ACCESS_LEVEL.AUCTION, label: "基础功能 + 竞价功能" },
}

export const ACCESS_LEVEL_LIST = [
  { value: ACCESS_LEVEL.BASIC, label: "所有基础功能" },
  { value: ACCESS_LEVEL.AUCTION, label: "基础功能 + 竞价功能" },
]

/**
 * auction
 */
export enum LOCK_STATUS {
  NONE = 0,
  HAD  = 1,
}

export const LOCK_STATUS_LIST = [
  { value: LOCK_STATUS.NONE, label: '无锁' },
  { value: LOCK_STATUS.HAD, label: '有锁' },
]

export const LOCK_STATUS_MAP = {
  [LOCK_STATUS.NONE]: { value: LOCK_STATUS.NONE, color: 'success', label: '无锁' },
  [LOCK_STATUS.HAD]: { value: LOCK_STATUS.HAD, color: 'danger', label: '有锁' },
}

export enum SCOPE_TYPE {
  ALL      = 1,
  PARTIAL  = 2,
  MODEL    = 3,
  FAMILY   = 4,
}

export const SCOPE_TYPE_MAP = {
  [SCOPE_TYPE.ALL]: { value: SCOPE_TYPE.ALL, label: '型号 + 容量 + 颜色' },
  [SCOPE_TYPE.PARTIAL]: { value: SCOPE_TYPE.PARTIAL, label: '型号 + 容量 (所有颜色)' },
  [SCOPE_TYPE.MODEL]: { value: SCOPE_TYPE.MODEL, label: '型号 (所有容量和颜色)' },
  [SCOPE_TYPE.FAMILY]: { value: SCOPE_TYPE.FAMILY, label: '系列 (Family 等)' }
}

export enum PRICE_TYPE {
  ADD  = 0,
  MIUM = 1,
}

export const PRICE_TYPE_LIST = [
  { value: PRICE_TYPE.ADD, label: '增加' },
  { value: PRICE_TYPE.MIUM, label: '减少' }
]

const fieldRenderType = [
  "index",
  "service",
  "status",
  "html",
  "recommend",
  "text"
] as const

export type FieldRenderType = (typeof fieldRenderType)[number]

export enum ServiceFieldType {
  Default = 1,
  Dynamic = 2
}

export const SERVICE_FIELD_MAP = {
  [ServiceFieldType.Default]: { value: ServiceFieldType.Default, label: '默认字段(不允许删除)' },
  [ServiceFieldType.Dynamic]: { value: ServiceFieldType.Dynamic, label: '服务动态字段' },
}

export const SERVICE_FIELD_LIST = [
  { value: ServiceFieldType.Default, label: '默认字段(不允许删除)' },
  { value: ServiceFieldType.Dynamic, label: '服务动态字段' },
]
