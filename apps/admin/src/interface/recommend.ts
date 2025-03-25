export type Recommend = {
  id: number
  serviceId: number
  name: string
  keyword: string
  convertCode: ConvertCode[]
}

export type ConvertCode = {
  key: string
  value: string
}
