import { useCopyFn } from '@3un/utils'

/**
 * 生成随机数
 * @param min 最小值
 * @param max 最大值
 * @returns 随机数
 */
export function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 数字转千分位
 * @param value 需要格式化的数字
 * @returns 
 */
export function formatNumberToThousands(value: number) {
  if (value === null || value === undefined) return '0'
  if (value < 1000) return value.toString()

  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const createList = useCopyFn(
  (limit: number = 20) => ({
    list    : [] as any[],
    total   : 0,
    page    : 1,
    pageSize: limit,
  })
)
