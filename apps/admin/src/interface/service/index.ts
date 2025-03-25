export enum ImeiType {
  IMEI     = 1,
  SN       = 2,
  IMEI_SN  = 3,
  ON_CHECK = 4,
}

export type Service = {
  id: number
  groupId: number
  name: string
  nameEn: string
  nameSimplified: string
  timeTaken: string
  timeTakenEn: string
  mustRead: string | null
  mustReadEn: string | null
  price: number
  imeiType: ImeiType
  apiId: number
  externalNetworkId: string | null
  allowDuplicate: boolean
  allowPushMsg: boolean
  isNew: boolean
  isHot: boolean
  isUnlock: boolean
  sort: number
  disabled: boolean
}
