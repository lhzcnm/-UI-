export type DatePickerValue = Date | string | null | undefined
export type DatePickerRange = DatePickerValue[]

export interface DatePickerProps {
  labelFormat?: string
  valueFormat?: string
  placeholder?: string
  disabled?: boolean
}

export interface DatePickerEmits {
  (e: 'apply', value: DatePickerRange): void
}
