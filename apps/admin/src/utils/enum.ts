export enum OSS_UPLOAD_ENUM {
  PLUGIN_WIN = 43,
  PLUGIN_MAC_ARM = 44,
  PLUGIN_MAC_AMD = 45,

  DESKTOP_WIN = 46,
  DESKTOP_MAC_ARM = 47,
  DESKTOP_MAC_AMD = 48
}

export const OSS_UPLOAD_TYPE_LIST = [
  { value: OSS_UPLOAD_ENUM.PLUGIN_WIN, label: '插件 windows' },
  { value: OSS_UPLOAD_ENUM.PLUGIN_MAC_ARM, label: '插件 mac arm' },
  { value: OSS_UPLOAD_ENUM.PLUGIN_MAC_AMD, label: '插件 mac x86' },
  { value: OSS_UPLOAD_ENUM.DESKTOP_WIN, label: '桌面端 windows' },
  { value: OSS_UPLOAD_ENUM.DESKTOP_MAC_ARM, label: '桌面端 mac arm' },
  { value: OSS_UPLOAD_ENUM.DESKTOP_MAC_AMD, label: '桌面端 mac x86' },
]
