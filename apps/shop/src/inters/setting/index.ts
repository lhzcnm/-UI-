import z from 'zod/v4'

export const zSettiing = z.object({
  // 网站信息
  title: z.string().default(''),
  titleEn: z.string().default(''),
  company: z.string().default(''),
  phone: z.string().default(''),
  address: z.string().default(''),
  beian: z.string().default(''),
  email: z.string().default(''),

  // 商城
  mallWarmReminderEN: z.string().default(''),
  mallWarmReminderZH: z.string().default(''),
})

export type Setting = z.infer<typeof zSettiing>
