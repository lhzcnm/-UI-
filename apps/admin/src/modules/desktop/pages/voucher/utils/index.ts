import type { VoucherCreateForm, VoucherList } from '@/inters/voucher'
import type { IK } from '@3un/shared'

export interface VoucherStore {
  visibleCreate: boolean,
  visibleUpdate: boolean,
  refresh: boolean,
  page: number,
  limit: number,
  vouchers: VoucherList,
  createForm: VoucherCreateForm,
}

export const VOUCHER_STORE: IK<VoucherStore> = Symbol('voucher')
