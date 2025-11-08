import type { FeiYangType, HKNewType, HuaQiangBeiType } from "./type"

export interface QUOTE_STORE_TYPE{
  /**水印 */
  watermark: string
  /**修改颜色索引 */
  colorIndex: number
  /**修改价格的索引 */
  updateIndex: number
  /**加载中动画开关 */
  loading: boolean
  /**报价单客服二维码弹窗 QuoteFeature.vue文件当中 */
  IsCustomer: boolean 
  /**报检单图片的弹窗*/
  IsImageDialog: boolean 
  /**报检单价格调整图片的弹窗*/
  IsUpdateImageDialog: boolean 
  /**报检单图片的弹窗*/
  ImageDialogID: number 
  /**底部选择的页面, 默认是首页 */
  pageShow: string
  /**搜索页面的抽屉开关 */
  OpenSearch: boolean
  /**详情页tab栏的索引 */
  activeTab: number
  /**华强北返回值*/
  HuaQiangBeiData: HuaQiangBeiType[]
  /**飞扬返回值*/
  FeiYangData: FeiYangType[]
  /**香港新机返回值 */
  HongKongNewData: HKNewType[],
  /**香港三星返回值类型 */
  SanSungData: HKNewType[],
  /**个性化华强北返回值*/
  UpdateHuaQiangBeiData: HuaQiangBeiType[]
  /**个性化飞扬返回值*/
  UpdateFeiYangData: FeiYangType[]
    /**香港新机返回值 */
  UpdateHongKongNewData: HKNewType[],
  /**香港三星返回值类型 */
  UpdateSanSungData: HKNewType[],
  /**详情页筛选的选中数据 */
  selectedTypes: string[]
  selectedSizes: string[]
  selectedStatuses: number[]
  selectedColors: number[]
  selectedAppearances: number[]
}

type QuoteStoreKey = InjectionKey<QUOTE_STORE_TYPE>

export const QUOTE_STORE: QuoteStoreKey = Symbol('quote_store')