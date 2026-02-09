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
