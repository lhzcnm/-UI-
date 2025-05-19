import type { WithId } from '@3un/shared'
import * as z from 'zod'

export const zUserService = z.interface({
  id: z.number().default(0),
  packageId: z.number().default(0),
  userId: z.number().default(0),
  price: z.number().default(0),
  // updateAt: z.string().default(''),
  // updateBy: z.number().default(0),
})

export type UserService = z.infer<typeof zUserService>

// Form
export const zUserServiceForm = zUserService.omit({ id: true })

// Create & Update
export type UserServiceCreateParams = z.infer<typeof zUserServiceForm>
export type UserServiceUpdateParams = WithId<UserServiceCreateParams, 'id'>
