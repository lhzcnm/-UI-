import type { ConfigOption } from '@jweixin/index'
import type { R } from '@3un/shared'

export interface WxApi {
  accessToken(code: string): R<string>
  config(url: string): R<ConfigOption>
  invite(openId: string): R<string>
  scanCode(params: ScanCodeParams): R<string>
  submit(params: WxSubmitParams): R<string>
}

export interface ScanCodeParams {
  openId: string
  code: string
}

export interface WxSubmitParams {
  serviceId: number
  mediaId: string
}
