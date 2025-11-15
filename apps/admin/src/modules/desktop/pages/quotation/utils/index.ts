import type { IK } from '@3un/shared'

import { zQuotationSearch } from '@/inters/quotation'
import { createFeiyang, createHqb, deleteFeiyang, deleteHqb, getFeiyang, getHqb, updateFeiyang, updateHqb } from '@/api/quotation'
import { zFeiyang, zFeiyangForm, zFeiyangList, zFeiyangUpdate } from '@/inters/quotation/feiyang'
import type { z } from 'zod/v4'
import { zHqb, zHqbCreate, zHqbList, zHqbUpdate } from '@/inters/quotation/hqb'
import type { XTableColumn } from '@3un/ui'
import { columnsFeiyang } from './columnsFeiyang'
import { columnsHqb } from './columnsHqb'

export interface QuotationStore<T extends QuotationMap> {
  visibleBase: boolean,
  visibleSearch: boolean,
  visibleEdit: boolean,
  refresh: boolean,

  page: number,
  limit: number,
  keyword: string,
  id: number | undefined,

  category: T,
  quotations?: QuotationListResult<T>
}

export const QUOTATION_STORE: IK<QuotationStore<QuotationMap>> = Symbol('quotation')

export enum QuotationMap {
  FEIYANG = 0,
  HK      = 1,
  // HQB     = 2,
}

export interface QuotationMapItem {
  get: Function,
  create: Function,
  update: Function,
  delete: Function,
  columns: XTableColumn[],
}

type QuotationMapType = Record<QuotationMap, QuotationMapItem>

export const QUOTATION_MAP_ITEM: QuotationMapType = {
  [QuotationMap.FEIYANG]: { get: getFeiyang, create: createFeiyang, update: updateFeiyang, delete: deleteFeiyang, columns: columnsFeiyang, },
  [QuotationMap.HK]: { get: getHqb, create: createHqb, update: updateHqb, delete: deleteHqb, columns: columnsHqb },
}

export const QUOTATION_MAP_LIST = [
  { value: QuotationMap.FEIYANG, label: '飞扬报价单' },
  { value: QuotationMap.HK, label: '香港报价单' },
]

export const QUOTATION_SCHEMA_MAP = {
  [QuotationMap.FEIYANG]: {
    item: zFeiyang,
    list: zFeiyangList,
    create: zFeiyangForm,
    update: zFeiyangUpdate,
    search: zQuotationSearch,
  },
  [QuotationMap.HK]: {
    item: zHqb,
    list: zHqbList,
    create: zHqbCreate,
    update: zHqbUpdate,
    search: zQuotationSearch,
  },
}

type QuotationSchemaMap = typeof QUOTATION_SCHEMA_MAP

export type QuotationListResult<T extends QuotationMap> = z.infer<QuotationSchemaMap[T]['list']>
export type QuotationSearchParams<T extends QuotationMap> = z.infer<QuotationSchemaMap[T]['search']>
export type QuotationCreateForm<T extends QuotationMap> = z.infer<QuotationSchemaMap[T]['create']>
export type QuotationUpdateForm<T extends QuotationMap> = z.infer<QuotationSchemaMap[T]['update']>
export type QuotationItem<T extends QuotationMap> = z.infer<QuotationSchemaMap[T]['item']>
