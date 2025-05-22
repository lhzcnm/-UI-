import { ORDER_STATUS, ORDER_VERTIFY, SUBMIT_METHOD } from '@3un/shared/enums'
import * as z from 'zod'

export const zOrder = z.object({
  codeId: z.number().default(0),
  userId: z.number().default(0),
  packageId: z.number().default(0),
  codeStatusId: z.enum(ORDER_STATUS).default(ORDER_STATUS.WAIT),
  originalStatus: z.enum(ORDER_STATUS).default(ORDER_STATUS.WAIT),
  imeiNo: z.string().default(''),
  credits: z.number().default(0),
  code: z.string().default(''),
  requestedAt: z.string().default(''),
  updateTime: z.string().default(''),
  submitMethod: z.enum(SUBMIT_METHOD).default(SUBMIT_METHOD.WEB),
  isBluk: z.boolean().default(false),
  downloaded: z.boolean().default(false),
  verify: z.enum(ORDER_VERTIFY).default(ORDER_VERTIFY.NORMAL),
  orderIdFromServer: z.string().default(''),
  codeSentToOtherServer: z.number().default(0),
  messageFromServer: z.string().default(''),
})


// export interface OrderView {
//   codeId: number
//   userId: number
//   packageId: number
//   codeStatusId: ORDER_STATUS
//   originalStatus: ORDER_STATUS

//   imeiNo: string
//   credits: number
//   code: string
//   requestedAt: string
//   updateTime: string
//   submitMethod: SUBMIT_METHOD
//   isBluk: boolean

//   downloaded: boolean
//   verify: ORDER_VERTIFY
//   orderIdFromServer: string
//   codeSentToOtherServer: number
//   messageFromServer: string
// }