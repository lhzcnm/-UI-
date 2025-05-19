import type { Level, LevelCreateParams, LevelUpdateParams, LevelService, LevelServiceCreateParams, LevelServiceUpdateParams } from '@/inters/level'
import { zLevel, zLevelService } from '@/inters/level'
import http from '@/utils/http'

type LevelListFn = () => Promise<Level[]>
export const getLevels: LevelListFn = async () => {
  const { data } = await http.get<Level[]>('/plans')
  return data.map(item => zLevel.parse(item))
}

type LevelCreateFn = (params: LevelCreateParams) => Promise<Level>
export const createLevel: LevelCreateFn = async (params) => {
  const { data } = await http.post<Level>('/plans', params)
  return zLevel.parse(data)
}

type LevelUpdateFn = (params: LevelUpdateParams) => Promise<number>
export const updateLevel: LevelUpdateFn = async (params) => {
  return (await http.put<number>('/plans', params)).data
}

type LevelDeleteFn = (id: number) => Promise<void>
export const deleteLevel: LevelDeleteFn = async (id) => {
  await http.delete(`/plans/${id}`)
}

// Service
type LevelServiceListFn = () => Promise<LevelService[]>
export const getLevelServices: LevelServiceListFn = async () => {
  const { data } = await http.get<LevelService[]>('/plans/service')
  return data.map(item => zLevelService.parse(item))
}

type LevelServiceCreateFn = (params: LevelServiceCreateParams) => Promise<LevelService>
export const createLevelService: LevelServiceCreateFn = async (params) => {
  const { data } = await http.post<LevelService>('/plans/service', params)
  return zLevelService.parse(data)
}

type LevelServiceUpdateFn = (params: LevelServiceUpdateParams) => Promise<number>
export const updateLevelService: LevelServiceUpdateFn = async (params) => {
  return (await http.put<number>('/plans/service', params)).data
}

type LevelServiceDeleteFn = (id: number) => Promise<void>
export const deleteLevelService: LevelServiceDeleteFn = async (id) => {
  await http.delete(`/plans/service/${id}`)
}
