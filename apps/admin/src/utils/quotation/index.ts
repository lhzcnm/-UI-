import FeiyangDialog from '@/modules/desktop/pages/quotation/components/FeiyangDialog.vue'
import HqbDialog from '@/modules/desktop/pages/quotation/components/HqbDialog.vue'
import HkDialog from '@/modules/desktop/pages/quotation/components/HkDialog.vue'

import { createFeiyang, createHk, createHqb, deleteFeiyang, deleteHk, deleteHqb, getFeiyang, getHk, getHqb, updateFeiyang, updateHk, updateHqb } from '@/api/quotation'
import { zQuotationSearch } from '@/inters/quotation'
import { zFeiyang, zFeiyangForm, zFeiyangList, zFeiyangUpdate } from '@/inters/quotation/feiyang'
import { columnsFeiyang } from '@/modules/desktop/pages/quotation/utils/columnsFeiyang'
import { columnsHk } from '@/modules/desktop/pages/quotation/utils/columnsHk'
import { columnsHqb } from '@/modules/desktop/pages/quotation/utils/columnsHqb'


import type { XTableColumn } from '@3un/ui'
import z from 'zod/v4'
import { zHqb, zHqbForm, zHqbList, zHqbUpdate } from '@/inters/quotation/hqb'
import { zHk, zHkForm, zHkList, zHkUpdate } from '@/inters/quotation/hk'

export enum QUOTATION_MAP {
  FEIYANG = 1,
  HQB      = 2,
  HK     = 3,
}

interface QuotationMapItem {
  get: Function,
  create: Function,
  update: Function,
  delete: Function,
  columns: XTableColumn[],
}

type QuotationMapType = Record<QUOTATION_MAP, QuotationMapItem>

export const QUOTATION_MAP_ITEM: QuotationMapType = {
  [QUOTATION_MAP.FEIYANG]: { get: getFeiyang, create: createFeiyang, update: updateFeiyang, delete: deleteFeiyang, columns: columnsFeiyang, },
  [QUOTATION_MAP.HQB]: { get: getHqb, create: createHqb, update: updateHqb, delete: deleteHqb, columns: columnsHqb },
  [QUOTATION_MAP.HK]: { get: getHk, create: createHk, update: updateHk, delete: deleteHk, columns: columnsHk },
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
    dialog: FeiyangDialog,
  },
  [QUOTATION_MAP.HQB]: {
    item: zHqb,
    form: zHqbForm,
    list: zHqbList,
    create: zHqbForm,
    update: zHqbUpdate,
    search: zQuotationSearch,
    dialog: HqbDialog,
  },
  [QUOTATION_MAP.HK]: {
    item: zHk,
    form: zHkForm,
    list: zHkList,
    create: zHkForm,
    update: zHkUpdate,
    search: zQuotationSearch,
    dialog: HkDialog,
  },
}

type QuotationSchemaMap = typeof QUOTATION_SCHEMA_MAP

export type QuotationListResult<T extends QUOTATION_MAP> = z.infer<QuotationSchemaMap[T]['list']>
export type QuotationSearchParams<T extends QUOTATION_MAP> = z.infer<QuotationSchemaMap[T]['search']>
export type QuotationCreateForm<T extends QUOTATION_MAP> = z.infer<QuotationSchemaMap[T]['create']>
export type QuotationUpdateForm<T extends QUOTATION_MAP> = z.infer<QuotationSchemaMap[T]['update']>
export type QuotationItem<T extends QUOTATION_MAP> = z.infer<QuotationSchemaMap[T]['item']>
