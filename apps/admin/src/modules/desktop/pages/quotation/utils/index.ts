import type { IK } from '@3un/shared'
import type { RemarkCreate, RemarkList, RemarkSearchForm } from '@/inters/quotation/remark'
import { QUOTATION_MAP } from '@/utils/quotation'
import { zQuotationSearch, type ApiEnum } from '@/inters/quotation'
import { zFeiyang, zFeiyangForm, zFeiyangList, zFeiyangUpdate } from '@/inters/quotation/feiyang'
import z from 'zod/v4'

import { zHqb, zHqbForm, zHqbList, zHqbUpdate } from '@/inters/quotation/hqb'
import { zHk, zHkForm, zHkList, zHkUpdate } from '@/inters/quotation/hk'
import { createFeiyang, createHk, createHqb, deleteFeiyang, deleteHk, deleteHqb, getFeiyang, getHk, getHqb, updateFeiyang, updateHk, updateHqb } from '@/api/quotation'

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

interface QuotationMapItem {
  get: Function,
  create: Function,
  update: Function,
  delete: Function,
}

type QuotationMapType = Record<QUOTATION_MAP, QuotationMapItem>

export const QUOTATION_MAP_ITEM: QuotationMapType = {
  [QUOTATION_MAP.FEIYANG]: { get: getFeiyang, create: createFeiyang, update: updateFeiyang, delete: deleteFeiyang, },
  [QUOTATION_MAP.HQB]: { get: getHqb, create: createHqb, update: updateHqb, delete: deleteHqb, },
  [QUOTATION_MAP.HK]: { get: getHk, create: createHk, update: updateHk, delete: deleteHk, },
}

export const QUOTATION_MAP_LIST = [
  { value: QUOTATION_MAP.FEIYANG, label: '飞扬报价单' },
  { value: QUOTATION_MAP.HQB, label: '华强北报价单' },
  { value: QUOTATION_MAP.HK, label: '香港报价单' },
]


export const QUOTATION_SCHEMA_MAP = {
  [QUOTATION_MAP.FEIYANG]: {
    item: zFeiyang,
    form: zFeiyangForm,
    list: zFeiyangList,
    create: zFeiyangForm,
    update: zFeiyangUpdate,
    search: zQuotationSearch,
  },
  [QUOTATION_MAP.HQB]: {
    item: zHqb,
    form: zHqbForm,
    list: zHqbList,
    create: zHqbForm,
    update: zHqbUpdate,
    search: zQuotationSearch,
  },
  [QUOTATION_MAP.HK]: {
    item: zHk,
    form: zHkForm,
    list: zHkList,
    create: zHkForm,
    update: zHkUpdate,
    search: zQuotationSearch,
  },
}

type QuotationSchemaMap = typeof QUOTATION_SCHEMA_MAP

export type QuotationListResult<T extends QUOTATION_MAP> = z.infer<QuotationSchemaMap[T]['list']>
export type QuotationSearchParams<T extends QUOTATION_MAP> = z.infer<QuotationSchemaMap[T]['search']>
export type QuotationCreateForm<T extends QUOTATION_MAP> = z.infer<QuotationSchemaMap[T]['create']>
export type QuotationUpdateForm<T extends QUOTATION_MAP> = z.infer<QuotationSchemaMap[T]['update']>
export type QuotationItem<T extends QUOTATION_MAP> = z.infer<QuotationSchemaMap[T]['item']>
