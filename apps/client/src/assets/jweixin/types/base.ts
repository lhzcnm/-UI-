const JS_API_LIST = [
  'updateAppMessageShareData',
  'updateTimelineShareData',
  'onMenuShareTimeline',
  'onMenuShareAppMessage',
  'onMenuShareQQ',
  'onMenuShareWeibo',
  'onMenuShareQZone',
  'startRecord',
  'stopRecord',
  'onVoiceRecordEnd',
  'playVoice',
  'pauseVoice',
  'stopVoice',
  'onVoicePlayEnd',
  'uploadVoice',
  'downloadVoice',
  'chooseImage',
  'previewImage',
  'uploadImage',
  'downloadImage',
  'getLocalImgData',
  'translateVoice',
  'getNetworkType',
  'openLocation',
  'getLocation',
  'hideOptionMenu',
  'showOptionMenu',
  'hideMenuItems',
  'showMenuItems',
  'hideAllNonBaseMenuItem',
  'showAllNonBaseMenuItem',
  'closeWindow',
  'scanQRCode',
  'chooseWXPay',
  'openProductSpecificView',
  'addCard',
  'chooseCard',
  'openCard',
] as const

export const OPEN_TAG_LIST = [
  'wx-open-launch-weapp',
  'wx-open-launch-app',
  'wx-open-subscribe',
  'wx-open-audio',
] as const

export type JSAPIList = typeof JS_API_LIST[number]
export type OpenTagList = typeof OPEN_TAG_LIST[number]

export interface ConfigOption {
  /**
   * 开启调试模式
   */
  debug?: boolean

  /**
   * 公众号的唯一标识
   */
  appId: string

  /**
   * 生成签名的时间戳
   */
  timestamp: string

  /**
   * 生成签名的随机串
   */
  nonceStr: string

  /**
   * 签名
   */
  signature: string

  /**
   * 需要使用的JS API 列表
   */
  jsApiList: JSAPIList[]

  /**
   * 需要使用的开放标签列表
   */
  openTagList?: OpenTagList[]
}
