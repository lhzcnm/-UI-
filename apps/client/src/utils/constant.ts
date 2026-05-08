export type LanuageItem = "zh" | "en"

interface LanuageMapItem {
  zh: string
  en: string
}

type LanuageMap = Record<string, LanuageMapItem>

const customLanuageMap: LanuageMap = {
  unknown: {
    zh: "未知",
    en: "Unknown",
  },
  unknown_color: {
    zh: "未知颜色",
    en: "Unknown Color",
  },
  device_icloud_enable: {
    zh: "已开启",
    en: "Enabled",
  },
  device_icloud_disable: {
    zh: "未开启",
    en: "Not Enabled",
  },
  section_device_overview: {
    zh: "设备概览",
    en: "Device Overview",
  },
  section_identity: {
    zh: "身份信息",
    en: "Identity",
  },
  section_hardware: {
    zh: "硬件信息",
    en: "Hardware",
  },
  section_storage_memory: {
    zh: "存储与内存",
    en: "Storage & Memory",
  },
  section_battery: {
    zh: "电池",
    en: "Battery",
  },
  device_snapshot: {
    zh: "设备快照",
    en: "Device Snapshot",
  },
  device_name: {
    zh: "设备名",
    en: "Device Name",
  },
  device_product_type: {
    zh: "产品类型",
    en: "Product Type",
  },
  device_model_number: {
    zh: "型号号码",
    en: "Model Number",
  },
  device_color: {
    zh: "颜色",
    en: "Color",
  },
  device_chip: {
    zh: "芯片",
    en: "Chip",
  },
  device_region: {
    zh: "地区",
    en: "Region",
  },
  device_sales_region: {
    zh: "销售地区",
    en: "Sales Region",
  },
  device_activation_state: {
    zh: "激活状态",
    en: "Activation State",
  },
  device_identity_board_no: {
    zh: "主板序号",
    en: "Board No",
  },
  device_identity_wifi: {
    zh: "Wi-Fi 地址",
    en: "Wi-Fi Address",
  },
  device_identity_cpu: {
    zh: "CPU",
    en: "CPU",
  },
  device_identity_build_version: {
    zh: "版本号",
    en: "Build Version",
  },
  device_identity_product_version: {
    zh: "系统版本",
    en: "Product Version",
  },
  device_hardware_model: {
    zh: "硬件型号",
    en: "Hardware Model",
  },
  device_hardware_platform: {
    zh: "硬件平台",
    en: "Hardware Platform",
  },
  device_firmware_version: {
    zh: "固件版本",
    en: "Firmware Version",
  },
  device_baseband_version: {
    zh: "基带版本",
    en: "Baseband Version",
  },
  device_bluetooth_address: {
    zh: "蓝牙地址",
    en: "Bluetooth Address",
  },
  device_ethernet_address: {
    zh: "以太网地址",
    en: "Ethernet Address",
  },
  device_hardware_chip_id: {
    zh: "芯片 ID",
    en: "Chip ID",
  },
  device_hardware_board_id: {
    zh: "主板 ID",
    en: "Board ID",
  },
  device_hardware_board_no: {
    zh: "主板序号",
    en: "Board No",
  },
  device_disk_total: {
    zh: "总磁盘容量",
    en: "Total Disk Capacity",
  },
  device_system_total: {
    zh: "系统总容量",
    en: "Total System Capacity",
  },
  device_data_total: {
    zh: "数据总容量",
    en: "Total Data Capacity",
  },
  device_data_available: {
    zh: "可用数据容量",
    en: "Total Data Available",
  },
  device_amount_data_available: {
    zh: "可用空间",
    en: "Amount Data Available",
  },
  device_amount_data_reserved: {
    zh: "保留数据容量",
    en: "Amount Data Reserved",
  },
  device_amount_restore_available: {
    zh: "可恢复容量",
    en: "Amount Restore Available",
  },
  device_battery_current_capacity: {
    zh: "当前电量",
    en: "Current Capacity",
  },
  device_battery_design_capacity: {
    zh: "设计容量",
    en: "Design Capacity",
  },
  device_battery_nominal_capacity: {
    zh: "标称容量",
    en: "Nominal Charge Capacity",
  },
  device_battery_cycle_count: {
    zh: "循环次数",
    en: "Cycle Count",
  },
  device_battery_voltage: {
    zh: "电压",
    en: "Voltage",
  },
  device_battery_temperature: {
    zh: "温度",
    en: "Temperature",
  },
  device_battery_is_charging: {
    zh: "充电中",
    en: "Is Charging",
  },
  device_battery_critical_level: {
    zh: "临界电量",
    en: "Critical Level",
  },
  device_battery_warn_level: {
    zh: "警告电量",
    en: "Warn Level",
  },
  device_state_activate: {
    zh: "已激活",
    en: "Activated",
  },
  device_state_unactivate: {
    zh: "未激活",
    en: "UnActivated"
  },
  preview: {
    zh: "预览",
    en: "Preview"
  },
  theme: {
    zh: "明暗切换",
    en: "Theme"
  },
  refresh: {
    zh: "刷新",
    en: "Refresh",
  },
  instructions: {
    zh: "说明",
    en: "Instructions",
  },
  funtion_tools: {
    zh: "操作组",
    en: "Actions"
  }
}

export function getLanuagestring(key: string, lang: LanuageItem) {
  const entry = customLanuageMap[key]
  if (!entry) return key
  return entry[lang] ?? entry.zh ?? key
}
