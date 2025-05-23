import type { LevelCreateParams } from '@/inters/level'
import type { AdminCreateParams, User, UserCreateParams, UserExtraInfo, UserPointForm, UserSearchForm } from '@/inters/users'
import type { IK, IList } from '@3un/shared'

// User
export interface UsersStore {
  users: IList<User>
  extraInfo: UserExtraInfo
  formBase: UserCreateParams
  formSearch: UserSearchForm
  formPoint: UserPointForm
  visibleBase: boolean
  visibleSearch: boolean
  visiblePoint: boolean
  index: number | undefined
  refresh: boolean
  page: number
  limit: number
}

// Level
export interface LevelStore {
  formBase: LevelCreateParams
  visibleBase: boolean
  index: number | undefined
}

// Admin
export interface AdminStore {
  admins: User[]
  formBase: AdminCreateParams
  visibleBase: boolean
  index: number | undefined
}

// Store
export const USER_STORE: IK<UsersStore> = Symbol('users')
export const LEVEL_STORE: IK<LevelStore> = Symbol('levels')
export const ADMIN_STORE: IK<AdminStore> = Symbol('admins')
