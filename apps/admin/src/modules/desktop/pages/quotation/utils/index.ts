import type { IK, IList } from '@3un/shared'
import type { QUOTATION_TYPE } from '@3un/utils'

import type { Quotation, QuotationFormSearch } from '@/inters/quotation'

export interface OldQuotationStore {
  page: number,
  limit: number,

  formSearch: QuotationFormSearch,

  quotations: IList<Quotation>,

  category: QUOTATION_TYPE,
}

export const OLD_QUOTATION_STORE: IK<OldQuotationStore> = Symbol('old-quotation')
