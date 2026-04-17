import type { IPage } from "@3un/shared"
import { z } from "zod/v4"
import type { IList } from "../common"

export const zMonitorServer = z.object({
  serverId: z.number(),
  serverIp: z.string(),
  serverName: z.string(),
  domainId: z.number(),
  domain: z.string(),
  domainName: z.string(),
})

export const zMonitorSearch = z.object({
  serverIp: z.string().default("").optional(),
  serverName: z.string().default("").optional(),
  domain: z.string().default("").optional(),
  domainName: z.string().default("").optional(),
})

export const zMonitorForm = z.object({
  serverIp: z.string().default(""),
  serverName: z.string().default(""),
  domain: z.string().default(""),
  domainName: z.string().default(""),
})

export const zMonitorUpdate = zMonitorForm.extend({
  serverId: z.number(),
  domainId: z.number(),
})

export type MonitorServer = z.infer<typeof zMonitorServer>
export type MonitorServerSearch = z.infer<typeof zMonitorSearch>
export type MonitorServerForm = z.infer<typeof zMonitorForm>
export type MonitorServerUpdate = z.infer<typeof zMonitorUpdate>

export type MonitorServerSearchForm = IPage & MonitorServerSearch
export type MonitorServerList = IList<MonitorServer>
