import type { R } from '@3un/shared'

export interface SettingApi {
  get: () => R<Setting>
}

export interface Setting {
  // 网站标题
  title: string
  // 公司名称
  company: string
  // 联系电话
  phone: string
  // 邮箱
  email: string
  // 地址
  address: string
  // 备案号
  beian: string

  // 弹窗公告内容
  popupAnnc: string
  // 滚动公告内容
  scrollingAnnc: string
  // 支付信息
  paymentInfo: string
  // 会员信息
  memberInfo: string

  // 弹窗公告内容
  popupAnncEn: string
  // 滚动公告内容
  scrollingAnncEn: string
  // 支付信息
  paymentInfoEn: string
  // 会员信息
  memberInfoEn: string

  // API 使用说明
  apiUsageInfo: string

  // 最大充值金额
  maxRechargeAmount: number
  // 最小充值金额
  minRechargeAmount: number

  // 是否启用弹窗公告
  enablePopupAnnc: boolean
  // 是否启用滚动公告
  enableScrollingAnnc: boolean
  // 是否启用支付信息
  enablePaymentInfo: boolean
  // 是否启用会员信息
  enableMemberInfo: boolean

  // 是否启用注册
  enableRegister: boolean
  // 是否启用工单
  enableTricket: boolean
  // 是否启用订单审核
  enableOrderVerify: boolean
}

// export interface Setting {
//   title: string
//   phone: string
//   email: string
//   company: string
//   address: string
//   copyright: string

//   news: string
//   member: string
//   payment: string
//   announcement: string

//   maxRechargeAmount: string
//   minRechargeAmount: string

//   noForeignVisits: string
//   orderFeedback: string
//   tricket: string
// }
