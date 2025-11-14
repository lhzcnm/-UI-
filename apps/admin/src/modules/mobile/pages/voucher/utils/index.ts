import type { VoucherCreateForm, VoucherList } from '@/inters/voucher'
import type { IK } from '@3un/shared'

export interface VoucherStore {
  visibleCreate: boolean,
  visibleUpdate: boolean,
  refresh: boolean,
  vouchers: VoucherList,
  createForm: VoucherCreateForm,
  page: number,
  limit: number,
}

export const VOUCHER_STORE: IK<VoucherStore> = Symbol('voucher')
