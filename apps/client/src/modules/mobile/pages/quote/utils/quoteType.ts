//热门型号接口返回值相关类型
export interface priceType{
  big: string
  new: number
  beautifel: number
  smallFlower:number
  largeFlower: number
  theImplosionIsMeasurable: number
  intact:number
  unpacking: number
}

export interface HotModelType{
  id:number
  name: string
  price: priceType[]
}

//报价单筛选
//1.接口参数类型
export interface priceFilter{
  type: number
  modleId?: number
  add?: number
  reduce?: number
  iPhoneModel?: string[]
}

//2.报价单返回值的类型
interface phoneStatusType{
  status: string
  price: number
}

interface phoneStatusListType{
  big: string
  phoneStatus: phoneStatusType[]
}

export interface quoteFilterDataType{
  id:number
  iphoneModel: string
  phoneStatusList: phoneStatusListType[]
}

//生成报价单的图表返回值类型
interface Price {
  big: string
  values: Record<string, number | string | undefined>
}

interface Model {
  name: string
  prices: Price[]
  remark?: string
}

export interface PhoneSeries {
  type: string
  columns: string[]
  models: Model[]
}

//报价单颜色的类型
export interface ColorItem {
  name: string
  class: string
}

// 报价单搜索
export interface searchParamsType{
  big: string
  model: string
  status: string
}

export interface searchTypeData{
  bigs: string[]
  models: string[]
  statuses: string[]
}