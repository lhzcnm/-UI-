import z from 'zod/v4'

export const zIllustrate = z.object({
  serviceCode: z.string().default(''),
  serviceDesc: z.string().default(''),
})

export type IllustrateItem = z.infer<typeof zIllustrate>
