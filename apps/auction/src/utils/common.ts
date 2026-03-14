import type { ValidRule } from '@/inters/basic/valid'
import { useCopyFn } from '@3un/utils'
import { toast } from 'vue-sonner'

export const createList = useCopyFn(
  (limit: number = 20) => ({
    list    : [] as any[],
    total   : 0,
    page    : 1,
    pageSize: limit,
  })
)

export function validate(rules: ValidRule[]) {
  return rules.every(r => {
    if (r.rule) {
      return true
    }

    toast.warning(r.message)
    return false
  })
}
