import type { User, UserCreateParams, UserExtraInfo, UserSearchForm } from '@/inters/users'
import type { IK, IList } from '@3un/shared'

export interface UsersStore {
  users: IList<User>
  extraInfo: UserExtraInfo
  formBase: UserCreateParams
  formSearch: UserSearchForm
  visibleBase: boolean
  visibleSearch: boolean
  index: number | undefined
  refresh: boolean
  page: number
  limit: number
}

export const USER_STORE: IK<UsersStore> = Symbol('users')
