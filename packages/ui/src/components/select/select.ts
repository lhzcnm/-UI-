import type { InjectionKey, Ref } from 'vue'
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
  placeholder?: string
  filterable?: boolean
  inputPlaceholder?: string
  placement?: Placement
  multiple?: boolean
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
