import { toast } from 'vue-sonner'

export interface ValidRule {
  rule: boolean
  message: string
}

export function validate(rules: ValidRule[]) {
  return rules.every((rule) => {
    if (rule.rule) return true

    toast.warning(rule.message)
    return false
  })
}
