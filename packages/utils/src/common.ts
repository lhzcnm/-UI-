import type { AxiosResponse } from 'axios'

/**
 * 格式化时间
 * @param seconds 秒
 * @returns 格式化后的时间
 * 
 * @example
 * formatTime(7200) // "02:00:00"
 * formatTime(300) // "05:00"
 */
export function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  const m = minutes.toString().padStart(2, '0')
  const s = remainingSeconds.toString().padStart(2, '0')

  return hours > 0 ? `${hours}:${m}:${s}` : `${m}:${s}`
}

/**
 * 从 base64 下载文件
 * @param dataURL
 * @param filename
 */
export function downloadURL(dataURL: string, filename?: string) {
  const _filename = filename || new Date().getTime().toString()
  const link = document.createElement('a')

  link.setAttribute('href', dataURL)
  link.setAttribute('download', _filename)
  document.body.appendChild(link).click()

  link.remove()
}

/**
 * 下载文件
 * @param response 
 */
export function downloadFile(response: AxiosResponse) {
  const disposition = response.headers['content-disposition']
  const filename = decodeURIComponent(disposition?.split('filename=')[1])
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  document.body.appendChild(link)

  link.click(); link.remove()
  window.URL.revokeObjectURL(url)
}

/**
 * 数字转千分位
 * @param value 需要格式化的数字
 * @returns 
 */
export function formatNumberToThousands(value: number) {
  if (value === null || value === undefined) return '0';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 去除HTML标签但保留文本内容
 * @param html HTML字符串
 * @returns 清理后的纯文本
 */
export function stripHtml(html: string): string {
  if (!html) return ''
  
  return html
    .replace(/<[^>]*>/g, ' ') // 将所有HTML标签替换为空格
    .replace(/\s+/g, ' ')     // 将多个空格合并为一个
    .trim()                   // 去除首尾空格
}

/**
 * 
 * @param fn 
 * @param delay 
 * @returns 
 * 经过一定延时后执行函数
 */
export function debounce(fn: Function, delay: number = 1000) {
  let timer: ReturnType<typeof setTimeout> | null = null

  return function(...args: any) {
    if(timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      fn.apply(args)
    }, delay)
  }
}
