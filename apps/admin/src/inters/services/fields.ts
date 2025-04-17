import * as z from 'zod'

export type ServiceField = z.infer<typeof zServiceField>
export const zServiceField = z.interface({
  id: z.number().default(0),
  serviceId: z.number().default(0),
  name: z.string().default(''),
  width: z.number(),
  sortNum: z.number().default(0),
  status: z.boolean().default(false),
})
