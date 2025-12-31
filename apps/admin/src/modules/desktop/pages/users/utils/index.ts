import type { AdminCreateParams, User, UserCreateParams, UserExtraInfo, UserPaidList, UserPaidSearchForm, UserPointForm, UserSearchForm, UserService, UserServiceCreateParams } from '@/inters/users'
import type { LevelCreateParams, LevelService, LevelServiceCreateParams } from '@/inters/level'
import type { IK, IList } from '@3un/shared'

// User
export interface UsersStore {
  users: IList<User>
  services: UserService[]
  extraInfo: UserExtraInfo

  formBase: UserCreateParams
  formSearch: UserSearchForm
  formPoint: UserPointForm
  formService: UserServiceCreateParams

  visibleBase: boolean
  visibleSearch: boolean
  visiblePoint: boolean
  visibleService: boolean
  visibleDetail: boolean
  visibleVoucherPoint: boolean

  refresh: boolean
  index: number | undefined
  page: number
  limit: number
}

// Paid
export interface PaidStore {
  users: UserPaidList
  formSearch: UserPaidSearchForm
  visibleSearch: boolean
  refresh: boolean
  page: number
  limit: number
}

// Level
export interface LevelStore {
  services: LevelService[]
  formBase: LevelCreateParams
  formService: LevelServiceCreateParams
  visibleBase: boolean
  visibleService: boolean
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
export const PAID_STORE: IK<PaidStore> = Symbol('paid')
export const LEVEL_STORE: IK<LevelStore> = Symbol('levels')
export const ADMIN_STORE: IK<AdminStore> = Symbol('admins')
