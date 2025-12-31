import { z } from "zod/v4";
import { zVoucherCreate } from "."

export const zActivyVoucherForm = zVoucherCreate.extend({
  paymentId: z.number().default(0),
  userId: z.number().default(0),
})

export type ActivityVoucherCreate = z.infer<typeof zActivyVoucherForm>
