<script setup lang="ts">
import { Icon } from '@iconify/vue'
import HeaderTag from '../components/HeaderTag.vue'

import { toast } from 'vue-sonner'
import { xconfirm } from '@3un/utils'
import * as html2image from 'html-to-image'
import jsPDF from 'jspdf'
import { useQRCode } from '@vueuse/integrations/useQRCode.mjs'

import type { ContainerItem, PrintHeader, PrintTemplateJson, TemplateItem } from '@/types'
import { formatSize, getPrintPayload, STORE, wsFetch } from '../utils'
import { mmToPx } from '@/utils'

const store = inject(STORE)!

const { locale } = useI18n()

const container = reactive<ContainerItem>({
  width: 80,
  height: 120,
  padding: {
    top: 5,
    right: 5,
    bottom: 5,
    left: 5,
  },
  styles: {},
  fontSize: 4,
})
const isOverflowMap = reactive<Record<string, boolean>>({})

// const device = computed(() => store.deviceMap.get(store.printIndex))

const device = ref(store.deviceMap.get(store.selected))
const templateItems = ref<TemplateItem[]>([])
const serviceCols = ref<PrintHeader[]>(getDefaultHeaders())
const selectCols = ref<string[]>([])
const generating = ref<boolean>(false)
const selectedTemplate = ref<number | undefined>(undefined)
const loading = ref<boolean>(false)

const paperRef = ref<HTMLElement | null>(null)
const uploadRef = ref<HTMLInputElement | null>(null)

const isEn = computed(() => locale.value === "en")

const processedColumns = computed(() => serviceCols.value.map(item => ({ key: item.key, label: isEn.value ? item.nameEn : item.name })))

const paperStyle = computed(() => ({
  width: `${mmToPx(container.width)}px`,
  height: `${mmToPx(container.height)}px`,
  padding: `${mmToPx(container.padding.top)}px
    ${mmToPx(container.padding.right)}px
    ${mmToPx(container.padding.bottom)}px
    ${mmToPx(container.padding.left)}px`,
  fontSize: `${mmToPx(container.fontSize)}px`
}))

const safeAreaStyle = computed(() => {
  const { padding, width, height } = container

  const left = mmToPx(padding.left)
  const top = mmToPx(padding.top)

  const w =
    mmToPx(width) -
    mmToPx(padding.left + padding.right)

  const h =
    mmToPx(height) -
    mmToPx(padding.top + padding.bottom)

  return {
    left: left + 'px',
    top: top + 'px',
    width: w + 'px',
    height: h + 'px',
  }
})

const previewValue = computed(() => {
  let res: Record<string, string> = {}

  const deviceItem = device.value

  res["name"] = deviceItem?.product.Name || "{value}"
  res["model"] = `${deviceItem?.info.ModelNumber} ${deviceItem?.info.RegionInfo}` || "{value}"
  res["color"] = deviceItem?.product.Color || "{value}"
  res["imei"] = deviceItem?.info.InternationalMobileEquipmentIdentity ?? "{value}"
  res["imei2"] = deviceItem?.info.InternationalMobileEquipmentIdentity2 ?? "{value}"
  res["sn"] = deviceItem?.info.SerialNumber ?? "{value}"
  res["border"] = deviceItem?.info.MLBSerialNumber || "{value}"
  res["version"] = `${deviceItem?.info.ProductVersion} (${deviceItem?.info.BuildVersion})`
  res["batteryCycle"] = deviceItem?.battery.CycleCount.toString() ?? "{value}"
  res["disk"] = `${deviceItem?.memory.TotalSystemCapacity ? formatSize(deviceItem.memory.TotalDiskCapacity) : "{value}"}`
  res["blueBooth"] = deviceItem?.info.BluetoothAddress ?? "{value}"
  res["ethernet"] = deviceItem?.info.EthernetAddress ?? "{value}"
  res["ECID"] = deviceItem?.info.Ecid ?? "{value}"
  res["UDID"] = deviceItem?.info.UniqueDeviceID ?? "{value}"

  return res
})

function handleSelectColumn(id: string, label: string) {
  const index = selectCols.value.indexOf(id)
  selectedTemplate.value = undefined

  if (index !== -1) {
    selectCols.value.splice(index, 1)
    templateItems.value = templateItems.value.filter(i => i.key !== id)
  } else {
    const isQrcode = id === 'qrcode'
    const pos = getNextItemPosition()

    const newItem: TemplateItem = {
      key: id,
      label: label,
      x: pos.x,
      y: pos.y,
      wrap: false,
      type: isQrcode ? "qrcode" : "text",
      ...(isQrcode && { size: 20 }),
    }

    selectCols.value.push(id)
    templateItems.value.push(newItem)
  }
}

function getNextItemPosition() {
  const baseX = mmToPx(container.padding.left)
  const baseY = mmToPx(container.padding.top)
  const gap = 6

  if (!paperRef.value || templateItems.value.length === 0) {
    return { x: baseX, y: baseY }
  }

  const nodes = paperRef.value.querySelectorAll<HTMLElement>('.template-item')
  if (!nodes.length) {
    return { x: baseX, y: baseY }
  }

  let maxBottom = baseY

  nodes.forEach(el => {
    const top = el.offsetTop
    const height = el.offsetHeight
    maxBottom = Math.max(maxBottom, top + height)
  })

  return {
    x: baseX,
    y: maxBottom + gap,
  }
}

function isQrcodeField(key: string) {
  return key === 'qrcode'
}

function openImport() {
  uploadRef.value?.click()
}

async function exportTemplate() {
  if (templateItems.value.length === 0) {
    if (!await xconfirm('当前没有选择字段, 是否确认导出模板? ')) return
  }
  if (Object.values(isOverflowMap).some(Boolean)) {
    if (!await xconfirm('当前存在字段超出所设范围, 是否确认导出? ')) return
  }

  const template: PrintTemplateJson = {
    paper: {
      width: container.width,
      height: container.height,
      padding: { ...container.padding },
      fontSize: container.fontSize,
    },
    items: templateItems.value.map(item => ({
      key: item.key,
      label: item.label,
      x: item.x,
      y: item.y,
      wrap: item.wrap,
      type: item.type,
      size: item.size,
    }))
  }

  const json = JSON.stringify(template, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `print-template-${template.serviceId}.json`
  a.click()
  a.remove()

  URL.revokeObjectURL(url)
}

async function handleChange(e: Event) {
  if (!uploadRef.value) return
  const target = e.target as HTMLInputElement

  let file: File = new File([], '')
  if (target.files) {
    file = target.files[0]
  }
  const extensions = file.name.split('.')[1]
  if (extensions !== 'json') {
    toast.warning('不支持的文件类型')
    uploadRef.value.value = ''
  }

  await importTemplate(file)
  uploadRef.value.value = ''
}

async function importTemplate(file: File) {
  const template = await readTemplateFile(file)

  container.width = template.paper.width
  container.height = template.paper.height
  container.fontSize = template.paper.fontSize
  container.padding.top = template.paper.padding.top
  container.padding.right = template.paper.padding.right
  container.padding.bottom = template.paper.padding.bottom
  container.padding.left = template.paper.padding.left

  templateItems.value = template.items.map(item => ({ ...item }))

  selectCols.value = template.items.map(item => item.key)
}

function readTemplateFile(file: File): Promise<PrintTemplateJson> {
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

function qrcodeStr(object: Record<string, string> | string) {
  const data = objectToString(object)

  return `${origin}/qrcode-result?data=${encodeURIComponent(data)}`
}

function objectToString(object: Record<string, string> | string) {
  const labelMap = Object.fromEntries(
    processedColumns.value.map(item => [item.key, item.label])
  )

  return Object.entries(object)
    .map(([key, value]) => {
      const isQrcode = /^(二维码|qrcode)$/i.test(key)
      if (isQrcode) return
      if (!selectCols.value.includes(key)) return

      // 用 label 代替 key
      const label = labelMap[key] ?? key
      return `${label}: ${stripHtmlTags(value)}`
    })
    .filter(Boolean)
    .join('\n')
}

function stripHtmlTags(html: string) {
  return html.replace(/<[^>]+>/g, '')
}

function startDrag(e: MouseEvent, item: TemplateItem) {
  const target = e.currentTarget as HTMLElement
  if (!target) return

  const startX = e.clientX
  const startY = e.clientY
  const initX = item.x
  const initY = item.y

  function move(ev: MouseEvent) {
    const dx = ev.clientX - startX
    const dy = ev.clientY - startY

    item.x = initX + dx
    item.y = initY + dy

    clampPosition(item, target)
    updateOverflowMap()
  }

  function up() {
    document.removeEventListener("mousemove", move)
    document.removeEventListener("mouseup", up)

    updateItemStyle(item)
  }

  function updateItemStyle(item: TemplateItem) {
    const el = paperRef.value?.querySelector<HTMLElement>(`.template-item[data-key="${item.key}"]`)
    if (!el) return

    if (item.wrap) {
      // 让它的内容最大宽度受父元素安全区控制
      const safeWidth = paperRef.value!.querySelector('.safe-area-border')!.clientWidth
      el.style.maxWidth = safeWidth + 'px'
    } else {
      el.style.maxWidth = 'none'
    }
  }

  document.addEventListener("mousemove", move)
  document.addEventListener("mouseup", up)
}

function clampPosition(item: TemplateItem, target: HTMLElement) {
  const padding = container.padding
  const containerW = mmToPx(container.width)
  const containerH = mmToPx(container.height)

  // 元素实际宽高
  const elRect = target.getBoundingClientRect()
  const width = elRect.width
  const height = elRect.height

  // 左上角最小位置
  const minX = mmToPx(padding.left)
  const minY = mmToPx(padding.top)

  // 右下角最大位置
  const maxX = containerW - mmToPx(padding.right) - width
  const maxY = containerH - mmToPx(padding.bottom) - height

  // clamp
  item.x = Math.min(Math.max(item.x, minX), maxX)
  item.y = Math.min(Math.max(item.y, minY), maxY)
}

function updateOverflowMap() {
  if (!paperRef.value) return

  const nodes = paperRef.value.querySelectorAll<HTMLElement>('.template-item')

  nodes.forEach(el => {
    const key = el.dataset.key
    if (!key) return

    isOverflowMap[key] = isItemOverflow(el)
  })
}

function isItemOverflow(el: HTMLElement) {
  const safe = paperRef.value!.querySelector('.safe-area-border')!
  const elRect = el.getBoundingClientRect()
  const safeRect = safe.getBoundingClientRect()

  return (
    elRect.right > safeRect.right ||
    elRect.bottom > safeRect.bottom ||
    elRect.left < safeRect.left ||
    elRect.top < safeRect.top
  )
}

function getDefaultHeaders(): PrintHeader[] {
  return [
    { key: "name",
      name: "设备名称",
      nameEn: "DeviceName",
    },
    {
      key: "model",
      name: "设备型号",
      nameEn: "Device Model",
    },
    {
      key: "color",
      name: "颜色",
      nameEn: "Color",
    },
    {
      key: "imei",
      name: "imei",
      nameEn: "imei",
    },
    device.value?.info.InternationalMobileEquipmentIdentity2 && {
      key: "imei2",
      name: "imei2",
      nameEn: "imei2",
    },
    {
      key: "sn",
      name: "序列号",
      nameEn: "Serial Number",
    },
    {
      key: "border",
      name: "主板序号",
      nameEn: "Board No",
    },
    {
      key: "version",
      name: "版本",
      nameEn: "OS Ver",
    },
    {
      key: "batteryCycle",
      name: "充电循环次数",
      nameEn: "Charge Count",
    },
    {
      key: "disk",
      name: "存储容量",
      nameEn: "Disk Total",
    },
    {
      key: "blueBooth",
      name: "蓝牙地址",
      nameEn: "Blue Bootn Address",
    },
    {
      key: "ethernet",
      name: "以太网地址",
      nameEn: "Ethernet Address",
    },
    {
      key: "ECID",
      name: "ECID",
      nameEn: "ECID",
    },
    {
      key: "UDID",
      name: "UDID",
      nameEn: "UDID",
    },
    {
      key: "qrcode",
      name: "二维码",
      nameEn: "Qrcode",
    },
  ].filter(Boolean) as PrintHeader[]
}

async function generatePDF() {
  if (selectedTemplate.value) {
    await printDefaultTemplate(selectedTemplate.value)
    return
  }
  if (!paperRef.value) return
  if (generating.value) return toast.warning("请等待pdf生成")
  if (templateItems.value.length === 0) {
    if (!await xconfirm("当前没有选择字段, 是否确认打印? ")) return
  }
  if (Object.values(isOverflowMap).some(Boolean)) {
    if (!await xconfirm('当前存在字段超出所设范围, 是否确认导出? ')) return
  }

  generating.value = true
  paperRef.value.classList.add("printing")

  const pdf = new jsPDF({
    unit: "px",
    format: [mmToPx(container.width), mmToPx(container.height)],
  })

  const page = paperRef.value.cloneNode(true) as HTMLElement
  document.body.appendChild(page)

  const deviceItem = previewValue.value

  // 填充数据
  page.querySelectorAll<HTMLElement>('.template-item').forEach(async itemEl => {
    const key = itemEl.dataset.key!

    if (!isQrcodeField(key)) {
      const value = deviceItem[key]

      const valueEl = itemEl.querySelector('.template-value')
      if (valueEl) {
        valueEl.textContent = stripHtmlTags(value)
      }
      return
    }

    const qrcodeItem = templateItems.value.find(i => i.type === 'qrcode')
    if (!qrcodeItem) return

    const qrContainer = itemEl.querySelector('[data-qrcode]')
    if (!qrContainer) return

    const qrData = qrcodeStr(deviceItem)

    const qrcode = useQRCode(qrData)

    qrContainer.innerHTML = ''
    const img = document.createElement('img')

    img.style.width = `${mmToPx(qrcodeItem.size ?? 20).toFixed(2)}px`
    img.style.height = `${mmToPx(qrcodeItem.size ?? 20).toFixed(2)}px`
    watch(
      () => qrcode.value,
      () => {
        img.src = qrcode.value
      },
      { immediate: true }
    )

    qrContainer.appendChild(img)
  })

  const imgData = await html2image.toPng(page, {
    pixelRatio: 2,
    backgroundColor: "#ffffff",
    cacheBust: true,
    skipFonts: true,
  })

  document.body.removeChild(page)

  pdf.addImage(imgData, "PNG", 0, 0, mmToPx(container.width), mmToPx(container.height))

  generating.value = false
  paperRef.value.classList.remove("printing")
  pdf.autoPrint({ variant: "non-conform" })
  window.open(pdf.output("bloburi"), "_blank")
}

async function printDefaultTemplate(id: number) {
  const deviceItem = device.value
  const options = {
    activationLock: [2, 3, 4].includes(id),
    networkLock: [2, 3, 4].includes(id),
    warranty: [2, 3].includes(id),
  }

  if (deviceItem && id > 1) {
    const { ActivationLock, NetworkLock, Warranty } = deviceItem.summary

    if (options.activationLock && ActivationLock === "--") {
      return toast.warning('请先查询激活锁')
    }
    if (options.networkLock && NetworkLock === "--") {
      return toast.warning('请先查询网络锁')
    }
    if (options.warranty && Warranty === "--") {
      return toast.warning('请先查询保修期限')
    }
  }

  loading.value = true

  try {
    const response = await wsFetch<string>({
      ...getPrintPayload(deviceItem!),
      TemplateId: id,
      type: "print",
    })

    const binaryString = atob(response)

    const bytes = new Uint8Array(binaryString.length)

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    const blob = new Blob([bytes], { type: "application/pdf" })
    window.open(URL.createObjectURL(blob), '_blank')
    loading.value = false
  } catch {}
}
</script>

<template>
  <div class="p-4 h-full w-full flex gap-4 overflow-y-auto">
    <section class="w-[40%] space-y-4 flex flex-col">
      <div class="flex items-center space-x-2">
        <button
          class="p-2 flex items-center border border-border rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
          @click="store.deviceStatus = store.prevStatus">
          <Icon icon="lucide:step-back" />
          <span>返回</span>
        </button>
      </div>

      <div class="border p-2 space-y-1">
        <div class="font-bold text-sm">设备信息</div>
        <div class="flex flex-wrap gap-2">
          <template v-for="item in processedColumns" :key="item.key">
            <HeaderTag :label="item.label" :id="item.key" :checked="selectCols.includes(item.key)"
              @click="handleSelectColumn" />
          </template>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4 p-2 rounded-md border border-border shadow-sm">
        <!-- 字体大小 -->
        <div class="flex flex-col space-y-1">
          <div class="font-semibold text-sm">字体大小(mm):</div>
          <div class="flex items-center gap-2 w-40">
            <XInputNumber v-model="container.fontSize" :step="1" size="sm" />
          </div>
        </div>
        <!-- 纸张大小 -->
        <div class="flex flex-col space-y-1">
          <div class="font-semibold text-sm">纸张大小 (mm)</div>
          <div class="flex items-center gap-2">
            <span class="text-xs w-16">长(mm):</span>
            <XInputNumber v-model="container.height" :step="1" size="sm" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs w-16">宽(mm):</span>
            <XInputNumber v-model="container.width" :step="1" size="sm" />
          </div>
        </div>
        <!-- 内边距设置 -->
        <div class="flex flex-col space-y-1">
          <div class="font-semibold text-sm">页边距 (mm)</div>
          <div class="flex items-center gap-2">
            <span class="text-xs w-16">上(mm):</span>
            <XInputNumber v-model="container.padding.top" :step="1" size="sm" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs w-16">下(mm):</span>
            <XInputNumber v-model="container.padding.bottom" :step="1" size="sm" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs w-16">左(mm):</span>
            <XInputNumber v-model="container.padding.left" :step="1" size="sm" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs w-16">右(mm):</span>
            <XInputNumber v-model="container.padding.right" :step="1" size="sm" />
          </div>
        </div>
      </div>

      <div class="border rounded-md p-3 space-y-3 bg-muted/30">
        <div class="font-semibold text-sm flex items-center gap-2">
          字段显示配置
          <span class="text-xs text-muted-foreground">
            （控制打印预览中字段的展示方式）
          </span>
        </div>

        <div class="space-y-2">
          <div v-for="field in templateItems" :key="field.key"
            class="flex items-center justify-between gap-3 text-sm px-2 py-1 rounded hover:bg-muted transition">
            <!-- 字段名 -->
            <div class="flex items-center gap-2 min-w-0">
              <span class="w-32 truncate font-medium text-foreground">
                {{ field.label }}
              </span>
              <span class="text-xs text-muted-foreground">
                {{ isQrcodeField(field.key)
                  ? '二维码尺寸(mm)'
                  : (field.wrap ? '标签与内容分行显示' : '标签与内容同行显示') }}
              </span>
            </div>

            <!-- 控制开关 -->
            <div class="flex items-center">
              <div v-if="!isQrcodeField(field.key)" class="mr-4">
                <label class="flex items-center gap-3 cursor-pointer select-none">
                  <input type="checkbox" class="peer sr-only" v-model="field.wrap" />
                  <div class="relative w-9 h-5 rounded-full bg-border
                           peer-checked:bg-primary
                           transition-colors flex">
                    <XSwitch v-model="field.wrap" />
                  </div>
                </label>
              </div>

              <div v-else class="flex items-center gap-2 mr-2">
                <XInputNumber v-model="field.size!" size="sm" class="w-20" />
              </div>

              <button class="hover:text-success" @click="handleSelectColumn(field.key, field.label)">
                <Icon icon="lucide:trash-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-between space-x-2">
        <XButton class="flex-1" label="导出模板" color="success" @click="exportTemplate" />
        <XButton class="flex-1" label="导入模板" @click="openImport" />
        <XButton class="flex-1" label="打印结果" color="warning" :loading="loading" @click="generatePDF" />
      </div>
    </section>

    <section class="flex-1 flex justify-center">
      <div ref="paperRef" class="relative bg-white shadow paper-preview overflow-hidden" :style="paperStyle">
        <div class="absolute safe-area-border" :style="safeAreaStyle" />

        <div v-for="item in templateItems" :key="item.key"
          class="absolute cursor-move select-none template-item text-black"
          :class="{ 'overflow-warning': isOverflowMap[item.key] }"
          :style="{ left: item.x + 'px', top: item.y + 'px', maxWidth: '100%' }" @mousedown.prevent
          @mousedown="startDrag($event, item)" :data-key="item.key">
          <template v-if="item.type !== 'qrcode'">
            <template v-if="item.wrap">
              <div class="font-medium leading-tight">
                {{ item.label }}:
              </div>
              <div class="leading-tight break-all template-value">
                {{ typeof previewValue === "string" ? previewValue : stripHtmlTags(previewValue[item.key]) }}
              </div>
            </template>

            <template v-else>
              <span class="font-medium">{{ item.label }}:</span>
              <span class="ml-1 break-all template-value">{{ typeof previewValue === "string" ? previewValue :
                stripHtmlTags(previewValue[item.key]) }}</span>
            </template>
          </template>

          <template v-else>
            <div data-qrcode>
              <QrPreview :data="qrcodeStr(previewValue)" :size="item.size ?? 20" />
            </div>
          </template>
        </div>
      </div>
    </section>

    <input class="hidden" ref="uploadRef" type="file" @change="handleChange">
  </div>
</template>

<style scoped>
.safe-area-border {
  border: 1px dashed #94a3b8;
  box-sizing: border-box;
  pointer-events: none;
}

.paper-preview.printing .safe-area-border {
  display: none;
}

.overflow-warning {
  outline: 1px dashed #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

.template-item .template-value {
  word-break: break-word;
  white-space: pre-wrap;
}
</style>
