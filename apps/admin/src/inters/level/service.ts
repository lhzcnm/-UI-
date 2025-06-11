import { z } from 'zod/v4'

export const zLevelService = z.object({
  id: z.number().default(0),
  planId: z.number().default(0),
  packageId: z.number().default(0),
  price: z.number().default(0),
  freeCount: z.number().default(0),
})

export type LevelService = z.infer<typeof zLevelService>

// Form
export const zLevelServiceForm = z.object({
  planId: z.number().default(0),
  packageId: z.number().optional(),
  price: z.number().optional(),
  freeCount: z.number().optional(),
})

// Create & Update
export type LevelServiceCreateParams = z.infer<typeof zLevelServiceForm>
export interface LevelServiceUpdateParams {
  id: number
  serviceId: number
  planId: number
  price: string | undefined
  freeCount: number | undefined
}
