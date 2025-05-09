export interface DeviceInfo {
  model: string;
  capacity: string;
  serialNumber: string;
  jailbreakStatus: string;
  boardNumber: string;
  imei: string;
  ecid: string;
  osVersion: string;
  screenManufacturer: string;
  udid: string;
  modelNumber: string;
  activationStatus: string;
  icloud: string;
  warranty: string;
  wifi: string;
  cpu: string;
  crashAnalysis: string;
  batteryHealth: string;
  cycleCount: string;
}

export type TabType = 'basic' | 'hardware' | 'screen' | 'face' | 'other'; 