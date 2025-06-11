import type { IPage, IList, WithId } from '@3un/shared'
import { z } from 'zod/v4'

export type ServiceField = z.infer<typeof zServiceField>
export const zServiceField = z.object({
  id: z.number().default(0),
  serviceId: z.number().default(0),
  name: z.string().default(''),
  width: z.number().default(128),
  sortNum: z.number().default(0),
  status: z.number().default(1),
})

export interface ServiceFieldListParams extends IPage {
  serviceId?: number
}

// List
export type ServiceFieldList = IList<ServiceField>

// Form
export const zServiceFieldForm = zServiceField.omit({ id: true })

// Create
export type ServiceFieldCreateParams = z.infer<typeof zServiceFieldForm>
export type ServiceFieldUpdateParams = WithId<ServiceFieldCreateParams, 'id'>
