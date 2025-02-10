import type { SettingApiCollection } from '@3un/shared/settings'
import http from '@/utils/http'

const settingApi: SettingApiCollection = {
  get: () => http.get('settings'),
}

export default settingApi
