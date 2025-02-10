export type PaginationLayout = 'prev' | 'pager' | 'next' | 'sizes' | 'jumper' | 'total'

// Pagination
export interface PaginationProps {
  total: number
  pagerCount?: number
  fixWidth?: boolean
  sizes?: number[]
  layouts?: PaginationLayout[]
  hideOnSinglePage?: boolean
}

// Control
export interface XPageControlProps {
  type: 'prev' | 'next'
  disabled?: boolean
}

// Pager
export interface XPagerProps {
  pages: number[]
  current: number
  lastPage: number
  isFirstPage: boolean
  isLastPage: boolean
  showAfterMore: boolean
  showBeforeMore: boolean
}
export interface XPagerEmits {
  (e: 'more', mode: 'prev' | 'next'): void
}

// PageSizes
export interface XPageSizesProps {
  modelValue: number
  sizes: number[]
}

// PageJumper
export interface XPageJumperProps {
  modelValue: number
}
