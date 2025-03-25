export enum UserRole {
  USER        = 1,
  ADMIN       = 2,
  SUPER_ADMIN = 3,
}

export type User = {
  id: number
  levelId: number
  username: string
  account: string
  password: string
  credits: number
  phone: string
  email: string
  avatar: string
  role: UserRole
  openId: string
  inviteCode: string
  inviteBy: number
  apiKey: string | null
  bulkKey: string | null
  ipApi: string | null
  ipLogin: string | null
  allowApi: boolean
  allowNegativeCredits: boolean
  allowPushMsg: boolean
  remark: string | null
  disabled: boolean
  createdTime: string
  updatedTime: string
}
