export interface ServiceParams {
  serverId?: number,
  groupId?: number,
  serverName?: string,
}

export interface ServiceItem {
  id: number,
  imeiType: number,
  isHot: boolean,
  isNew: boolean,
  isUnlock: false,
  mustRead: string,
  parentId: number,
  price: number,
  storePrice: string,
  taken: string,
  title: string,
}

export interface ServiceGroup {
  id: number,
  title: string,
}

export interface ServiceDetail extends ServiceGroup {
  children: ServiceItem[],
}

export interface GroupOption {
  id: number,
  title: string,
}

export interface ServiceOption {
  serviceId: number,
  name: string,
}

export interface SubmitParams {
  serviceId: string,
  groupId: number,
  imeiList: string[],
  isBulk: boolean,
}

export interface StorePayParams {
  id: string,
  amount: number,
  type: string,
}
