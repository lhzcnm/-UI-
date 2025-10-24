import type { HotModelType, PhoneSeries, quoteFilterDataType, searchParamsType, searchTypeData } from "./quoteType"

interface filterParams{
  type: number //报价单筛选的参数 (1,2,3,4)
  modleId?: number // 手机型号的id
  iPhoneModel: string[] //手机型号的数组
  add: number //上调的价格
  reduce: number //下调的价格
}

export interface quoteType{
  IsCustomer: boolean        //专属客服弹窗开关
  IsCreateQuote: boolean     //生成报价单抽屉开关
  IsImageDialog: boolean     //报价单图片的弹窗
  IsPopularModels: boolean   //热门型号弹窗开关
  IsTailoredModules: boolean //个性化型号弹窗开关
  IsTailored: boolean        //个性化抽屉开关
  IsSearchQuote: boolean     //搜索功能的抽屉开关

  isImageAdd: boolean,

  phoneStatusArr: string[]   //手机状态数组(美版卡贴等)

  hotModelType: HotModelType[]
  hotModel: HotModelType[]   //热门手机型号的数据

  quoteWatermark: string     //报价单水印
  quoteColorIndex: number    //报价单颜色的水印
  quoteImagePageBtnIsOpen: boolean       //翻页按钮是否显示
  quotationImageType: number
  quotationImageData: PhoneSeries []     //生成报价单图片的数据

  params: filterParams
  quoteFilterData: quoteFilterDataType[] //报价单筛选的数据
  quoteFilterDataName: quoteFilterDataType[]

  searchType: searchTypeData //搜索类型数据
  search: searchParamsType
  searchData:quoteFilterDataType[]
}

type QuoteStoreKey = InjectionKey<quoteType>

export const QUOTE_STORE: QuoteStoreKey = Symbol('quote-store')

