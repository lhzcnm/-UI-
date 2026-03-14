/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_NAME_EN: string
  readonly VITE_APP_MODE: string

  readonly VITE_API_URL: string

  readonly VITE_ACCESS_TOKEN: string
  readonly VITE_GUEST_TOKEN: string
}

interface ImportMeta {
  env: ImportMetaEnv
}
