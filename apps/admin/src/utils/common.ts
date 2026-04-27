import { filterByRegex, useCopyFn } from '@3un/utils'

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

export function toUndef(value: any) {
  return value === -1 ? undefined : value
}

export const createList = useCopyFn(
  (limit: number = 20) => ({
    list    : [] as any[],
    total   : 0,
    page    : 1,
    pageSize: limit,
  })
)

const MM_TO_PX = 96 / 25.4

export function mmToPx(mm: number) {
  return mm * MM_TO_PX
}

export function filterNumber(input: string) {
  return filterByRegex(input, /[0-9]/)
}

export function handleInputChange(e: Event) {
  const target = e.target as HTMLInputElement
  return Number(filterNumber(target.value))
}

export function getAvatar(url: string | null) {
  const mode = import.meta.env.VITE_APP_MODE
  const defaultAvatar = `/${mode}/default_avatar.jpg`

  return url || defaultAvatar
}
