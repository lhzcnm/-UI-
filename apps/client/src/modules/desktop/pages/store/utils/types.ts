import type { Service } from '@/api/services'

export type StoreStatus = 'serviceStore' | 'serviceDetail' | 'deviceStore'

export interface FormType {
  serviceId: number,
  price: number,
  imei: string,
  pushRes: boolean,
  phone: string,
  mail: string,
}

export interface Form {
  service: Service
}
