// GET /info
export interface DeviceResponse {
  DeviceID: number
  DeviceInfo: DeviceInfo
  ICloud: ICloudInfo
  Memory: MemoryInfo
}

export interface DeviceInfo {
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

export interface MemoryInfo {
  AmountDataAvailable: number
  AmountDataReserved: number
  AmountRestoreAvailable: number
  TotalDataAvailable: number
  TotalDataCapacity: number
  TotalDiskCapacity: number
  TotalSystemCapacity: number
}

export interface ICloudInfo {
  CloudBackupEnabled: boolean
  LastCloudBackupTZ: string
  LastiTunesBackupDate: number
  LastiTunesBackupTZ: string
}

// GET /battery
export interface BatteryInfo {
  InstantAmperage: number
  Temperature: number
  Voltage: number
  IsCharging: boolean
  CurrentCapacity: number
  DesignCapacity: number
  NominalChargeCapacity: number
  CycleCount: number
  AtCriticalLevel: boolean
  AtWarnLevel: boolean
}

// store
export interface Device {
  DeviceID: number
  icloud: ICloudInfo
  info: DeviceInfo
  memory: MemoryInfo
  battery: BatteryInfo
  product: ProductItem
  form: DeviceForm
  cache: {
    hasNetworkLock: boolean
    hasActivationLock: boolean
    hasWarranty: boolean

    showNetworkLock: boolean
    showActivationLock: boolean
    showWarranty: boolean
  }
}
export interface DeviceForm {
  Imei: string
  SerialNumber: string
  ModelNumber: string
  RegionInfo: string
  MLBSerialNumber: string
  ProductType: string
  ProductVersion: string
  BuildVersion: string
  Ecid: string
  UniqueDeviceID: string
  WiFiAddress: string
  ActivationState: string
  NetworkLock: string
  ActivationLock: string
  Warranty: string
  SalesRegion: SalesRegion
  iCloud: string
  CPU: string
}
export interface ProductItem {
  Name: string
  Chip: string
  Color: string
  ModelNumber: string
}

// ios datasets
export interface ProductData {
  [key: string]: string | ProductInfo | ProductInfo[]
}
export interface ProductInfo {
  [key: string]: string
  Name: string
  Chip: string
}

// sales region
export interface SalesRegion {
  chinese: string
  english: string
}
