import { zVoucher, type VoucherList, type VoucherListForm, type VoucherCreateForm, type VoucherUpdateForm } from '@/inters/voucher'
import http from '@/utils/http'

type VoucherListFn = (params: VoucherListForm) => Promise<VoucherList>
export const getVouchers: VoucherListFn = async (params) => {
  const { data } = await http.get<VoucherList>('/voucher/list', { params })
  return { ...data, list: data.list.map(item => zVoucher.parse(item)) }
}

type VoucherCreateFn = (body: VoucherCreateForm) => Promise<void>
export const createVoucher: VoucherCreateFn = async (body) => {
  await http.post('/voucher/generate', body)
}

type VoucherInvalidFn = (body: VoucherUpdateForm) => Promise<void>
export const invalidCode: VoucherInvalidFn = async (body) => {
  await http.post<void>('/voucher/invalid', body)
}
