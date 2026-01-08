import { z } from "zod/v4";
import { zVoucherCreate } from "."
import { ACTIVITY_BONUS } from "@3un/utils";

export const zActivyVoucherForm = zVoucherCreate.extend({
  paymentId: z.number().default(0),
  userId: z.number().default(0),
  creditsUsageType: z.enum(ACTIVITY_BONUS).default(ACTIVITY_BONUS.QUERY),
})

export type ActivityVoucherCreate = z.infer<typeof zActivyVoucherForm>
