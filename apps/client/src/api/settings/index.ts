import type { SettingApi } from './types'
import http from '@/utils/http'

export * from './types'

export const settingApi: SettingApi = {
  get: () => http.get('settings'),
}
