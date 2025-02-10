import type { InjectionKey, Ref } from 'vue'
import type { Placement } from '@floating-ui/vue'

export interface Option {
  label: string
  value: any
}

// Provider
export const XSelectKey = Symbol('XSelectKey') as InjectionKey<XSelectContext>
export interface XSelectContext {
  model: Ref<any>
  options: Ref<Option[]>
  handleClick: (value: any) => void
}

// Select
export interface XSelectProps {
  width?: string
  placeholder?: string
  filterable?: boolean
  inputPlaceholder?: string
  placement?: Placement
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
  label?: string
  value: any

  activeClass?: string
}
