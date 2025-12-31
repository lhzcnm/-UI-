import type { IK } from '@3un/shared'
import type { RemarkCreate, RemarkList, RemarkSearchForm } from '@/inters/quotation/remark'
import type { QUOTATION_MAP } from '@/utils/quotation'
import type { ApiEnum } from '@/inters/quotation'

export interface QuotationStore<T extends QUOTATION_MAP> {
  visibleBase: boolean,
  visibleSearch: boolean,
  visibleEdit: boolean,
  refresh: boolean,

  page: number,
  limit: number,
  keyword: string,
  id: number | undefined,

  category: T,
  formBase: any,

  appearances: ApiEnum[],
  colors: ApiEnum[],
  deviceStatuses: ApiEnum[],
  deviceTypes: ApiEnum[],
  brands: ApiEnum[],
  brandsMap: Map<number, string>,
}

export interface RemarkStore {
  visibleBase: boolean,
  refresh: boolean,

  searchForm: RemarkSearchForm,
  formBase: RemarkCreate,
  remarks: RemarkList,

  id: number | undefined,
  brands: ApiEnum[],
  brandsMap: Map<number, string>,
}

export const QUOTATION_STORE: IK<QuotationStore<QUOTATION_MAP>> = Symbol('quotation')
export const REMARK_STORE: IK<RemarkStore> = Symbol('remark')
