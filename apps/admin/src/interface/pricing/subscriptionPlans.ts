import type { PricingData } from '.'

export type SubscriptionPlan = {
  id: number
  userId: number
  pricingPlanId: number
  metadata: PricingData[]
  startTime: string
  endTime: string
  createdTime: string
  updatedTime: string
}
