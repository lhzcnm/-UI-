export type CreditHistory = {
  id: number
  userId: number
  orderId: number
  serviceId: number
  rechargeId: number
  description: string | null
  credits: number
  remainingCredits: number
  ip: string | null
  remark: string | null
  createdTime: string
  updatedTime: string
}
