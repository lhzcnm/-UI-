import type { Component, Ref, InjectionKey } from 'vue'

// Theme
export interface Theme {
  name: 'light' | 'dark'
  isDark: boolean
}

type ThemeKey = InjectionKey<Ref<Theme>>
export const THEME = Symbol('THEME') as ThemeKey

// Http
export type R<T> = Promise<CR<T>>
export interface CR<T = any> {
  message: string
  code: number
  data: T
}

// Pagination
export interface IPage {
  page: number
  pageSize?: number
}
export interface IList<T> {
  list: T[]
  page: number
  total: number
  pageSize: number
}

// Sidebar
export interface SidebarMenus {
  label: string
  path: string
  icon: Component
}
