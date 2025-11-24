export type PayType = "wxpay" | "alipay"

export type DetailStatus = 'view' | 'order' | 'pay'

export interface DetailStepEmits {
  next: [step: DetailStatus]
  prev: [step: DetailStatus]
}

export interface FormType {
  imei: string,
  pushRes: boolean,
  phone: string,
  mail: string,
}
