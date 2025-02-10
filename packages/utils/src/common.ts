import { IMEIValidator } from './validator/imei'
import { SNValidator } from './validator/sn'
import { imeiAndSnReg } from './regexs'

export function findAllIMEIAndSNs(str: string) {
  if (!str.trim()) return []

  const matches = str.match(imeiAndSnReg)
  if (!matches) return []

  const result = []
  for (let match of matches) {
    match = match.trim().replace(/[ -]/g, '')

    if (IMEIValidator.isValid(match)) {
      result.push(match)
      continue
    }
    if (SNValidator.isValid(match)) {
      result.push(match)
    }
  }

  return result
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
