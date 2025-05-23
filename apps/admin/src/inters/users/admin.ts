import type { WithId } from '@3un/shared'
import * as z from 'zod'

export const zAdminForm = z.interface({
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
