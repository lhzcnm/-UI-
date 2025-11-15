import { z } from "zod/v4"

export const zList = <T extends z.ZodType>(schema: T) => z.object({
  list: z.array(schema),
  page: z.number(),
  total: z.number(),
  pageSize: z.number(),
})

export const zPage = z.object({
  page: z.number(),
  pageSize: z.number(),
})

export type IList<T> = z.infer<ReturnType<typeof zList<z.ZodType<T>>>>
