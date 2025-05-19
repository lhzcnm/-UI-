import * as z from 'zod'

export const zUserExtraInfo = z.interface({
  imageUrl: z.string().nullable().default(null),
  // 总的充值金额
  totalCredit: z.string().default(''),
  // 总的锁定金额
  lockedCredit: z.string().default(''),
  // 管理员添加的未付金额
  unpaidCredit: z.string().default(''),
  // 总的消费金额
  consumeCredit: z.string().default(''),
  // 总的订单数量
  totalCode: z.number().default(0),
  // 成功的订单数量
  successCode: z.number().default(0),
})

export type UserExtraInfo = z.infer<typeof zUserExtraInfo>
