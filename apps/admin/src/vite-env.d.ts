/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_MODE: string
  readonly VITE_API_URL: string
  
  // storage key
  readonly VITE_ACCESS_TOKEN: string
}
