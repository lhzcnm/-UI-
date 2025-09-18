

export interface ServiceItem {
  serviceId: number,
  name: string,
  desc: string,
}

export interface ServiceGroup {
  id: number,
  title: string,
  children: ServiceItem[]
}

export interface GroupOption {
  id: number,
  title: string,
}

export interface ServiceOption {
  serviceId: number,
  name: string,
}
