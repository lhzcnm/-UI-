import type { Service } from '@/api/services'

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
