import { zGrade, type Grade } from '@/inters/infrastructure'
import http from '@/utils/http'

export async function getModels(): Promise<string[]> {
  const { data } = await http.get('phoneModel/model')
  return data
}

export async function getColors(): Promise<string[]> {
  const { data } = await http.get('phoneModel/color')
  return data
}

export async function getCapacities(): Promise<string[]> {
  const { data } = await http.get('phoneModel/capacity')
  return data
}

export async function getGrades(): Promise<string[]> {
  const { data } = await http.get<Grade[]>('grade/list')
  return data.map(g => zGrade.parse(g)).map(g => g.name)
}

export async function getLocks(): Promise<string[]> {
  const { data } = await http.get('keys/lock')
  return data
}
