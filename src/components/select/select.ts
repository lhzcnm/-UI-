import type { InjectionKey, Ref, VNode } from 'vue'
import type { Placement } from '@floating-ui/vue'

export interface Option {
  label: string
  value: string | number
}

// Provider
export const XSELECT_CONTEXT = Symbol('select-context') as InjectionKey<XSelectContext>
export interface XSelectContext {
  model: Ref<string | number | undefined>
  options: Ref<Option[]>
}

// Select
export interface XSelectProps {
  width?: string
  filterable?: boolean
  placement?: Placement
  multiple?: boolean
  placeholder?: string
  inputPlaceholder?: string
  disabled?: boolean
}
export interface XSelectEmits {
  (e: 'selected', value: any): void
}

// SelectGroup
export interface XSelectGroupProps {
  title: string
}

// SelectItem
export interface XSelectItemProps {
  value: string | number
  label?: string
  className?: string
  activeClass?: string
}
export interface XSelectItemSlots {
  default: () => VNode[]
}
