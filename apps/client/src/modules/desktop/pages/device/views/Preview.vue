<script setup lang="ts">
import { Icon } from '@iconify/vue'
import HeaderTagConfig from '@desktop/components/print/HeaderTagConfig.vue'
import PaperConfig from '@desktop/components/print/PaperConfig.vue'
import SelectHeader from '@/modules/desktop/components/print/SelectHeader.vue'
import LabelCreate from '@/modules/desktop/components/print/LabelCreate.vue'

import { toast } from 'vue-sonner'
import { xconfirm, textAlign, hashPrintHeader } from '@3un/utils'
import axios from 'axios'

import type { LabelCreateForm, PrintHeader, PrintTemplateJson, TemplateItem, TemplateType } from '@/types'
import { formatSize, STORE } from '../utils'
import { filterNumber, handleInputChange, mmToPx, openIframe, ptToPx, pxTomm, readTemplateFile, stripHtmlTags } from '@/utils'
import { LAYOUT_POSITION, type PageItem, type PluginPdfRequest } from '@/types/print'
import usePrinter from '@/composable/print'
import { generatePDF } from '@/utils/print'
import { settingApi } from '@/api/settings'

const store = inject(STORE)!

const deviceStore = useDeviceStore()
const localStore = useLocalStore()

const {
  container,
  isOverflowMap,
  templateItems,
  serviceCols,
  selectCols,
  generating,
  qrcodeKeys,
  visibleSelQrHeader,
  functionItems,
  customLabels,
  loading,

  storageUrl,
  qrFieldKeys,

  isEn,
  processedColumns,
  paperStyle,
  safeAreaStyle,

  getQrcodeVal,
  isTextField,
  saveTemplate,
  importTemplate,
} = usePrinter()

const paperRef = ref<HTMLElement | null>(null)
const uploadRef = ref<HTMLInputElement | null>(null)
    
watch(
  () => templateItems.value,
  () => {
    updateAlignPosition()
  },
  {
    deep: true,
  }
)

watch(
  () => container,
  () => handleContainerChange(),
  {
    deep: true
  }
)

watch(
  () => templateItems.value,
  () => {
    updateAlignPosition()
  },
  {
    deep: true,
  }
)

const device = computed(() => deviceStore.deviceMap.get(store.printIndex))

const previewValue = computed(() => {
  let res: Record<string, string> = {}

  const deviceItem = device.value
  const customLabelVals = customLabels.value

  res["name"] = deviceItem?.product.Name || "{value}"
  res["model"] = `${deviceItem?.info.ModelNumber} ${deviceItem?.info.RegionInfo}` || "{value}"
  res["color"] = deviceItem?.product.Color || "{value}"
  res["imei"] = deviceItem?.info.InternationalMobileEquipmentIdentity ?? "{value}"
  res["imei2"] = deviceItem?.info.InternationalMobileEquipmentIdentity2 ?? "{value}"
  res["sn"] = deviceItem?.info.SerialNumber ?? "{value}"
  res["border"] = deviceItem?.info.MLBSerialNumber || "{value}"
  res["version"] = `${deviceItem?.info.ProductVersion} (${deviceItem?.info.BuildVersion})`
  res["batteryCycle"] = deviceItem?.battery.CycleCount ? deviceItem?.battery.CycleCount.toString() : "{value}"
  res["disk"] = `${deviceItem?.memory.TotalDiskCapacity ? formatSize(deviceItem.memory.TotalDiskCapacity) : "{value}"}`
  res["blueBooth"] = deviceItem?.info.BluetoothAddress ?? "{value}"
  res["ethernet"] = deviceItem?.info.EthernetAddress ?? "{value}"
  res["ECID"] = deviceItem?.info.Ecid ?? "{value}"
  res["UDID"] = deviceItem?.info.UniqueDeviceID ?? "{value}"

  for (const key of Object.keys(customLabelVals)) {
    res[key] = customLabelVals[key].value
  }

  return res
})

const previewQrcode = computed(() => {
  return getQrcodeVal(previewValue.value, qrcodeKeys.value, processedColumns.value)
})

const itemAlign = computed(() => (
  container.layout === LAYOUT_POSITION.FREE || container.layout === LAYOUT_POSITION.LEFT
    ? 'left'
    : container.layout === LAYOUT_POSITION.CENTER
      ? 'center'
      : container.layout === LAYOUT_POSITION.RIGHT 
        ? 'right'
        : undefined
))

function handleSelectColumn(id: string, type: TemplateType = 'text') {
  if (id === "AddTemplate") {
    openCreateCustomLabel()
    return
  }

  const index = selectCols.value.indexOf(id)

  if (index !== -1) {
    selectCols.value.splice(index, 1)
    templateItems.value = templateItems.value.filter(i => i.key !== id)
  } else {
    const pos = getNextItemPosition()
    const field = serviceCols.value.find(c => c.key === id)
    if (!field) return

    const newItem: TemplateItem = {
      key: id,
      label: field.name,
      label_local: field.nameEn,
      x: pos.x,
      y: pos.y,
      wrap: false,
      type: type,
      size: isTextField(type) ? 8 : (type === 'barcode' ? 5 : 15),
      showField: false,
      barcodeWidth: 2,
      flip: false,
      align: itemAlign.value,
    }

    selectCols.value.push(id)
    templateItems.value.push(newItem)
  }
}

function openCreateCustomLabel() {
  store.visibleCreateLabel = true
}

function getNextItemPosition() {
  const baseX = mmToPx(container.padding.left)
  const baseY = mmToPx(container.padding.top)
  const gap = -4

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

// function isQrcodeField(key: string) {
//   return key === 'qrcode'
// }


async function exportTemplate() {
  if (templateItems.value.length === 0) {
    if (!await xconfirm(localStore.localData['device_ExportTemplate'])) return
  }
  if (Object.values(isOverflowMap).some(Boolean)) {
    if (!await xconfirm(localStore.localData['device_StillExport'])) return
  }
  
  await saveTemplate(
    "template",
    undefined,
    templateItems.value,
    container,
    customLabels.value,
    qrcodeKeys.value,
    'device'
  )
}

function openImport() {
  uploadRef.value?.click()
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
    toast.warning(localStore.localData['device_serviceNotMatch'])
    uploadRef.value.value = ''
  }

  await importTemplateFile(file)
  uploadRef.value.value = ''
}

async function importTemplateFile(file: File) {
  const template = await readTemplateFile(file)

  if (template.serviceId) {
    return toast.warning(localStore.localData['device_serviceNotMatch'])
  }

  const {
    paperContainer,
    headers,
    selectedCols,
    selQrcodeKeys
  } = importTemplate(template)

  Object.entries(template.customLabels)
    .map(([_, customLabel]) => {
      handleCustomCreate(customLabel)
    })
  Object.assign(container, paperContainer)
  templateItems.value = headers
  selectCols.value = selectedCols
  customLabels.value = template.customLabels|| {}
  qrcodeKeys.value = selQrcodeKeys
}

function startDrag(e: MouseEvent, item: TemplateItem) {
  const target = e.currentTarget as HTMLElement
  if (!target) return

  const startX = e.clientX
  const startY = e.clientY
  const initX = item.x
  const initY = item.y

  item.align = undefined

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
  const isLandscape = container.orientation === 'landscape'

  const padding = container.padding
  const containerW = mmToPx(isLandscape ? container.height : container.width)
  const containerH = mmToPx(isLandscape ? container.width : container.height)

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
    {
      key: "name",
      name: "设备名称",
      nameEn: "DeviceName",
      type: "text",
    },
    {
      key: "model",
      name: "设备型号",
      nameEn: "Device Model",
      type: "text",
    },
    {
      key: "color",
      name: "颜色",
      nameEn: "Color",
      type: "text",
    },
    {
      key: "imei",
      name: "imei",
      nameEn: "imei",
      type: "text",
    },
    device.value?.info.InternationalMobileEquipmentIdentity2 && {
      key: "imei2",
      name: "imei2",
      nameEn: "imei2",
      type: "text",
    },
    {
      key: "sn",
      name: "序列号",
      nameEn: "Serial Number",
      type: "text",
    },
    {
      key: "border",
      name: "主板序号",
      nameEn: "Board No",
      type: "text",
    },
    {
      key: "version",
      name: "版本",
      nameEn: "OS Ver",
      type: "text",
    },
    {
      key: "batteryCycle",
      name: "充电循环次数",
      nameEn: "Charge Count",
      type: "text",
    },
    {
      key: "disk",
      name: "存储容量",
      nameEn: "Disk Total",
      type: "text",
    },
    {
      key: "blueBooth",
      name: "蓝牙地址",
      nameEn: "Blue Bootn Address",
      type: "text",
    },
    {
      key: "ethernet",
      name: "以太网地址",
      nameEn: "Ethernet Address",
      type: "text",
    },
    {
      key: "ECID",
      name: "ECID",
      nameEn: "ECID",
      type: "text",
    },
    {
      key: "UDID",
      name: "UDID",
      nameEn: "UDID",
      type: "text",
    },
    {
      key: "qrcode",
      name: "二维码",
      nameEn: "Qrcode",
      type: "qrcode",
    },
    {
      key: "barcode",
      name: "条形码",
      nameEn: "BarCode",
      type: "barcode"
    },
  ].filter(Boolean) as PrintHeader[]
}

async function handleGenerate() {
  if (!paperRef.value) return
  if (generating.value) return toast.warning(localStore.localData['device_GeneratingPDF'])
  if (templateItems.value.length === 0) {
    if (!await xconfirm(localStore.localData['device_NoField'])) return
  }
  updateOverflowMap()
  if (Object.values(isOverflowMap).some(Boolean)) {
    if (!await xconfirm(localStore.localData['device_FieldOverflow'])) return
  }

  await nextTick()
  paperRef.value.classList.add("printing")

  try {
    generating.value = true
    await pluginGeneratePdf()
  } catch {
    try {
      await handleWebGenerate()
    } catch {
      toast.warning(localStore.localData['device_PdfError'])
    }
  } finally {
    generating.value = false
    paperRef.value.classList.remove("printing")
  }
}

function processRequestParams(): PluginPdfRequest {
  const selTemplates = templateItems.value

  const res: PluginPdfRequest = {
    serviceId: 0,
    paper: {
      ...container,
    },
    pages: []
  }

  const pageItems: PageItem[] = []
  const page = paperRef.value!.cloneNode(true) as HTMLElement
  const items = Array.from(page.querySelectorAll<HTMLElement>(".template-item"))

  for (const itemEl of items) {
    const key = itemEl.dataset.key!
    const template = selTemplates.find(t => t.key === key)

    if (!template) continue

    if (template.type === 'qrcode') {
      pageItems.push({
        ...template,
        showField: true,
        x: pxTomm(template.x),
        y: pxTomm(template.y),
        value: getQrcodeVal(previewValue.value, qrcodeKeys.value, processedColumns.value),
      })
      continue
    } else if (template.type === 'barcode') {
      pageItems.push({
        ...template,
        showField: template.showField ?? true,
        x: pxTomm(template.x),
        y: pxTomm(template.y),
        value: previewValue.value['imei'],
        barcodeWidth: template.barcodeWidth ?? 2,
      })
      continue
    } else if (template.type === 'custom') {
      const customVal = customLabels.value[template.key]
      if (!customVal) continue

      pageItems.push({
        ...template,
        value: customVal.value,
        showField: template.showField ?? true,
        x: pxTomm(template.x),
        y: pxTomm(template.y),
        size: template.size!,
        align: template.align ? template.align : 'left',
      })
      continue
    } else {
      pageItems.push({
        ...template,
        showField: template.showField ?? true,
        x: pxTomm(template.x),
        y: pxTomm(template.y),
        value: previewValue.value[key] ?? '',
        size: template.size ?? 12,
        align: template.align ? template.align : 'left',
      })
    }
  }

  res.pages.push({
    items: pageItems,
  })

  return res
}

async function pluginGeneratePdf() {
  const body = processRequestParams()

  const { data } = await axios.post(
    "http://localhost:9999/generate-pdf",
    body,
    { responseType: "blob", headers: { 'x-token': Date.now().toString(16) }, timeout: 10000 },
  )

  const url = URL.createObjectURL(data)
  storageUrl.push(url)

  openIframe(url)
}

async function handleWebGenerate() {
  const body = processRequestParams()

  const pdfBlob = await generatePDF(body)

  const url = URL.createObjectURL(pdfBlob)
  storageUrl.push(url)

  openIframe(url)
}

function applyAlign(key: string, align: string) {
  if (!paperRef.value) return

  const index = templateItems.value.findIndex(t => t.key === key)
  if (index === -1) return

  const el = paperRef.value.querySelector<HTMLElement>(`.template-item[data-key="${key}"]`)
  if (!el) return

  const safe = paperRef.value.querySelector('.safe-area-border') as HTMLElement
  if (!safe) return

  const isLandscape = container.orientation === 'landscape'

  const paperWidth = mmToPx(
    isLandscape ? container.height : container.width
  )

  const elWidth = el.offsetWidth
  const safeWidth = safe.offsetWidth

  const paddingLeft = mmToPx(container.padding.left)
  const paddingRight = mmToPx(container.padding.right)

  templateItems.value[index].align = align as "left" | "center" | "right"

  if (align === 'left') {
    templateItems.value[index].x = paddingLeft
  }

  if (align === 'center') {
    templateItems.value[index].x =
      paddingLeft + (safeWidth - elWidth) / 2
  }

  if (align === 'right') {
    templateItems.value[index].x =
      paperWidth - paddingRight - elWidth
  }
}

function updateAlignPosition() {
  if (!paperRef.value) return

  const nodes = paperRef.value.querySelectorAll<HTMLElement>('.template-item')

  nodes.forEach(el => {
    const key = el.dataset.key
    if (!key) return

    const item = templateItems.value.find(i => i.key === key)
    if (!item) return

    if (item.align) {
      applyAlign(item.key, item.align)
    }
  })
}

async function handleContainerChange() {
  await nextTick()
  updateAlignPosition()
}

async function handleWrapChange(key: string) {
  const index = templateItems.value.findIndex(t => t.key === key)
  if (index === -1) return

  await nextTick()
  updateOverflowMap()
  updateAlignPosition()
}

function handleCustomCreate(template: LabelCreateForm) {
  const templateKey = hashPrintHeader(template.label)
  const lastIndex = serviceCols.value.length - 1
  const customColumn: PrintHeader = {
    key: templateKey,
    name: template.label,
    nameEn: template.label,
    type: 'custom'
  }

  serviceCols.value.splice(lastIndex, 0, customColumn)

  handleSelectColumn(customColumn.key, customColumn.type)
  customLabels.value[templateKey] = template
  initQrField()
}

function initQrField() {
  qrFieldKeys.length = 0
  qrFieldKeys.push(...serviceCols.value.filter((c) => (c.type === 'text' || c.type === 'custom')))
}

function applyGlobalLayout(layout: LAYOUT_POSITION) {
  if (!paperRef.value) return
  if (templateItems.value.length === 0) return

  container.layout = layout
  const safe = paperRef.value.querySelector(
    '.safe-area-border'
  ) as HTMLElement

  if (!safe) return

  const nodes = Array.from(
    paperRef.value.querySelectorAll<HTMLElement>('.template-item')
  )

  if (nodes.length === 0) return

  templateItems.value.forEach(item => {
    item.align = itemAlign.value
  })

  updateAlignPosition()
}

function init() {
  const defaultItems = getDefaultHeaders()
  serviceCols.value = [...defaultItems, ...functionItems]
}

async function initDefaultTemplate() {
  try {
    const { data } = await settingApi.getConfig({ key: 'PrintLabeltemplate' })
    const json = JSON.parse(data.value) as PrintTemplateJson

    const {
      paperContainer,
      headers,
      selectedCols,
      selQrcodeKeys,
    } = importTemplate(json)

    Object.assign(container, paperContainer)
    templateItems.value = headers
    selectCols.value = selectedCols
    qrcodeKeys.value = selQrcodeKeys
  } catch {}
}

init()
initQrField()

await initDefaultTemplate()

onBeforeUnmount(() => {
  storageUrl.map(URL.revokeObjectURL)
})
</script>

<template>
  <div class="p-4 h-full w-full flex gap-4 overflow-y-auto">
    <section class="w-[40%] space-y-4 flex flex-col">
      <div class="flex items-center space-x-2">
        <button
          class="p-2 flex items-center border border-border rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
          @click="store.deviceStatus = store.prevStatus">
          <Icon icon="lucide:step-back" />
          <span>{{ localStore.localData['device_Return'] }}</span>
        </button>
      </div>

      <HeaderTagConfig
        :headers="processedColumns"
        :select-cols="selectCols"
        :title="localStore.localData['device_PrintFields']"
        @selected="handleSelectColumn"
      />

      <PaperConfig
        v-model="container"
        @select-layout="applyGlobalLayout"
      />

      <div class="min-h-56 max-h-full border rounded-md p-3 space-y-3 bg-muted/30 overflow-y-auto">
        <div class="font-semibold text-sm flex items-center gap-2">
          {{ localStore.localData['device_DisplayConfiguration'] }}
          <span class="text-xs text-muted-foreground">
            ({{ localStore.localData['device_DisplayMethod'] }})
          </span>
        </div>

        <div class="space-y-3">
          <div v-for="field in templateItems" :key="field.key"
            class="flex items-center justify-between px-3 py-2 rounded-lg border bg-card hover:bg-muted/50 transition">
            <div class="w-32 truncate font-medium">
              {{ isEn ? field.label_local : field.label }}
            </div>

            <div class="flex items-center gap-3 flex-wrap">
              <template v-if="isTextField(field.type)">
                <XInput
                  v-model="field.size"
                  ui-root="w-16"
                  placeholder="字号"
                  @input="(e: Event) => field.size = handleInputChange(e)"
                  @change="(e: Event) => field.size = handleInputChange(e)"
                />

                <div class="flex border rounded overflow-hidden">
                  <button v-for="alignItem in textAlign" :key="alignItem.key" class="px-2 py-1 hover:bg-muted"
                    @click="applyAlign(field.key, alignItem.key)">
                    <Icon :icon="alignItem.icon" />
                  </button>
                </div>

                <XSelect v-model="field.wrap" ui-trigger="w-32" @selected="handleWrapChange">
                  <XSelectItem :value="true">{{ localStore.localData['device_SeparateLines'] }}</XSelectItem>
                  <XSelectItem :value="false">{{ localStore.localData['device_SameLine'] }}</XSelectItem>
                </XSelect>

                <XSelect v-model="field.showField" ui-trigger="w-32">
                  <XSelectItem :value="true">{{ localStore.localData['device_Show'] }}</XSelectItem>
                  <XSelectItem :value="false">{{ localStore.localData['device_ShowContent'] }}</XSelectItem>
                </XSelect>

                <button @click="field.flip = false" class="px-2 py-1 border rounded text-xs hover:bg-primary/50"
                  :class="{ 'bg-primary': !field.flip }">
                  {{ localStore.localData['device_WhiteBackground'] }}
                </button>

                <button @click="field.flip = true" class="px-2 py-1 border rounded text-xs"
                  :class="{ 'bg-primary': field.flip }">
                  {{ localStore.localData['device_BlackBackground'] }}
                </button>
              </template>

              <template v-else-if="field.type === 'barcode'">
                <div class="flex border rounded overflow-hidden">
                  <button v-for="alignItem in textAlign" :key="alignItem.key" class="px-2 py-1 hover:bg-muted"
                    @click="applyAlign(field.key, alignItem.key)">
                    <Icon :icon="alignItem.icon" />
                  </button>
                </div>

                <XSelect v-model="field.showField" ui-trigger="w-52">
                  <XSelectItem :value="true">{{ localStore.localData['device_BarcodeCommon'] }}</XSelectItem>
                  <XSelectItem :value="false">{{ localStore.localData['device_ShowBarcode'] }}</XSelectItem>
                </XSelect>

                <XInputNumber v-model="field.barcodeWidth!" size="sm" class="w-16" :min="1" :max="10" />

                <XInputNumber v-model="field.size!" size="sm" class="w-16" />
              </template>

              <template v-else>
                <div class="flex border rounded overflow-hidden">
                  <button v-for="alignItem in textAlign" :key="alignItem.key" class="px-2 py-1 hover:bg-muted"
                    @click="applyAlign(field.key, alignItem.key)">
                    <Icon :icon="alignItem.icon" />
                  </button>
                </div>
                
                <button class="flex items-center gap-1 px-2 py-1 border rounded text-xs"
                  @click="visibleSelQrHeader = true">
                  <Icon icon="lucide:settings" />
                  {{ localStore.localData['device_QRSettings'] }}
                </button>

                <XInput
                  v-model="field.size"
                  ui-root="w-16"
                  @input="(e: Event) => field.size = handleInputChange(e)"
                  @change="(e: Event) => field.size = handleInputChange(e)"
                />
              </template>

              <button class="text-muted-foreground hover:text-destructive" @click="handleSelectColumn(field.key)">
                <Icon icon="lucide:trash-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-between space-x-2">
        <XButton class="flex-1" :label="localStore.localData['device_Export']" color="success" @click="exportTemplate" />
        <XButton class="flex-1" :label="localStore.localData['device_Import']" @click="openImport" />
        <XButton class="flex-1" :label="localStore.localData['device_PrintResult']" color="warning" :loading="loading"
          @click="handleGenerate" />
      </div>
    </section>

    <section class="flex-1 flex justify-center">
      <div ref="paperRef" class="relative bg-white shadow paper-preview" :style="paperStyle">
        <div class="absolute safe-area-border" :style="safeAreaStyle" />

        <div v-for="item in templateItems" :key="item.key" :data-key="item.key"
          class="absolute cursor-move select-none template-item" :class="[
            { 'overflow-warning': isOverflowMap[item.key] },
            { 'bg-black text-white': item.flip },
            { 'bg-white text-black': !item.flip },
          ]" :style="[
            { left: item.x + 'px', top: item.y + 'px', maxWidth: '100%' },
            { fontSize: ptToPx(item.size!) + 'px' }
          ]" @mousedown.prevent="startDrag($event, item)">
          <template v-if="isTextField(item.type)">
            <template v-if="item.wrap">
              <div v-if="item.showField" class="font-medium leading-tight">
                {{ item.label }}:
              </div>
              <div class="leading-tight break-all template-value">
                {{ typeof previewValue === "string" ? previewValue : stripHtmlTags(previewValue[item.key]) }}
              </div>
            </template>

            <template v-else>
              <span class="font-medium" v-if="item.showField">{{ item.label }}:</span>
              <span class="ml-1 break-all template-value">{{ typeof previewValue === "string" ? previewValue :
                stripHtmlTags(previewValue[item.key]) }}</span>
            </template>
          </template>

          <template v-else-if="item.type === 'barcode'">
            <BarcodePreview
                :data="previewValue['imei']"
                :size="+filterNumber(item.size!.toString())"
                :show-field="item.showField!"
                :module-width-px="+filterNumber(item.barcodeWidth!.toString())"
              />
          </template>
          <template v-else>
            <div data-qrcode>
              <QrPreview :data="previewQrcode" :size="+filterNumber(item.size!.toString())" />
            </div>
          </template>
        </div>
      </div>
    </section>

    <SelectHeader :headers="qrFieldKeys" v-model:keys="qrcodeKeys" v-model="visibleSelQrHeader" />
    <LabelCreate v-model="store.visibleCreateLabel" @create="handleCustomCreate" />
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

.printing .overflow-warning {
  outline: none;
  background: transparent;
}

.template-item .template-value {
  word-break: break-word;
  white-space: pre-wrap;
}
</style>
