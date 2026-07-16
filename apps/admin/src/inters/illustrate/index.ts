import z from 'zod/v4'


export const zIllustrate = z.object({
  id: z.number(),
  serviceCode: z.string().default(''),
  description: z.string().nullable(),
  serviceDesc: z.string().default(''),
  createTime: z.string().default(''),
  updateTime: z.string().default(''),
})

export const zIllustrateUploadImageitem = z.object({
  file: z.file(),
  sort: z.number(),
})

export const zIllustrateForm = z.object({
  serviceCode: z.string().default(''),
  description: z.string().default(''),
  serviceDesc: z.string().default(''),
  images: z.array(zIllustrateUploadImageitem).default([]),
})

export const zGetIllustrateImagesParams = z.object({
  serviceCode: z.string().default(''),
})

export const zIllustrateImageItem = z.object({
  id: z.number(),
  sort: z.number(),
  imageUrl: z.string(),
})

export type IllustrateItem = z.infer<typeof zIllustrate>
export type IllustrateCreate = z.infer<typeof zIllustrateForm>
export type GetIllustrateImagesParams = z.infer<typeof zGetIllustrateImagesParams>
export type IllustrateImageItem = z.infer<typeof zIllustrateImageItem>
