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
}

// GET /battery
export interface BatteryInfo {
  CycleCount: string
  DesignCapacity: string
  FullChargeCapacity: string
}
