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

export interface TodoCountItem {
  ticket    : number
  awaiting  : number
  verifying : number
  processing: number
}
