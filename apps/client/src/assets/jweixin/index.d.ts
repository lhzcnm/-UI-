declare global {
  interface GlobalEventHandlersEventMap {
    /**
     * 微信开放标签错误事件
     * 
     * 在满足微信或系统最低版本要求，但仍无法使用微信开放标签的场景下，  
     * 当 `wx.config` 权限验证成功后，将触发 `WeixinOpenTagsError` 事件以通知开发者。  
     * 注意：仅微信开放标签不可用，JS-SDK 其他功能不受影响。
     */
    WeixinOpenTagsError: CustomEvent<{ errMsg?: string }>;
  
    /**
     * 小程序 `web-view` 组件中，JS-SDK 初始化完成时触发的回调事件。  
     * 
     * @see [web-view 文档](https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html)  
     */
    WeixinJSBridgeReady: void;
  }
  
  interface Window {
    wx: WX
    jWeixin: WX
  
    __wxjs_environment?: 'miniprogram'
    WeixinJSBridge?: WeixinJSBridge
  }
}

interface WeixinJSBridge {
  invoke: (
    e: string,
    config: WXInvokeConfig,
    callback: (respose: WXCallbackResponse) => void
  ) => void

  log: (e: any) => void
  call: (...args: any[]) => void
  on: (e: any, t: Function) => void
}

interface WXInvokeConfig {
  appId: string
  timeStamp: string
  nonceStr: string
  package: string
  signType: string
  paySign: string
  packageValue?: string
}

type WXInvokeMsgType =
  // 微信支付
  | 'get_brand_wcpay_request:ok'
  | 'get_brand_wcpay_request:cancel'
  | 'get_brand_wcpay_request:fail'

type WXCallbackResponse = {
  err_msg: WXInvokeMsgType
}

import type { ConfigOption } from './types/base'
import type { ChooseImageOption, UploadImageOption, ScanQRCodeOption, GetLocalImgDataOption } from './types/image'

export * from './types/base'
export * from './types/image'

export interface WX {
  /**
   * 配置 JS-SDK 权限验证
   * @param options 配置参数
   * @see [文档](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#4)
   */
  config(options: ConfigOption): void

  ready(callback: () => void): void
  error(callback: () => void): void

  // Image interface
  chooseImage(options: ChooseImageOption): void
  uploadImage(options: UploadImageOption): void
  scanQRCode(options: ScanQRCodeOption): void
  getLocalImgData(options: GetLocalImgDataOption): void
  closeWindow(): void
}
