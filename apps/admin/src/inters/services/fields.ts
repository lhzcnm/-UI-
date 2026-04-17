import type { IPage, IList, WithId } from '@3un/shared'
import { VERIFY_MSG } from '@/utils/message'
import { z } from 'zod/v4'

export type ServiceField = z.infer<typeof zServiceField>
export const zServiceField = z.object({
  id: z.number().default(0),

  serviceId: z.number()
    .refine((val) => val > 0, VERIFY_MSG.REQ_SERVICE_ID)
    .default(0),

  name: z.string()
    .min(1, VERIFY_MSG.REQ_FIELD_NAME)
    .default(''),
  
  nameEn: z.string()
    .min(1, VERIFY_MSG.REQ_FIELD_NAME)
    .nullable()
    .default(''),

  width: z.number().default(180),
  sortNum: z.number().default(0),
  status: z.number().default(1),
})

// Search
export interface ServiceFieldSearchParams {
  serviceId?: number
}

// List
export type ServiceFieldList = IList<ServiceField>
export interface ServiceFieldListParams extends IPage, ServiceFieldSearchParams {}

// Form
export const zServiceFieldForm = zServiceField.omit({ id: true })

export type ServiceFieldForm = z.infer<typeof zServiceFieldForm>
// Create
// export type ServiceFieldCreateParams = z.infer<typeof zServiceFieldForm>
export type ServiceFieldUpdateParams = WithId<ServiceFieldCreateParams, 'id'>

export interface ServiceFieldCreateParams {
  items: ServiceFieldForm[],
}
