import type { CustomMsg, CustomMsgCreateParams, BuiltInMessage, WechatMenuCreateParams, WechatTreeMenus } from "@/inters/wechat"
import type { IK } from "@3un/shared"

export * from './columnMsg'

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
  currentId: number | undefined
  parentIdx: number | undefined
  formMenu: WechatMenuCreateParams
  formBase: WechatMenuCreateParams
  visibleBase: boolean
  visibleMenu: boolean
}

export const MENU_TYPES = [
  { value: 'click', label: '点击事件', description: '用户点击后推送事件给开发者', icon: 'lucide:mouse-pointer-click' },
  { value: 'view', label: '跳转链接', description: '用户点击后直接跳转到指定网页', icon: 'lucide:external-link' },
  { value: 'scancode_push', label: '扫码推送', description: '弹出扫一扫，用户扫码后推送事件', icon: 'lucide:qr-code' },
  { value: 'scancode_waitmsg', label: '扫码等待', description: '弹出扫一扫，用户扫码后等待消息', icon: 'lucide:scan' },
  { value: 'pic_sysphoto', label: '系统拍照', description: '弹出系统拍照发图', icon: 'lucide:camera' },
  { value: 'pic_photo_or_album', label: '拍照或相册', description: '弹出拍照或者相册发图', icon: 'lucide:image' },
  { value: 'pic_weixin', label: '微信相册', description: '弹出微信相册发图器', icon: 'lucide:images' },
  { value: 'location_select', label: '地理位置', description: '弹出地理位置选择器', icon: 'lucide:map-pin' },
]

export const MENU_TYPE_MAP = new Map(MENU_TYPES.map(item => [item.value, item]))
