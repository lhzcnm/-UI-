import { IMEI_AND_SN_REG, IMEI_TYPE, IMEIValidator, SNValidator, useCopyFn } from '@3un/utils'

export const createList = useCopyFn(
  (pageSize: number = 20) => ({
    list: [] as any[],
    total: 0,
    page: 1,
    pageSize: pageSize,
  })
)

export function formatImeiType5(imei: string) {
  return [...new Set(
    imei.replace(/[^a-zA-Z0-9]/g, '\n')
      .split('\n').filter(Boolean)
  )]
}

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
