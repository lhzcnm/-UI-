import z from 'zod/v4'

export const zGrade = z.object({
  id: z.number(),
  name: z.string(),
})

export type Grade = z.infer<typeof zGrade>
