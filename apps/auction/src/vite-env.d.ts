/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ACCESS_TOKEN: string
  readonly VITE_GUEST_TOKEN: string
}

interface ImportMeta {
  env: ImportMetaEnv
}
