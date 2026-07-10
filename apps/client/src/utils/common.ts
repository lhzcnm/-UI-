import type { Service } from '@/api/services'
import type { PrintTemplateJson } from '@/types'

import { DOMESTIC_IMEI_MAP, DOMESTIC_IMEI_TYPE, filterByRegex, IMEI_AND_SN_REG, IMEI_TYPE_MAP, IMEIValidator, SNDomestic, SNValidator, useCopyFn } from '@3un/utils'
import { IMEI_TYPE } from '@3un/utils'

export function findAllIMEIAndSNs(str: string, type: IMEI_TYPE, domestic: DOMESTIC_IMEI_TYPE) {
  if (!str.trim()) return []

  let matches: string[] | undefined = str.split('\n').map(s => s.trim())

  if (type !== IMEI_TYPE.DOMESTIC) {
    matches = str.match(IMEI_AND_SN_REG)?.map(s => s.toString())
  }

  if (!matches) return []

  const result = []
  for (let match of matches) {
    match = match.trim().replace(/[ -]/g, '')

    if (IMEIValidator.isValid(match)) {
      result.push(match)
      continue
    }

    match = match.toLocaleUpperCase()

    if (type === IMEI_TYPE.DOMESTIC) {
      if (!(domestic in DOMESTIC_IMEI_TYPE)) continue
      if (SNDomestic.isValid(match, DOMESTIC_IMEI_MAP[domestic].regex)) {
        result.push(match)
      }
    } else {
      if (SNValidator.isValid(match)) {
        if (match.length === 11)
          match = match.slice(1)
        result.push(match)
      }
    }
  }

  return [...new Set(result)]
}

export function formatImeiType5(imei: string) {
  return [...new Set(
    imei.replace(/[^a-zA-Z0-9]/g, '\n')
      .split('\n').filter(Boolean)
  )]
}

export function getSubmitImei(imei: string, type: IMEI_TYPE, domestic?: DOMESTIC_IMEI_TYPE) {
  if (type === IMEI_TYPE.NONE) {
    return formatImeiType5(imei)
  }

  const imeiList = findAllIMEIAndSNs(imei, type, domestic ?? DOMESTIC_IMEI_TYPE.DEFAULT)
  // console.log(imeiList)
  if (type === IMEI_TYPE.IMEI) {
    return imeiList.filter(imei => imei.length === 15)
  } else if (type === IMEI_TYPE.SN) {
    return imeiList.filter(imei => imei.length < 15)
  }

  return imeiList
}

/**
 * 将 base64 数据转换为 File 对象
 * @param base64Data base64 数据
 * @param fileName 文件名
 * @param mimeType 文件类型
 * @returns
 */
export function base64ToFile(
  base64Data: string,
  fileName = 'wechat_camera.jpg',
  mimeType = 'image/jpeg'
) {
  const byteString = atob(base64Data)
  const byteArray = new Uint8Array(byteString.length)

  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i)
  }

  const blob = new Blob([byteArray], { type: mimeType })
  return new File([blob], fileName, { type: mimeType })
}

/**
 * 隐藏部分文本
 * @param text 文本
 * @param start 开始位置
 * @param end 结束位置
 * @returns 隐藏后的文本
 */
export function maskText(text: string, start = 0, end?: number) {
  const mask = '*'.repeat(end ? end - start : text.length - start)
  return text.slice(0, start) + mask + text.slice(end)
}

export function getCommonList(buckets: Map<number, Service>) {
  const key = import.meta.env.VITE_RECENT_SERVICES
  const recentServices = localStorage.getItem(key)
  const services = Array.from(buckets.values())

  if (!recentServices) return services.filter(item => item.isHot)

  let commonIdList = JSON.parse(recentServices)
  let hotList = services.filter(item => item.isHot)

  if (commonIdList.length < 5) {
    const diff = 5 - commonIdList.length
    hotList = hotList.slice(0, diff)
  }

  const commonList = services
    .filter(item => commonIdList.includes(item.id))

  return [...hotList, ...commonList]
}

export function validateImei(imei: string, type: IMEI_TYPE) {
  if(IMEI_TYPE_MAP[type].regex.test(imei)) return true
  return false
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
const MM_TO_PT = 72 / 25.4
const PT_TO_MM = 25.4 / 72
const PX_TO_MM = 25.4 / 96

export function pxToMM(px: number) {
  return px * PX_TO_MM
}

export function mmToPx(mm: number) {
  return mm * MM_TO_PX
}

export function pxTomm(px: number) {
  return px / MM_TO_PX
}

export function mmToPt(mm: number) {
  return mm * MM_TO_PT
}

export function ptToPx(pt: number) {
  return mmToPx(pt * PT_TO_MM)
}

export function stripHtmlTags(html: string) {
  if (!html) return ''
  return html.replace(/<[^>]+>/g, '')
}

export function filterNumber(input: string) {
  return filterByRegex(input, /[0-9]/)
}

export function handleInputChange(e: Event) {
  const target = e.target as HTMLInputElement
  return Number(filterNumber(target.value))
}

export function readTemplateFile(file: File): Promise<PrintTemplateJson> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string)
        resolve(json)
      } catch (e) {
        reject(e)
      }
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}

export function openIframe(url: string) {
  const iframe = document.createElement('iframe')
  
  iframe.style.position = "fixed"
  iframe.style.right = "0"
  iframe.style.bottom = "0"
  iframe.style.width = "0"
  iframe.style.height = "0"
  iframe.style.border = "0"

  iframe.src = url

  document.body.appendChild(iframe)

  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
    }, 500)
  }

  iframe.onclose = () => {
    setTimeout(() => {
      iframe.remove()
    }, 1000)
  }
}

export function stringReplace(template: string, params: Record<string, string>)
{
  return Object.entries(params).reduce(
    (result, [key, value]) =>
      result.replace(new RegExp(`\\{${key}\\}`, 'g'), value),
    template
  )
}
