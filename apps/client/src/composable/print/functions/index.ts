import type { FieldValue } from "@/api/orders"
import type { LabelCreateForm } from "@/types"
import type { ContainerItem, PrintTemplateJson, TemplateItem, TemplateType } from "@/types"
import type { HeaderTag } from "@/types/print"
import { mmToPx, pxToMM, stripHtmlTags } from "@/utils"
import { xconfirm } from "@3un/utils"

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

export function printComposable() {
  const { t } = useI18n()
  
  function getQrcodeVal(
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

  async function saveTemplate(
    name: string | undefined,
    serviceId: number | undefined,
    templateItems: TemplateItem[],
    container: ContainerItem,
    customLabels: Record<string, LabelCreateForm>,
    qrcodeKeys: string[],
    _: string = 'service',
  ) {
    if (templateItems.length === 0) {
      if (!await xconfirm(t('print.export.noField'))) return
    }

    const template: PrintTemplateJson = {
      serviceId: serviceId,
      paper: {
        width: container.width,
        height: container.height,
        padding: { ...container.padding },
        orientation: container.orientation,
      },
      items: templateItems.map(item => ({
        key: item.key,
        label: item.label,
        label_local: item.label_local,
        x: pxToMM(item.x),
        y: pxToMM(item.y),
        align: item.align,
        wrap: item.wrap,
        type: item.type,
        size: item.size,
        showField: item.showField,
        barcodeWidth: item.barcodeWidth,
      })),
      qrcodeKeys: qrcodeKeys,
      customLabels: customLabels,
    }

    const json = JSON.stringify(template, null, 2)
    // await SaveTemplate({ templateId: templateId, serviceId: serviceId, template: json, type: type, name: name })
    const blob = new Blob([json], {
      type: "application/json"
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name}_${template.serviceId ?? 'device'}_${Date.now()}`
    a.click()
    a.remove()

    URL.revokeObjectURL(url)
    // a.href = ``
  }

  function importTemplate(template: PrintTemplateJson) {
    // const template = await readTemplateFile(file)
    const container: ContainerItem = {
      width: 0,
      height: 0,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
      orientation: 'landscape',
    }
    let templateItems: TemplateItem[] = []
    let selectCols: string[] = []
    let selQrcodeKeys: string[] = []

    container.width = template.paper.width
    container.height = template.paper.height
    // container.fontSize = template.paper.fontSize
    container.padding.top = template.paper.padding.top
    container.padding.right = template.paper.padding.right
    container.padding.bottom = template.paper.padding.bottom
    container.padding.left = template.paper.padding.left
    container.orientation = template.paper.orientation ?? 'landscape'

    templateItems = template.items.map(item => ({
      ...item,
      showField: item.showField ?? true,
      barcodeWidth: item.barcodeWidth ?? 2,
      x: mmToPx(item.x),
      y: mmToPx(item.y),
    }))

    selectCols = templateItems.map(item => item.key)
    selQrcodeKeys = template.qrcodeKeys

    return {
      paperContainer: container,
      headers: templateItems,
      selectedCols: selectCols,
      selQrcodeKeys: selQrcodeKeys,
    }
  }

  function isTextField(type: TemplateType) {
    return type.toLowerCase() === 'text' || type.toLowerCase() === 'custom' || type.toLowerCase() === 'device'
  }

  function isQrCodeField(type: TemplateType) {
    return type.toLowerCase() === 'qrcode'
  }

  // async function getDbTemplate(
  //   serviceId: number | undefined,
  //   type: "service" | "device"
  // ) {
  //   const data = await GetTemplate(serviceId, type)
  //   // console.log(data)
  //   // if (data.length = 0) return []

  //   return processServiceTemplate(data)
  // }

  return {
    getQrcodeVal,
    saveTemplate,
    importTemplate,
    isTextField,
    isQrCodeField,
    // getDbTemplate,
  }
}
