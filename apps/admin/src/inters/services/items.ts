import { IMEI_TYPE } from '@3un/shared/enums'
import * as z from 'zod'

export type Service = z.infer<typeof zService>
export const zService = z.interface({
  packageId: z.number().default(0),
  categoryId: z.number().default(0),
  apiId: z.number().default(-1),
  externalNetworkId: z.string().min(1).default('0'),

  apiName: z.nullable(z.string()).default(null),
  packagePrice: z.number().default(0),

  tmpTitle: z.string().default(''),
  packageTitle: z.string().default(''),
  packageTitleLocal: z.string().default(''),

  mustRead: z.string().default(''),
  mustReadLocal: z.string().default(''),

  timeTaken: z.string().default(''),
  timeTakenLocal: z.string().default(''),

  imeiFieldType: z.enum(IMEI_TYPE).default(IMEI_TYPE.IMEI_OR_SN),
  duplicateImeiNotAllowed: z.boolean().default(true),
  disablePackage: z.boolean().default(false),
  pushMsg: z.boolean().default(true),

  isNew: z.boolean().default(false),
  isHot: z.boolean().default(false),
  isUnlock: z.boolean().default(false),
  testimonials: z.boolean().default(false),
  packageOrderBy: z.number().default(0),

  // ⬇️ 废弃字段
  // cronNo: z.number(),
  // deliveryTime: z.string(),
  // deliveryTimeLocal: z.string(),
  // fileName: z.string(),
  // hideModel: z.boolean(),
  // highlight: z.boolean(),
  // htmlTitle: z.string(),
  // metaKw: z.string(),
  // metaTags: z.string(),
  // packageImage: z.string(),
  // packageDetail: z.string().default(''),
  // packageDetailLocal: z.string().default(''),
  // seoUrlName: z.string(),
  // sl3lbf: z.boolean(),
  // toolForUnlockBase: z.string(),
})

const zServiceCreateForm = zService.omit({ packageId: true })
export type ServiceCreateParams = z.infer<typeof zServiceCreateForm>

const zServiceUpdateParams = zService.extend(zServiceCreateForm.partial())
export type ServiceUpdateParams = z.infer<typeof zServiceUpdateParams>
