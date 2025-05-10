// {
//   "DeviceName": "iPhone",
//   "DeviceColor": "#e4e7e8",
//   "DeviceClass": "iPhone",
//   "ProductVersion": "14.4.2",
//   "ProductType": "iPhone 6s",
//   "ProductName": "iPhone OS",
//   "ModelNumber": "MKRX2",
//   "SerialNumber": "F4GQWNEYGRY8",
//   "SIMStatus": "kCTSIMSupportSIMStatusNotInserted",
//   "CPUArchitecture": "arm64",
//   "ProtocolVersion": "2",
//   "RegionInfo": "LL/A",
//   "TelephonyCapability": true,
//   "TimeZone": "Asia/Shanghai",
//   "UniqueDeviceID": "485dc68a17797f7080f07642d16c85b9e9a39130",
//   "WiFiAddress": "b4:8b:19:78:ea:1e",
//   "WirelessBoardSerialNumber": "FA1BA4D0AE37",
//   "BluetoothAddress": "b4:8b:19:78:ea:1f",
//   "BuildVersion": "18D70",
//   "ActivationState": "Activated",
//   "HardwareModel": "N71mAP",
//   "InternationalMobileEquipmentIdentity": "355697070274075",
//   "BatteryCurrentCapacity": 94,
//   "BatteryIsCharging": true,
//   "AmountDataAvailable": 321785856,
//   "AmountDataReserved": 209715200,
//   "AmountRestoreAvailable": 7011246080,
//   "TotalDataAvailable": 703242240,
//   "TotalDataCapacity": 9499238400,
//   "TotalDiskCapacity": 16000000000,
//   "TotalSystemCapacity": 6479745024
// }

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
