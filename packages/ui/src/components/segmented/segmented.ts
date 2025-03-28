export interface SegmentedProps {
  options: SegmentedOption[]
  class?: string
  color?: 'blue' | 'emerald'
  size?: 'sm' | 'md'
}

export interface SegmentedOption {
  label: string
  value: string | number
  icon?: string
}

export interface SegmentedEmits {
  (e: 'change', value: string | number): void
}
