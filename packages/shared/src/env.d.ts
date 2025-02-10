/// <reference types="vite/client" />

interface ImportMetaEnv {
  // App
  readonly VITE_APP_NAME: string
  readonly VITE_COMMON_LIST: string

  // Api url
  readonly VITE_API_URL: string
  readonly VITE_WS_URL: string

  // Storage keys
  readonly VITE_ACCESS_TOKEN: string
  readonly VITE_USER: string
  readonly VITE_SETTINGS: string
  readonly VITE_GROUPS: string
  readonly VITE_SERVICES: string
  readonly VITE_BATCH_SERVICES: string
  readonly VITE_RECENT_SERVICES: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
