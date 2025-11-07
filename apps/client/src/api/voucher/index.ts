import http from "@/utils/http"
import type { VoucherApi } from "./types"

export * from "./types"

export const voucherApi: VoucherApi = {
  decrypt: (params) => http.get('/voucher/decrypt', { params })
}