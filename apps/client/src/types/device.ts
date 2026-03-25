// Datasets
export interface ProductDataset {
  [key: string]: string | ProductItem | ProductItem[]
}
export interface SaleRegionDataset {
  [key: string]: string[]
}

export interface ProductItem {
  [key: string]: string
  Name: string
  Chip: string
}
export interface SaleRegion {
  chinese: string
  english: string
}

// GET info
export interface DeviceResponse {
  DeviceID   : number
  Version    : string
  Memory     : DeviceMemory
  ICloud     : DeviceICloud
  DeviceInfo : DeviceBaseInfo
}

// GET battery
export interface BatteryResponse {
  InstantAmperage       : number
  Temperature           : number
  Voltage               : number
  IsCharging            : boolean
  CurrentCapacity       : number
  DesignCapacity        : number
  NominalChargeCapacity : number
  CycleCount            : number
  AtCriticalLevel       : boolean
  AtWarnLevel           : boolean
}

// Device Map Item
export interface DeviceMapItem {
  deviceId: number
  info    : DeviceBaseInfo
  icloud  : DeviceICloud
  memory  : DeviceMemory
  battery : BatteryResponse
  product : DeviceProduct
  summary : DeviceSummary
  // cache   : DeviceCacheStatus
}

export interface DeviceSummary {
  UniqueDeviceID  : string
  Ecid            : string
  Imei            : string
  SerialNumber    : string
  ModelNumber     : string
  RegionInfo      : string
  MLBSerialNumber : string
  ProductType     : string
  ProductVersion  : string
  BuildVersion    : string
  WiFiAddress     : string
  CPU             : string
  iCloud          : string
  SalesRegion     : SaleRegion
  ActivationState : string
  // ActivationLock  : string
  // NetworkLock     : string
  // Warranty        : string
}

export interface DeviceCacheStatus {
  hasNetworkLock: boolean
  hasActivationLock: boolean
  hasWarranty: boolean

  showNetworkLock: boolean
  showActivationLock: boolean
  showWarranty: boolean
}

export interface DeviceProduct {
  Name        : string
  Chip        : string
  Color       : string
  ModelNumber : string
}

export interface DeviceBaseInfo {
  ActivationState: string
  ActivationStateAcknowledged: boolean
  BasebandActivationTicketVersion: string
  BasebandCertID: number
  BasebandChipID: number
  BasebandKeyHashInformation: {
    AKeyStatus: number
    SKeyHash: string
    SKeyStatus: number
  }
  BasebandMasterKeyHash: string
  BasebandRegionSKU: string
  BasebandSerialNumber: string
  BasebandStatus: string
  BasebandVersion: string
  BluetoothAddress: string
  BoardID: number
  BrickState: boolean
  BuildVersion: string
  CPUArchitecture: string
  CarrierBundleInfoArray: []
  CertID: number
  ChipID: number
  ChipSerialNo: string
  DeviceClass: string
  DeviceColor: string
  DeviceName: string
  DieID: number
  EthernetAddress: string
  FirmwareVersion: string
  FusingStatus: number
  HardwareModel: string
  HardwarePlatform: string
  HasSiDP: boolean
  HostAttached: boolean
  InternationalMobileEquipmentIdentity: string
  InternationalMobileEquipmentIdentity2: string
  MLBSerialNumber: string
  MobileEquipmentIdentifier: string
  MobileSubscriberCountryCode: string
  MobileSubscriberNetworkCode: string
  ModelNumber: string
  NonVolatileRAM: {
    AutoBoot: string
    BacklightLevel: string
    BootArgs: string
    Bootdelay: null
    ComAppleSystemTz0Size: string
    OblitBegins: string
    Obliteration: string
  },
  PartitionType: string
  PasswordProtected: boolean
  PkHash: string
  ProductName: string
  ProductType: string
  ProductVersion: string
  ProductionSOC: boolean
  ProtocolVersion: string
  ProximitySensorCalibration: string
  RegionInfo: string
  SBLockdownEverRegisteredKey: boolean
  SIMStatus: string
  SIMTrayStatus: string
  SerialNumber: string
  SoftwareBehavior: string
  SoftwareBundleVersion: string
  SupportedDeviceFamilies: number[]
  TelephonyCapability: boolean
  TimeIntervalSince1970: number
  TimeZone: string
  TimeZoneOffsetFromUTC: number
  TrustedHostAttached: boolean
  UniqueChipID: number
  UniqueDeviceID: string
  UseRaptorCerts: boolean
  Uses24HourClock: boolean
  WiFiAddress: string
  WirelessBoardSerialNumber: string
  KCTPostponementInfoPRIVersion: string
  KCTPostponementInfoPRLName: number
  KCTPostponementInfoServiceProvisioningState: boolean
  KCTPostponementStatus: string
  Ecid: string
}

export interface DeviceMemory {
  AmountDataAvailable: number
  AmountDataReserved: number
  AmountRestoreAvailable: number
  TotalDataAvailable: number
  TotalDataCapacity: number
  TotalDiskCapacity: number
  TotalSystemCapacity: number
}

export interface DeviceICloud {
  CloudBackupEnabled: boolean
  LastCloudBackupTZ: string
  LastiTunesBackupDate: number
  LastiTunesBackupTZ: string
}

export interface DeviceCache {
  networkLockCode: string
  activationLockCode: string
  warrantyCode: string
}

export interface DeviceRecoveryData {
  BDID: string      // Board ID (主板标识符，例如 0x04)
  CPFM: string      // CPU Fuse Matrix (CPU 熔丝矩阵状态)
  CPID: string      // Chip ID (芯片型号标识，0x7000 代表 Apple A8 芯片)
  CPRV: string      // Chip Revision (芯片版本)
  ECID: string      // Exclusive Chip ID (唯一的芯片识别码)
  IBFL: string      // IBoot Flags (引导加载程序标志位)
  IMEI: string      // International Mobile Equipment Identity
  MODE: string      // 当前模式 (例如: Recovery)
  MODEL: string     // 设备内部代号 (例如: n56ap)
  NAME: string      // 设备市场名称 (例如: iPhone 6 Plus)
  NONC: string      // ApNonce (用于验证刷机包签名的随机值)
  PRODUCT: string   // 产品型号标识 (例如: iPhone7,1)
  SCEP: string      // Secure Enclave Processor (安全隔区处理器版本)
  SNON: string      // SEP Nonce (安全隔区的随机值)
  SRNM: string      // Serial Number (设备序列号)
  SRTG: string      // SRTG (通常与恢复环境相关的标识)
}

// 对应 DeviceRecoveryData 的前端展示的数据类型
export interface DeviceRecoveryMapItem {
  name: string        // NAME
  type: string        // product
  serialNo: string    // SRNM
  ecid: string        // ECID
  chip: string        // CPID
  mode: string        // MODE
}
