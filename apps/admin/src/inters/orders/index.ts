import type { IList, IPage } from '@3un/shared'
import { ORDER_STATUS, ORDER_VERTIFY, SUBMIT_METHOD } from '@3un/utils'
import * as z from 'zod'

export const zOrder = z.interface({
  codeId: z.number().default(0),
  userId: z.number().default(0),
  // phoneLockedOn: z.string().default(''),
  // modelNo: z.string().default(''),
  imeiNo: z.string().default(''),
  packageId: z.number().default(0),
  // personalRecord: z.string().default(''),
  // countryId: z.string().default(''),
  codeStatusId: z.enum(ORDER_STATUS).default(ORDER_STATUS.WAIT),
  requestedAt: z.string().default(''),
  credits: z.number().default(0),
  comments: z.string().default(''),
  codeSentToOtherServer: z.number().default(0),
  messageFromServer: z.string().default(''),
  code: z.string().default(''),
  orderIdFromServer: z.string().default(''),
  // checkDuplication: z.boolean().default(false),
  // mep: z.string().default(''),
  // model: z.string().default(''),
  // serialNo: z.string().default(''),
  // serviceId: z.string().default(''),
  // modelId: z.string().default(''),
  // providerId: z.string().default(''),
  // operatorId: z.string().default(''),
  // mobileId: z.string().default(''),
  // prd: z.string().default(''),
  // pin: z.string().default(''),
  // kbh: z.string().default(''),
  // otherId: z.string().default(''),
  // otherValue: z.string().default(''),
  // zte: z.string().default(''),
  // network: z.string().default(''),
  // locks: z.string().default(''),
  downloaded: z.boolean().default(false),
  // archived: z.boolean().default(false),
  // adminArchived: z.boolean().default(false),
  // alternateEmail: z.string().default(''),
  verify: z.enum(ORDER_VERTIFY).default(ORDER_VERTIFY.NORMAL),
  ip: z.string().default('unknown'),
  verifyIp: z.string().default(''),
  showToSupplier: z.boolean().default(false),
  // payout: z.number().default(0),
  supplierId: z.string().default(''),
  updateTime: z.string().default(''),
  isBulk: z.boolean().default(false),
  submitMethod: z.enum(SUBMIT_METHOD).default(SUBMIT_METHOD.WECHAT),
  // mtype: z.string().default(''),
})

export type Order = z.infer<typeof zOrder>

// List
export const zOrderSearchForm = z.interface({
  userId: z.number().optional(),
  username: z.string().optional(),
  imeiList: z.string().optional(),
  serviceId: z.number().optional(),
  serverOrderIdEmpty: z.boolean().optional(),
  statusId: z.enum(ORDER_STATUS).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})

export type OrderList = IList<Order>
export type OrderSearchForm = z.infer<typeof zOrderSearchForm>
export interface OrderListParams extends IPage, OrderSearchForm {}
