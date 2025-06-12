import type { WithId } from '@3un/shared'
import { VERIFY_MSG } from '@/utils'
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

export const zWechatMenuItemForm = z.object({
  parentId: z.number().default(0),
  name: z.string().min(1, VERIFY_MSG.REQ_MENU_NAME).default(''),
  type: z.string().min(1, VERIFY_MSG.REQ_MENU_TYPE).default(''),
  key: z.string().min(1, VERIFY_MSG.REQ_MENU_KEY).default(''),
  orderBy: z.number().default(0),
  menuDisable: z.boolean().default(false),
})

// Create & Update
export type WechatMenuCreateParams = z.infer<typeof zWechatMenuItemForm>
export type WechatMenuUpdateParams = WithId<WechatMenuCreateParams, 'id'>
