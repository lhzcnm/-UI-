import type { Placement } from '@floating-ui/vue'
import type { VNode } from 'vue'

export interface XPopoverProps {
  closeOnClickOutside?: boolean
  closeOnEscape?: boolean
  placement?: Placement
  offset?: number
  arrow?: boolean
}

export interface XPopoverSlots {
  trigger: () => VNode[]
  default: () => VNode[]
}

export interface XPopoverEmits {
  (e: 'closed'): void
}
