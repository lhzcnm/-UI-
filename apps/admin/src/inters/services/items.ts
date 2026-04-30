import { DOMESTIC_IMEI_TYPE, IMEI_TYPE } from '@3un/utils'
import type { WithId } from '@3un/shared'
import { z } from 'zod/v4'

export const zService = z.object({
  packageId: z.number().default(0),
  categoryId: z.number().default(0),
  apiId: z.number().default(-1),
  externalNetworkId: z.string().min(1).default('0'),

  apiName: z.nullable(z.string()).default(null),
  packagePrice: z.number().default(0),
  storePrice: z.preprocess(
    (val) => val === null ? 0 : Number(val),
    z.number(),
  ).default(0),
  // storePrice: z.string().nullable().default('0'),

  tmpTitle: z.string().default(''),
  packageTitle: z.string().default(''),
  packageTitleLocal: z.string().default(''),

  mustRead: z.string().nullable().default(null),
  mustReadLocal: z.string().nullable().default(null),

  timeTaken: z.string().default(''),
  timeTakenLocal: z.string().default(''),

  imeiFieldType: z.enum(IMEI_TYPE).default(IMEI_TYPE.IMEI_OR_SN),
  duplicateImeiNotAllowed: z.boolean().default(true),
  disablePackage: z.boolean().default(false),
  pushMsg: z.boolean().default(true),

  isNew: z.boolean().default(false),
  isHot: z.boolean().default(false),
  isUnlock: z.boolean().default(false),
  isDeviceShow: z.boolean().default(false),
  testimonials: z.boolean().default(false),
  packageOrderBy: z.number().default(0),
  template: z.string().default('').nullable(),
  verify: z.boolean().default(true),
  domesticSerialType: z.enum(DOMESTIC_IMEI_TYPE).default(DOMESTIC_IMEI_TYPE.DEFAULT),

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

export const zServiceSearch = z.object({
  isUnlock: z.boolean(),
})

export type Service = z.infer<typeof zService>
export type ServiceSearch = z.infer<typeof zServiceSearch>

// Form
export const zServiceForm = zService.omit({ packageId: true })

// Create & Update
export type ServiceCreateParams = z.infer<typeof zServiceForm>
export type ServiceUpdateParams = WithId<ServiceCreateParams, 'packageId'>
