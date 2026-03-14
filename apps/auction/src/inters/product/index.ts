import z from 'zod/v4'

import { SCOPE_TYPE } from '@3un/utils'
import type { IList, WithId } from '@3un/shared'

import { type IPage } from '../page'

export const zProduct = z.object({
  id: z.number(),
  sku: z.string().default(''),
  model: z.string().default(''),
  capacity: z.string().default('').nullable(),
  // lockStatus: z.enum(LOCK_STATUS).optional(),
  lockStatus: z.string(),
  colorName: z.string().default('').nullable(),
  grade: z.string().default(''),
  time: z.string().default(''),
  price: z.string().nullable(),
  scopeType: z.enum(SCOPE_TYPE),
  updatedAt: z.string().default(''),
})

export const zProductSearch = z.object({
  model: z.string().default(''),
  colorName: z.string('').default(''),
  // lockStatus: z.enum(LOCK_STATUS).optional(),
  lockStatus: z.string().default(''),
  capacity: z.string().default(''),
  grade: z.string().default(''),
})

export const zProductCreate = z.object({
  sku: z.string().default(''),
  model: z.string().default(''),
  color: z.string().default('').nullable(),
  capacity: z.string().default('').nullable(),
  grade: z.string().default(''),
  price: z.string(),
  // lockStatus: z.enum(LOCK_STATUS).default(LOCK_STATUS.NONE),
  lockStatus: z.string(),
  scopeType: z.enum(SCOPE_TYPE).default(SCOPE_TYPE.ALL),
})

export const zBatchFields = z.object({
  sku: z.string().default('SKU'),
  grade: z.string().default('Grade'),
  description: z.string().default('Description'),
  quantity: z.string().default('QTY'),
  offer: z.string().default('Offer'),
})

export const zProductImport = zBatchFields.extend({
  file: z.file().default(new File([], '')),
})

export const zProductExport = zBatchFields.extend({
  batchId: z.number(),
})

export const zExcelUpdate = z.object({
  id: z.number(),
  batchId: z.number(),
  price: z.number(),
})

export type Product = z.infer<typeof zProduct>
// export type ProductHistory = z.infer<typeof zProductHistory>
export type ProductSearch = z.infer<typeof zProductSearch>
export type ProductCreate = z.infer<typeof zProductCreate>
export type BatchFields = z.infer<typeof zBatchFields>
export type ProductImport = z.infer<typeof zProductImport>
export type ProductExport = z.infer<typeof zProductExport>
export type ExcelUpdate = z.infer<typeof zExcelUpdate>

export type BatchUpdateRecord = WithId<ProductImport, 'batchId'>
export type ProductRecords = IList<Product>
export type ProductUpdate = WithId<ProductCreate, 'id'>
export type UpdateImport = WithId<ProductImport, 'batchId'>
export type ProductSearchParams = IPage & ProductSearch
