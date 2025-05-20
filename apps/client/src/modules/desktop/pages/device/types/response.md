## GET /info

```json
{
  "DeviceID": 65,
  "DeviceName": "sanhe的iPhone",
  "DeviceColor": "#e4e7e8",
  "DeviceClass": "iPhone",
  "ProductVersion": "14.4.2",
  "ProductType": "iPhone 6s",
  "ProductName": "iPhone OS",
  "ModelNumber": "MKRX2",
  "SerialNumber": "F4GQWNEYGRY8",
  "SIMStatus": "kCTSIMSupportSIMStatusNotInserted",
  "CPUArchitecture": "arm64",
  "ProtocolVersion": "2",
  "RegionInfo": "LL/A",
  "TelephonyCapability": true,
  "TimeZone": "Asia/Shanghai",
  "UniqueDeviceID": "485dc68a17797f7080f07642d16c85b9e9a39130",
  "WiFiAddress": "b4:8b:19:78:ea:1e",
  "WirelessBoardSerialNumber": "FA1BA4D0AE37",
  "BluetoothAddress": "b4:8b:19:78:ea:1f",
  "BuildVersion": "18D70",
  "ActivationState": "Activated",
  "HardwareModel": "N71mAP",
  "InternationalMobileEquipmentIdentity": "355697070274075",
  "InternationalMobileEquipmentIdentity2": "355697070274075",
  "BatteryCurrentCapacity": 100,
  "BatteryIsCharging": true,
  "AmountDataAvailable": 1059500032,
  "AmountDataReserved": 209715200,
  "AmountRestoreAvailable": 7748960256,
  "TotalDataAvailable": 1440956416,
  "TotalDataCapacity": 9499238400,
  "TotalDiskCapacity": 16000000000,
  "TotalSystemCapacity": 6479745024,
  "UniqueChipID": 8528367184505894,
  "CloudBackupEnabled": false,
  "LastCloudBackupTZ": "GMT+8",
  "LastiTunesBackupDate": 768820089,
  "LastiTunesBackupTZ": "GMT+8",
  "Version": "2.0",
  "WillEncrypt": false,
  "Bookmarks": {
    "AccountNames": [],
    "Sources": []
  },
  "Calendars": {
    "AccountNames": [],
    "Sources": []
  },
  "Contacts": {
    "AccountNames": [],
    "Sources": []
  },
  "Notes": {
    "AccountNames": [],
    "Sources": []
  }
}
```

```text
TotalDiskCapacity (16 GB)
├── TotalSystemCapacity (~6.03 GB)      → 系统用
├── TotalDataCapacity (~9.44 GB)        → 用于数据存储
│   ├── AmountDataReserved (~200 MB)
│   └── AmountDataAvailable (~306 MB)
└── AmountRestoreAvailable (~6.53 GB)   → 可能是额外预留恢复区
```

## GET /battery

```json
{
  "code": 200,
  "data": null,
  "msg": {
    "CycleCount": "610",
    "DesignCapacity": "1690",
    "FullChargeCapacity": "100"
  }
}
```
