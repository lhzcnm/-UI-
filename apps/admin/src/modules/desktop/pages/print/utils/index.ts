import type { ContainerItem, FieldValue, HeaderTag, PaperDirectionOption, PrintHeader, TemplateType } from '../type'

export const initContainer: ContainerItem = {
  width: 40,
  height: 60,
  padding: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  // styles: {},
  orientation: "landscape",
}

export const directionOptions: PaperDirectionOption[] = [
  { value: 'portrait', label: '纵向' },
  { value: 'landscape', label: '横向' },
]

export const functionItems: PrintHeader[] = [
  // { key: "AddTemplate", name: "添加自定义标签", nameEn: "Add Custom Label", type: "Function" }
]

export function isTextField(type: TemplateType) {
  return type.toLowerCase() === 'text' || type.toLowerCase() === 'custom' || type.toLowerCase() === 'device'
}

export const scaleOptions = [
  { label: '100%', value: 1 },
  { label: '150%', value: 1.5 },
  { label: '200%', value: 2 },
  { label: '300%', value: 3 }
]

const MM_TO_PX = 96 / 25.4
const PX_TO_MM = 25.4 / 96
// const MM_TO_PT = 72 / 25.4
const PT_TO_MM = 25.4 / 72

export function pxToMM(px: number) {
  return px * PX_TO_MM
}

export function mmToPx(mm: number) {
  return mm * MM_TO_PX
}

export function ptToPx(pt: number) {
  return mmToPx(pt * PT_TO_MM)
}

export function stripHtmlTags(html: string) {
  if (!html) return ''

  try {
    return html.replace(/<[^>]+>/g, '')
  } catch (err) {
    console.error(err)
  }
}

export function getQrcodeVal(
  data: Record<string, any>,
  qrKeys: string[],
  headers: HeaderTag[],
) {
  const qrFields: FieldValue = {}

  for (const selKey of qrKeys) {
    const fieldKey = headers.find(c => c.key === selKey)
    if (fieldKey) {
      const dataVal = data[fieldKey.key]
      qrFields[fieldKey.key] = {
        title: fieldKey.label,
        value: typeof dataVal === 'string' ? dataVal : dataVal.value,
      }
    }
  }

  return qrcodeStr(qrFields)
}

function qrcodeStr(object: FieldValue | Record<string, string>) {
  const data = objectToString(object)
  return data
}

function objectToString(object: FieldValue | Record<string, string>) {
  return Object.entries(object)
    .map(([_, field]) => {
      if (typeof field === 'string') {
        return `${stripHtmlTags(field)}`
      }

      if (typeof field === 'object') {
        return `${stripHtmlTags(field.value)}`
      }

      return undefined
    })
    .filter(Boolean)
    .join('\n')
}
