import type { Upstream, UpstreamCreateParams, UpstreamUpdateParams } from "@/inters/upstream"
import { zUpstream } from "@/inters/upstream"
import http from "@/utils/http"

type UpstreamListFn = () => Promise<Upstream[]>
export const getUpstreams: UpstreamListFn = async () => {
  const { data } = await http.get<Upstream[]>('/api')
  return data.map(item => zUpstream.parse(item))
}

type UpstreamCreateFn = (params: UpstreamCreateParams) => Promise<Upstream>
export const createUpstream: UpstreamCreateFn = async (params) => {
  const { data } = await http.post<Upstream>('/api', params)
  return zUpstream.parse(data)
}

type UpstreamUpdateFn = (params: UpstreamUpdateParams) => Promise<number>
export const updateUpstream: UpstreamUpdateFn = async (params) => {
  return (await http.put<number>('/api', params)).data
}

type UpstreamDeleteFn = (data: number[]) => Promise<void>
export const deleteUpstreams: UpstreamDeleteFn = async (data) => {
  await http.delete('/api', { data })
}
