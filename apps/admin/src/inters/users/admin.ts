import type { WithId } from '@3un/shared'
import { z } from 'zod/v4'

export const zAdminForm = z.object({
  userName: z.string().default(''),
  nickName: z.string().nullable().default(null),
  userPassword: z.string().default(''),
  weiXinOpenid: z.string().nullable().default(null),
  comments: z.string().nullable().default(null),
  disableUser: z.boolean().default(false),
})

export type AdminForm = z.infer<typeof zAdminForm>

export type AdminCreateParams = z.infer<typeof zAdminForm>
export type AdminUpdateParams = WithId<AdminForm, 'userId'>
