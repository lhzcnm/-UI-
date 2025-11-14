import type { WxApi } from './types'
import http from '@/utils/http'

export * from './types'

export const wxApi: WxApi = {
  accessToken: (code) => http.get(`wx/login/${code}`),
  config: (url) => http.get(`wx/config?url=${url}`),
  invite: (openId) => http.get(`wx/invite/${openId}`),
  ocr: (data) => http.postForm(`wx/ocr`, data, { timeout: 15000 }),
  scanCode: (params) => http.post('wx/scan-code', params),
  submit: (params) => http.post('wx/submit', params),
}
