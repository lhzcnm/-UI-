import type { R } from '@3un/shared'

export interface VoucherApi {
  decrypt(params: DecryptParams): R<any>,
}

export interface DecryptParams {
  code: string
}
