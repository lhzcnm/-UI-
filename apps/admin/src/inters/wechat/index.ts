import type { WithId } from '@3un/shared'
import { z } from 'zod/v4'

export * from './message'

export const zWechatMenu = z.object({
  id: z.number().default(0),
  parentId: z.number().default(0),
  type: z.string().default(''),
  name: z.string().default(''),
  key: z.string().default(''),
  orderBy: z.number().default(0),
  menuDisable: z.boolean().default(false),
})

export type WechatMenu = z.infer<typeof zWechatMenu>
export interface WechatTreeMenus extends WechatMenu {
  children: WechatMenu[]
}

// Form
export const zWechatMenuForm = zWechatMenu.omit({ id: true })

// Create & Update
export type WechatMenuCreateParams = z.infer<typeof zWechatMenuForm>
export type WechatMenuUpdateParams = WithId<WechatMenuCreateParams, 'id'>
