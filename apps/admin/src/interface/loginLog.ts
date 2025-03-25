import { UserRole } from './users'

export type LoginLog = {
  id: number
  userId: number
  role: UserRole
  ip: string
  region: string
  deviceInfo: string
  loginTime: string
  logoutTime: string | null
}
