import type { InjectionKey } from 'vue'
import type { XTagColor } from '@3un/ui'

// Theme
export interface Theme {
  name: 'light' | 'dark'
  isDark: boolean
}

// Http
export type R<T> = Promise<CR<T>>
export interface CR<T = any> {
  message: string
  code: number
  data: T
}

// Pagination
export interface IPage {
  pageSize?: number
  page: number
}
export interface IList<T> {
  list: T[]
  page: number
  total: number
  pageSize: number
}

// Form mode
export type FormMode = 'create' | 'update'

// Status Map
type StatusMapItem = { color: XTagColor, label: string }
export type StatusMap = Record<number, StatusMapItem>

// Utils
export type WithId<T, ID extends string> = Partial<T> & { [key in ID]: number }
export type IK<T> = InjectionKey<T>
