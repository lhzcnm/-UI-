export type PricingPlan = {
  id: number
  name: string
  description: string | null
  price: number
  duration: number
  metadate: PricingData[]
  createdTime: string
  updatedTime: string
}

export type PricingData = {
  serviceId: number
  count: number
}
