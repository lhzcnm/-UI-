import * as z from 'zod'

export type ServiceGroup = z.infer<typeof zServiceGroup>
export const zServiceGroup = z.interface({
  categoryId: z.number().default(0),
  category: z.string().default(''),
  categoryLocal: z.string().default(''),
  disableCategory: z.number().transform(v => !!v),
  orderBy: z.number().default(0),

  // ⬇️ 废弃字段
  // htmlTitle: z.string().default(''),
  // metaKw: z.string().default(''),
  // metaTags: z.string().default(''),
  // seoUrlName: z.string().default(''),
})
