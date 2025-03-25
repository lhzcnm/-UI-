/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_MODE: string
  readonly VITE_API_URL: string
  
  // storage key
  readonly VITE_TOKEN: string
  readonly VITE_PLANS: string
  readonly VITE_SERVICE_ITEM: string
  readonly VITE_SERVICE_GROUP: string
}
