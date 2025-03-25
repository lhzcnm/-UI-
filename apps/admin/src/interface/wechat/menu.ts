export enum WxMenuType {
  CLICK = 'click',
  VIEW = 'view',
  SCANCODE_PUSH = 'scancode_push',
  SCANCODE_WAITMSG = 'scancode_waitmsg',
  PIC_SYSPHOTO = 'pic_sysphoto',
  PIC_PHOTO_OR_ALBUM = 'pic_photo_or_album',
  PIC_WEIXIN = 'pic_weixin',
  LOCATION_SELECT = 'location_select',
}

export type WxMenu = {
  id: number
  parentId: number
  type: WxMenuType
  name: string
  key: string
  sort: number
  disabled: boolean
}
