import type { LoginMode } from '@/modules/auth/types'
import type { IK } from '@3un/shared'

export interface AuthStore {
  mode: LoginMode,
  data: string,
}

export const AUTH_STORE: IK<AuthStore> = Symbol('auth')
