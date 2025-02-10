import type { Component } from 'vue'

export type BtnVariant = 'solid' | 'soft' | 'outline' | 'ghost'
export type BtnColor = 'primary' | 'emerald' | 'rose' | 'amber' | 'indigo'
export type BtnSize = 'sm' | 'md'

export interface BtnProps {
  class?: any
  type?: 'button' | 'submit' | 'reset'

  variant?: BtnVariant
  color?: BtnColor
  size?: BtnSize
  label?: string
  icon?: Component
  loading?: boolean
  disabled?: boolean
}
