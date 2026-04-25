import type { DomainCodeAuthParams, DomainGenerateParams } from '@/inters/domain'
import http from '@/utils/http'

type GetCodeFn = (body: DomainGenerateParams) => Promise<string>
export const getCode: GetCodeFn = async (body) => {
  const { data } = await http.post('/domain/generateCode', body)
  return data
}

type CodeExTokenFn = (body: DomainCodeAuthParams) => Promise<string>
export const codeExToken: CodeExTokenFn = async (body) => {
  const { data } = await http.post('/auth/adminExchange', body)
  return data
}
