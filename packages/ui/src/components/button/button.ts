import type { ClassNameValue } from 'tailwind-merge'
import type { IconifyIcon } from '@iconify/vue'

export type BtnVariant = 'solid' | 'soft' | 'outline' | 'ghost'
export type BtnColor = 'primary' | 'emerald' | 'rose' | 'amber' | 'indigo'
export type BtnNativeType = 'button' | 'submit' | 'reset'
export type BtnSize = 'sm' | 'md'

export interface BtnProps {
  class?: ClassNameValue
  type?: BtnNativeType
  variant?: BtnVariant
  color?: BtnColor
  size?: BtnSize
  label?: string
  icon?: string | IconifyIcon
  loading?: boolean
  disabled?: boolean
}
