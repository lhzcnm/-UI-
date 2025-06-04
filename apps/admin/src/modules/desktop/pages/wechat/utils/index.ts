import type { CustomMsg, CustomMsgCreateParams, BuiltInMessage, WechatMenuCreateParams, WechatTreeMenus } from "@/inters/wechat"
import type { IK } from "@3un/shared"

export * from './MsgColumn'

export const MSG_STORE: IK<MsgStore> = Symbol('msg')
export const MENU_STORE: IK<MenuStore> = Symbol('menu')

export interface MsgStore {
  msgList: CustomMsg[]
  builtInList: BuiltInMessage[]
  formBase: CustomMsgCreateParams
  formBuiltIn: BuiltInMessage
  visibleBase: boolean
  visibleBuiltIn: boolean
  index: number | undefined
}

export interface MenuStore {
  menus: WechatTreeMenus[]
  index: number | undefined
  formBase: WechatMenuCreateParams
  visibleBase: boolean
}
