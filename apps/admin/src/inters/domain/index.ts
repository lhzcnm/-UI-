import { z } from 'zod/v4'

export const zDomainGenerateParams = z.object({
  domainId: z.number()
})

export const zDomainCodeAuthParmas = z.object({
  code: z.string()
})

export type DomainGenerateParams = z.infer<typeof zDomainGenerateParams>
export type DomainCodeAuthParams = z.infer<typeof zDomainCodeAuthParmas>
