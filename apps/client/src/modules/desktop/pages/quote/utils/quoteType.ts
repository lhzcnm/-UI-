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
  modelId?: number
  add?: number
  reduce?: number
  iPhoneModel?: string[]
}

//2.远望新机接口参数类型
export interface PriceFilter{
  modelId?: number
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
  id: number
  iphoneModel: string
  phoneStatusList: phoneStatusListType[]
}

//远望新机报价单返回值的类型
interface newPhoneStatus{
  status: string
  price: number[]
}

interface phoneStatusList{
  big: string
  phoneStatus: newPhoneStatus[]
}

export interface newPhoneFilter{
  id: number
  iphoneModel: string
  phoneStatusList: phoneStatusList[]
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

//远望新机报价单图表返回值类型
interface colorsType{
  color: string
  solid:number
  official: number
}

interface storageType{
  big:string
  colors: colorsType[]
}

interface typesType{
  originalUnsealed: string
  storage: storageType[]
}

interface modelType{
  model: string
  remark: string
  types: typesType[]
}

export interface PhoneSeriesNew{
  type: number
  models: modelType[]
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