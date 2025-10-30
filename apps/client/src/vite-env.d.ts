/// <reference types="vite/client" />

interface ImportMetaEnv {
  // App
  readonly VITE_APP_NAME: string
  readonly VITE_APP_NAME_EN: string
  readonly VITE_APP_MODE: string
  readonly VITE_APP_DEVICE: string

  // Api
  readonly VITE_API_URL: string
  readonly VITE_WS_URL: string

  // Storage
  readonly VITE_ACCESS_TOKEN: string
  readonly VITE_GUEST_TOKEN: string
  readonly VITE_RECENT_SERVICES: string
  readonly VITE_USER_INFO: string
  readonly VITE_SERVICES: string
  readonly VITE_SETTINGS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
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
