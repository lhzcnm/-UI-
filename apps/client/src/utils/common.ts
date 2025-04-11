import type { Service } from '@/api/services'

import { IMEI_AND_SN_REG, IMEIValidator, SNValidator } from '@3un/utils'
import { IMEI_TYPE } from '@3un/shared/enums'

export function findAllIMEIAndSNs(str: string) {
  if (!str.trim()) return []

  const matches = str.match(IMEI_AND_SN_REG)
  if (!matches) return []

  const result = []
  for (let match of matches) {
    match = match.trim().replace(/[ -]/g, '')

    if (IMEIValidator.isValid(match)) {
      result.push(match)
      continue
    }

    match = match.toLocaleUpperCase()
    if (SNValidator.isValid(match)) {
      if (match.length === 11) 
        match = match.slice(1)
      result.push(match)
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

export function getSubmitImei(imei: string, type: IMEI_TYPE) {
  if (type === IMEI_TYPE.NONE) {
    return formatImeiType5(imei)
  }

  const imeiList = findAllIMEIAndSNs(imei)

  if (type === IMEI_TYPE.IMEI) {
    return imeiList.filter(imei => imei.length === 15)
  }
  else if (type === IMEI_TYPE.SN) {
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
