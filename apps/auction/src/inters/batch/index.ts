import { PRICE_TYPE } from '@3un/utils'
import type { IPage, IList } from '@3un/shared'
import z from 'zod'

export const zBatchItem = z.object({
  id: z.number(),
  createTime: z.string(),
})

export const zBatchPriceUpdate = z.object({
  type: z.nativeEnum(PRICE_TYPE).default(PRICE_TYPE.ADD),
  price: z.number().default(0.00),
})

export const zBatchProduct = z.object({
  id: z.number(),
  sku: z.string(),
  description: z.string(),
  grade: z.string().nullable(),
  qty: z.number().nullable(),
  time: z.string(),
  offer: z.number().nullable(),
})

export const zBatchHistory = z.object({
  batchId: z.number().default(0),
  createTime: z.string().default(''),
  products: z.array(zBatchProduct).default([]),
  summary: z.object({
    count: z.number().default(0),
  }).default({count: 0})
})

export const zBatchSearch = z.object({
  description: z.string().optional(),
  batchId: z.number().optional(),
})

export type BatchItem = z.infer<typeof zBatchItem>
export type BatchPriceUpdate = z.infer<typeof zBatchPriceUpdate>
export type BatchHistory = z.infer<typeof zBatchHistory>
export type batchSearch = z.infer<typeof zBatchSearch>
export type BatchProduct = z.infer<typeof zBatchProduct>

export type BatchRecord = IList<BatchHistory>
export type BatchSearchParams = IPage & batchSearch
