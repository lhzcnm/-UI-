export interface SettingItem {
  id          : number
  name        : string
  content     : string
  status      : boolean
  description : string
}
export interface ConfigItem {
  id          : number
  key         : string
  value       : string
  description : string
}

// Settings
export interface Settings {
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
  // API 使用说明
  apiUsageInfo: string
  // 弹窗公告内容
  popupAnncEn: string
  // 滚动公告内容
  scrollingAnncEn: string
  // 支付信息
  paymentInfoEn: string
  // API 使用说明
  apiUsageInfoEn: string


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
  // 邀请码生成文本
  invite: string
}

// Config
export interface Configs {
  url: string
  name: string
  'invite:for:point': string
  'invite:point': string
  'api:url': string
  'wx:scan:info': string
  'wx:additional:info': string
  'wx:follow:info': string
  'wx:error:info': string
  'filter:excluded_words': string
}
