import type { ClassNameValue } from 'tailwind-merge'
import type { Placement } from '@floating-ui/vue'
import type { VNode } from 'vue'

export interface XPopoverProps {
  contentClass?: ClassNameValue
  closeOnClickOutside?: boolean
  closeOnEscape?: boolean
  placement?: Placement
  offset?: number
  arrow?: boolean
  teleport?: string | false | HTMLElement
  trigger?: 'click' | 'hover'
  hoverDelay?: number
  animation?: boolean
}

export interface XPopoverSlots {
  trigger: () => VNode[]
  default: () => VNode[]
}

export interface XPopoverEmits {
  (e: 'closed'): void
}
