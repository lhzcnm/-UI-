export interface StatParams {
  serviceId?: number
  startTime?: string
  endTime?: string
}

export interface StatOrder {
  awaiting: number
  failure: number
  processing: number
  success: number
  orderTime: string
  total: number
}

export interface StatService {
  awaitOrder: number
  failOrder: number
  orderCount: number
  orderTime: string
  packageId: string | null
  processingOrder: number
  successOrder: number
}
