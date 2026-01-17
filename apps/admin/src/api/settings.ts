import type { ConfigItem, SettingItem } from "@/inters/settings"
import http from "@/utils/http"

// Settings
type SettingListFn = () => Promise<SettingItem[]>
export const getSettings: SettingListFn = async () => {
  return (await http.get('/settings')).data
}

type SettingUpdateFn = (settings: Partial<SettingItem>[]) => Promise<void>
export const updateSetting: SettingUpdateFn = async (settings) => {
  return (await http.put('/settings', settings)).data
}

// Configs
type ConfigListFn = () => Promise<ConfigItem[]>
export const getConfigs: ConfigListFn = async () => {
  return (await http.get('/config')).data
}

type ConfigUpdateFn = (configs: Partial<ConfigItem>[]) => Promise<void>
export const updateConfig: ConfigUpdateFn = async (configs) => {
  return (await http.put('/config', configs)).data
}

// update note
type GetUpdateNote = () => Promise<SettingItem>
export const getUpdateNote: GetUpdateNote = async () => {
  return (await http.get<SettingItem>('/getAdminRemain')).data
}
