export interface RangeStatParams {
  serviceId?: number
  startTime?: string
  endTime?: string
}

export interface OrderStatItem {
  total: number
  failure: number
  success: number
  dataTime: string
}
