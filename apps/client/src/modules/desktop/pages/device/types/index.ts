// GET /info
export interface DeviceInfo {
  DeviceID: number
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
  MLBSerialNumber: string
  BluetoothAddress: string
  BuildVersion: string
  ActivationState: string
  HardwareModel: string
  InternationalMobileEquipmentIdentity: string
  InternationalMobileEquipmentIdentity2: string
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
  Bookmarks: ICloudData
  Calendars: ICloudData
  Contacts: ICloudData
  Notes: ICloudData
}
interface ICloudData {
  AccountNames: string[]
  Sources: string[]
}

// GET /battery
export interface BatteryInfo {
  BatterySerialNumber: string
  DesignCapacity: number
  MaxCapacity: number
  CycleCount: number
  NominalChargeCapacity: number
  FullAvailableCapacity: number
  AbsoluteCapacity: number
}

export interface DeviceForm {
  Imei: string
  SerialNumber: string
  ModelNumber: string
  RegionInfo: string
  MLBSerialNumber: string
  ProductVersion: string
  BuildVersion: string
  UniqueChipID: string
  UniqueDeviceID: string
  
  ActivationState: string
  NetworkLock: string
  ActivationLock: string
  Warranty: string
  iCloud: string
  CPU: string
}

export interface ProductData {
  [key: string]: string | Product | Product[]
}

export interface Product {
  Name: string
  Chip: string
  [key: string]: string
}
