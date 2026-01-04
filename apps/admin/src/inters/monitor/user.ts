import type { IList, IPage, WithId } from "@3un/shared"
import { z } from "zod/v4"

export const zMonitorUser = z.object({
  id: z.number(),
  username: z.string(),
  password: z.string(),
})

export const zMonitorUserSearch = z.object({
  id: z.number().optional(),
  username: z.string().default(""),
})

export const zMonitorUserForm = z.object({
  username: z.string().default(""),
  password: z.string().default(""),
})

export type MonitorUser = z.infer<typeof zMonitorUser>
export type MonitorUserSearch = z.infer<typeof zMonitorUserSearch>
export type MonitorUserCreate = z.infer<typeof zMonitorUserForm>

export type MonitorUserList = IList<MonitorUser>
export type MonitorUserSearchForm = IPage & MonitorUserSearch
export type MonitorUserUpdate = WithId<MonitorUserCreate, "id">
