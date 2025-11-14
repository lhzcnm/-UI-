export type StoreType = 'all' | 'hot' | 'new'
export type DetailStatus = 'view' | 'order' | 'pay'
export type PayMethodType = 'wxpay' | 'alipay'

export interface StoreTypeItem {
  id: StoreType,
  name: string,
}

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
