/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_MODE: string
  readonly VITE_API_URL: string
  readonly VITE_APP_ADMIN: string
  
  // storage key
  readonly VITE_ACCESS_TOKEN: string
  readonly VITE_ADMIN_TOKEN: string
}

declare module '@logo' {
  import type { DefineComponent } from "vue"
  const component: DefineComponent<{}, {}, any>
  export default component
}
