import type { BatchPriceUpdate } from '@/inters/batch'
import type { ProductImport, ProductRecords, ProductSearch } from '@/inters/product'
import type { InjectionKey } from 'vue'

export interface HomeStore {
  visibleSearch: boolean,
  visibleBatchUpdatePrice: boolean,
  visibleImport: boolean,

  importType: 'database' | 'excel',

  formSearch: ProductSearch,
  formBatchUpdate: BatchPriceUpdate,
  formImport: ProductImport,

  products: ProductRecords,

  page: number,
  pageSize: number,
  refresh: boolean,
}

export const HOME_STORE: InjectionKey<HomeStore> = Symbol('home-store')
