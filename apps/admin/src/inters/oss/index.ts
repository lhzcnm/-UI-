import { OSS_UPLOAD_ENUM } from '@/utils/enum'
import { z } from 'zod/v4'

export const zOssItem = z.object({
  ossId: z.number(),
  fileName: z.string(),
  url: z.string(),
  createTime: z.string().nullable(),
  originalName: z.string(),
  service: z.string(),
})

export const zOssUpload = z.object({
  ossId: z.enum(OSS_UPLOAD_ENUM).default(OSS_UPLOAD_ENUM.PLUGIN_WIN),
  fileName: z.string().default(''),
  url: z.string().default(''),
})

export type OssItem = z.infer<typeof zOssItem>
export type OssUpload = z.infer<typeof zOssUpload>

export interface OssUpdateParams {
  domainId: number,
  tblOss: OssUpload
}
