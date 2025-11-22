import { IMEI_TYPE } from "@3un/utils"
import z from "zod/v4"

export const zService = z.object({
  id: z.number(),
  imeiType: z.enum(IMEI_TYPE),
  isHot: z.boolean(),
  isNew: z.boolean(),
  isUnlock: z.boolean(),
  mustRead: z.string().nullable(),
  parentId: z.number(),
  price: z.number(),
  storePrice: z.string(),
  taken: z.string(),
  title: z.string(),
})

export const zServiceDetail = z.object({
  id: z.number(),
  title: z.string(),
  children: z.array(zService),
})

export const zServiceParams = z.object({
  serverId: z.number().optional(),
  groupId: z.number().optional(),
  serverName: z.string().optional(),
})

export type Service = z.infer<typeof zService>
export type ServiceDetail = z.infer<typeof zServiceDetail>
export type ServiceParams = z.infer<typeof zServiceParams>
