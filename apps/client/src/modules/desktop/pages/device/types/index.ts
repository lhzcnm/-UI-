// GET /info
export interface DeviceInfo {
  DeviceName: string
  DeviceColor: string
  DeviceClass: string
  ProductVersion: string
  ProductType: string
  ProductName: string
  ModelNumber: string
  SerialNumber: string
  SIMStatus: string
  CPUArchitecture: string
  ProtocolVersion: string
  RegionInfo: string
  TelephonyCapability: boolean
  TimeZone: string
  UniqueDeviceID: string
  WiFiAddress: string
  WirelessBoardSerialNumber: string
  BluetoothAddress: string
  BuildVersion: string
  ActivationState: string
  HardwareModel: string
  InternationalMobileEquipmentIdentity: string
  BatteryCurrentCapacity: number
  BatteryIsCharging: boolean
  AmountDataAvailable: number
  AmountDataReserved: number
  AmountRestoreAvailable: number
  TotalDataAvailable: number
  TotalDataCapacity: number
  TotalDiskCapacity: number
  TotalSystemCapacity: number
  UniqueChipID: number
  CloudBackupEnabled: boolean
  LastCloudBackupTZ: string
  LastiTunesBackupDate: number
  LastiTunesBackupTZ: string
  Version: string
  WillEncrypt: boolean
  Bookmarks: {
    AccountNames: string[]
    Sources: string[]
  }
  Calendars: {
    AccountNames: string[]
    Sources: string[]
  }
  Contacts: {
    AccountNames: string[]
    Sources: string[]
  }
  Notes: {
    AccountNames: string[]
    Sources: string[]
  }
}

// GET /battery
export interface BatteryInfo {
  CycleCount: string
  DesignCapacity: string
  FullChargeCapacity: string
}
