import z from 'zod/v4'
import { zOrder } from '.'
import type { IList } from '@3un/shared'
import { REFUND_STATUS } from '@3un/utils'

export const zMallOrder = zOrder.extend({
  paymentId: z.string(),
  storePrice: z.number(),
  refundStatus: z.union([z.literal(0), z.enum(REFUND_STATUS)])
    .transform((val) => (val === 0 ? REFUND_STATUS.WAIT : val)),
})

// export const zMallSearchForm = 

export const zMallOrderRefund = zMallOrder.pick({
  paymentId: true,
  codeId: true,
}).extend({
  refundAmount: z.number(),
})

export const zMallRefundResp = z.object({
  message: z.string(),
  success: z.boolean(),
})

export type MallOrder = z.infer<typeof zMallOrder>
export type MallOrderRefundParams = z.infer<typeof zMallOrderRefund>
export type MallOrderRefundResp = z.infer<typeof zMallRefundResp>

export type MallOrderList = IList<MallOrder>
