import type { IList, IPage } from '@3un/shared'
import { USER_ROLE } from '@3un/utils'
import * as z from 'zod'

export const zLog = z.interface({
  id: z.number().default(0),
  userId: z.number().default(0),
  loginTime: z.string().default(''),
  logoutTime: z.string().nullable(),
  ip: z.string().default(''),
  region: z.string().nullable(),
})

export type Log = z.infer<typeof zLog>

// Search
export const zLogSearchForm = z.interface({
  ip: z.string().optional(),
  userId: z.number().optional(),
  role: z.enum(USER_ROLE).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})

export type LogSearchForm = z.infer<typeof zLogSearchForm>

// List
export type LogList = IList<Log>
export interface LogListParams extends IPage, LogSearchForm {}
