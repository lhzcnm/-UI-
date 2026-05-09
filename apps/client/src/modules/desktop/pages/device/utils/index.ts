import type { DeviceMapItem, DeviceSummary } from "@/types/device"
import type { DeviceStore } from "../types"
import type { IK } from "@3un/shared"
import { getLanuagestring, type LanuageItem } from "@/utils/constant"

// import { stripHtml } from '@3un/utils'

export * from './websocket'

export const STORE: IK<DeviceStore> = Symbol('device')

export function formatSize(bytes: number) {
  if (bytes === 0) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1000))
  return parseFloat((bytes / Math.pow(1000, i)).toFixed(2)) + ' ' + units[i]
  // const i = Math.floor(Math.log(bytes) / Math.log(1024))
  // return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + units[i]
}

export const getCopyToken = (info: DeviceSummary) => ([
  ['序列号', info.SerialNumber],
  ['串号', info.Imei],
  ['型号号码', `${info.ModelNumber} ${info.RegionInfo}`],
  ['系统版本', `${info.ProductVersion} (${info.BuildVersion})`],
  ['产品类型', `${info.ProductType}`],
  ['主板序号', info.MLBSerialNumber],
  ['ECID', info.Ecid],
  ['UDID', info.UniqueDeviceID],
  ['激活状态', info.ActivationState],
  // ['网络锁', stripHtml(info.NetworkLock)],
  // ['激活锁', stripHtml(info.ActivationLock)],
  // ['保修期限', info.Warranty],
  ['销售地区', info.SalesRegion.chinese],
  ['iCloud备份', info.iCloud],
  ['CPU类型', info.CPU],
])

export const getCopyTokenEn = (info: DeviceSummary) => ([
  ['Serial Number', info.SerialNumber],
  ['IMEl Number', info.Imei],
  ['Model Number', `${info.ModelNumber} ${info.RegionInfo}`],
  ['OS Ver', `${info.ProductVersion} (${info.BuildVersion})`],
  ['Product Type', `${info.ProductType}`],
  ['Board No', info.MLBSerialNumber],
  ['ECID', info.Ecid],
  ['UDID', info.UniqueDeviceID],
  ['Activated Status', info.ActivationState],
  // ['Sim Lock', stripHtml(info.NetworkLock)],
  // ['Find My', stripHtml(info.ActivationLock)],
  // ['Warranty End', info.Warranty],
  ['Region', info.SalesRegion.english],
  ['icloud', info.iCloud],
  ['CPU', info.CPU],
])

export function getPrintPayload(device: DeviceMapItem) {
  const { info, memory, product, battery, summary } = device
  return {
    DeviceName           : product.Name,
    Imei                 : summary.Imei,
    SerialNumber         : summary.SerialNumber,
    MLBSerialNumber      : info.MLBSerialNumber,
    ProductVersion       : info.ProductVersion,
    ModelNumber          : info.ModelNumber,
    RegionInfo           : info.RegionInfo,
    Color                : product.Color,
    CycleCount           : battery.CycleCount,
    DesignCapacity       : battery.DesignCapacity,
    TotalDiskCapacity    : memory.TotalDiskCapacity,
    NominalChargeCapacity: battery.NominalChargeCapacity,
    // NetworkLock          : stripHtml(summary.NetworkLock),
    // ActivationLock       : stripHtml(summary.ActivationLock),
    // Warranty             : summary.Warranty,
  }
}

export interface DeviceImageRenderOptions {
  width?: number
  pixelRatio?: number
  backgroundColor?: string
  textColor?: string
  sectionGap?: number
  lineHeight?: number
  fontFamily?: string
  titleFontSize?: number
  labelFontSize?: number
  valueFontSize?: number
  lang?: LanuageItem
}

function safeString(value: unknown) {
  if (value === null || value === undefined) return '--'
  if (typeof value === 'string' && value.trim() === '') return '--'
  return String(value)
}

function formatMemoryBytes(value: unknown) {
  const bytes = Number(value)
  if (!Number.isFinite(bytes)) return safeString(value)
  const mb = bytes / 1000 / 1000
  const gb = bytes / 1000 / 1000 / 1000
  return `${bytes}Byte / ${mb.toFixed(2)}MB / ${gb.toFixed(2)}GB`
}

function formatBatteryCapacity(value: unknown) {
  const capacity = Number(value)
  if (!Number.isFinite(capacity)) return safeString(value)
  return `${capacity}mAh`
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = []
  let current = ''

  for (const word of text.split(' ')) {
    const test = current ? `${current} ${word}` : word
    if (ctx.measureText(test).width <= maxWidth) {
      current = test
      continue
    }

    if (current) {
      lines.push(current)
      current = ''
    }

    if (ctx.measureText(word).width <= maxWidth) {
      current = word
      continue
    }

    let partial = ''
    for (const char of word) {
      const next = partial + char
      if (ctx.measureText(next).width > maxWidth) {
        if (partial) lines.push(partial)
        partial = char
      } else {
        partial = next
      }
    }
    if (partial) lines.push(partial)
  }

  if (current) {
    lines.push(current)
  }

  return lines
}

function buildDeviceSections(device: DeviceMapItem, lang: LanuageItem = 'zh') {
  const { info, memory, product, battery, summary } = device
  const salesRegion = summary.SalesRegion
  const regionLabel = lang === 'zh' ?  `${salesRegion.chinese || '--'}` : `${salesRegion.english || '--'}`
  // const regionLabel = salesRegion
  //   ? `${salesRegion.chinese || '--'} / ${salesRegion.english || '--'}`
  //   : '--'
  
  const isUnActivate = summary.ActivationState === 'Unactivated'

  return [
    {
      title: getLanuagestring('section_device_overview', lang),
      rows: [
        [getLanuagestring('device_name', lang), product.Name],
        [getLanuagestring('device_product_type', lang), summary.ProductType || info.ProductName],
        [getLanuagestring('device_model_number', lang), summary.ModelNumber || info.ModelNumber],
        [getLanuagestring('device_color', lang), product.Color],
        [getLanuagestring('device_chip', lang), product.Chip],
        [getLanuagestring('device_region', lang), summary.RegionInfo || info.RegionInfo],
        [getLanuagestring('device_sales_region', lang), regionLabel],
        [getLanuagestring('device_activation_state', lang), isUnActivate ? getLanuagestring('device_state_unactivate', lang) : getLanuagestring('device_state_activate', lang)],
        ['iCloud', summary.iCloud],
      ],
    },
    {
      title: getLanuagestring('section_identity', lang),
      rows: [
        ['Serial Number', summary.SerialNumber],
        ['IMEI', summary.Imei],
        ['ECID', summary.Ecid],
        ['UDID', summary.UniqueDeviceID],
        [getLanuagestring('device_identity_board_no', lang), summary.MLBSerialNumber || info.MLBSerialNumber],
        [getLanuagestring('device_identity_wifi', lang), summary.WiFiAddress || info.WiFiAddress],
        [getLanuagestring('device_identity_cpu', lang), summary.CPU || info.CPUArchitecture],
        [getLanuagestring('device_identity_build_version', lang), summary.BuildVersion || info.BuildVersion],
        [getLanuagestring('device_identity_product_version', lang), summary.ProductVersion || info.ProductVersion],
      ],
    },
    {
      title: getLanuagestring('section_hardware', lang),
      rows: [
        [getLanuagestring('device_hardware_model', lang), info.HardwareModel],
        [getLanuagestring('device_hardware_platform', lang), info.HardwarePlatform],
        [getLanuagestring('device_firmware_version', lang), info.FirmwareVersion],
        [getLanuagestring('device_baseband_version', lang), info.BasebandVersion],
        [getLanuagestring('device_bluetooth_address', lang), info.BluetoothAddress],
        [getLanuagestring('device_ethernet_address', lang), info.EthernetAddress],
        [getLanuagestring('device_hardware_chip_id', lang), safeString(info.ChipID)],
        [getLanuagestring('device_hardware_board_id', lang), safeString(info.BoardID)],
        [getLanuagestring('device_hardware_board_no', lang), safeString(summary.MLBSerialNumber)],
      ],
    },
    {
      title: getLanuagestring('section_storage_memory', lang),
      rows: [
        [getLanuagestring('device_disk_total', lang), formatMemoryBytes(memory.TotalDiskCapacity)],
        [getLanuagestring('device_system_total', lang), formatMemoryBytes(memory.TotalSystemCapacity)],
        [getLanuagestring('device_data_total', lang), formatMemoryBytes(memory.TotalDataCapacity)],
        [getLanuagestring('device_data_available', lang), formatMemoryBytes(memory.TotalDataAvailable)],
        [getLanuagestring('device_amount_data_available', lang), formatMemoryBytes(memory.AmountDataAvailable)],
        [getLanuagestring('device_amount_data_reserved', lang), formatMemoryBytes(memory.AmountDataReserved)],
        [getLanuagestring('device_amount_restore_available', lang), formatMemoryBytes(memory.AmountRestoreAvailable)],
      ],
    },
    {
      title: getLanuagestring('section_battery', lang),
      rows: [
        [getLanuagestring('device_battery_design_capacity', lang), formatBatteryCapacity(battery.DesignCapacity)],
        [getLanuagestring('device_battery_nominal_capacity', lang), formatBatteryCapacity(battery.NominalChargeCapacity)],
        [getLanuagestring('device_battery_cycle_count', lang), safeString(battery.CycleCount)],
        [getLanuagestring('device_battery_temperature', lang), safeString(`${battery.Temperature / 100} ℃`)],
      ],
    },
  ]
}

export function renderDeviceMapItemToCanvas(device: DeviceMapItem, options: DeviceImageRenderOptions = {}) {
  const {
    width = 1200,
    pixelRatio = 1,
    backgroundColor = '#ffffff',
    textColor = '#1f2937',
    sectionGap = 28,
    lineHeight = 32,
    fontFamily = 'system-ui, sans-serif',
    titleFontSize = 30,
    labelFontSize = 18,
    valueFontSize = 18,
    lang = 'zh',
  } = options

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Canvas 2D context is not available')
  }

  const padding = 36
  const labelWidth = 260
  const contentWidth = width - padding * 2
  const valueWidth = contentWidth - labelWidth - 20
  const sections = buildDeviceSections(device, lang)

  canvas.width = Math.round(width * pixelRatio)
  canvas.height = Math.round(10000 * pixelRatio)
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, width, canvas.height / pixelRatio)
  ctx.fillStyle = textColor
  ctx.textBaseline = 'top'

  let y = padding
  ctx.font = `${titleFontSize}px ${fontFamily}`
  ctx.fillText(getLanuagestring('device_snapshot', lang), padding, y)
  y += titleFontSize + lineHeight

  for (const section of sections) {
    ctx.font = `bold ${labelFontSize}px ${fontFamily}`
    ctx.fillText(section.title, padding, y)
    y += labelFontSize + 14

    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, y - 8)
    ctx.lineTo(width - padding, y - 8)
    ctx.stroke()

    ctx.font = `${valueFontSize}px ${fontFamily}`
    for (const [label, rawValue] of section.rows) {
      const value = safeString(rawValue)
      const labelX = padding
      const valueX = padding + labelWidth

      ctx.fillStyle = '#4b5563'
      ctx.font = `bold ${labelFontSize}px ${fontFamily}`
      ctx.fillText(label + ':', labelX, y)

      ctx.fillStyle = textColor
      ctx.font = `${valueFontSize}px ${fontFamily}`
      const lines = wrapText(ctx, value, valueWidth)
      for (const line of lines) {
        ctx.fillText(line, valueX, y)
        y += lineHeight
      }
      y += 8
    }

    y += sectionGap
  }

  const finalHeight = Math.max(y + padding, 300)
  const output = document.createElement('canvas')
  output.width = Math.round(width * pixelRatio)
  output.height = Math.round(finalHeight * pixelRatio)
  const outputCtx = output.getContext('2d')
  if (!outputCtx) {
    throw new Error('Canvas 2D context is not available')
  }

  outputCtx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  outputCtx.fillStyle = backgroundColor
  outputCtx.fillRect(0, 0, width, finalHeight)
  outputCtx.drawImage(canvas, 0, 0)

  return output
}

export async function renderDeviceMapItemToDataUrl(device: DeviceMapItem, options: DeviceImageRenderOptions = {}) {
  const canvas = renderDeviceMapItemToCanvas(device, options)
  return canvas.toDataURL('image/png')
}

export async function renderDeviceMapItemToBlob(device: DeviceMapItem, options: DeviceImageRenderOptions = {}) {
  const dataUrl = await renderDeviceMapItemToDataUrl(device, options)
  const res = await fetch(dataUrl)
  return res.blob()
}
