<script setup lang="ts">
import { Icon } from '@iconify/vue'
import QrPreview from '@/components/QrPreview.vue'
import HeaderTagConfig from '@desktop/components/print/HeaderTagConfig.vue'
import PaperConfig from '@desktop/components/print/PaperConfig.vue'

import { hashPrintHeader, ORDER_STATUS, xconfirm, textAlign } from '@3un/utils'
import { toast } from 'vue-sonner'
import axios from 'axios'

import { handleInputChange, mmToPx, openIframe, ptToPx, pxTomm, readTemplateFile, stripHtmlTags } from '@/utils'
import { HISTORY_STORE } from '../utils'
import { serviceApi, type FieldMap, type ServiceHeader } from '@/api/services'
import { type CustomSubmitOrder, type FieldValue, type Order, type ServiceColumnItem } from '@/api/orders'
import type { LabelCreateForm, PrintHeader, PrintTemplateJson, TemplateItem, TemplateType } from '@/types'
import { LAYOUT_POSITION, type PageItem, type PluginPdfRequest } from '@/types/print'
import usePrinter from '@/composable/print'
import { generatePDF } from '@/utils/print'
import SelectHeader from '@/modules/desktop/components/print/SelectHeader.vue'
import LabelCreate from '@/modules/desktop/components/print/LabelCreate.vue'

const store = inject(HISTORY_STORE)!

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

// const { t } = useI18n()
const localStore = useLocalStore()
const { services } = useServiceStore()

const resultCol = hashPrintHeader("处理结果")
const orderResultCol = hashPrintHeader("订单结果")

const customOrders = ref<CustomSubmitOrder[]>([])
const visibleCreateLabel = ref<boolean>(false)

const paperRef = ref<HTMLElement | null>(null)
const uploadRef = ref<HTMLInputElement | null>(null)

const defaultItems: PrintHeader[] = [
  {
    key: hashPrintHeader("imei"),
    name: "IMEI",
    nameEn: "IMEI",
    type: "text",
  },
  {
    key: 'qrcode',
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
]

let headerKey: string[] = []

watch(
  () => container,
  () => updateOverflowMap(),
  { deep: true }
)

watch(
  () => container,
  () => handleContainerChange(),
  {
    deep: true
  }
)

const currentService = computed(() => {
  const service = services.get(store.selectOrders[0].serviceId)
  return service
})

const previewValue = computed(() => {
  const res: Record<string, string> = {}
  const customLabelVals = customLabels.value

  for (const key of Object.keys(customLabelVals)) {
    res[key] = customLabelVals[key].value
  }

  const order = customOrders.value.find(o => o.status === ORDER_STATUS.SUCCESS)
  if (!order) {
    for (const item of processedColumns.value) {
      if (res[item.key] === undefined) {
        res[item.key] = "{value}"
      }
    }
    res[orderResultCol] = "{value}"
    res['result'] = "{value}"
    return res
  }

  for (const item of processedColumns.value) {
    if (resultCol === item.key) {
      res[resultCol] = order.result || "{value}"
      continue
    }

    if (item.key === hashPrintHeader("imei")) {
      res[item.key] = order.imei || "{value}"
      continue
    }

    const field = order.fields[item.key]
    if (field && field.value !== "") {
      res[item.key] = field.value
      continue
    }

    if (res[item.key] === undefined) {
      res[item.key] = "{value}"
    }
  }

  res[orderResultCol] = order.result || "{value}"
  res['result'] = order.result || "{value}"

  return res
})

const previewQrcode = computed(() => {
  const order = customOrders.value.find(o => o.status === ORDER_STATUS.SUCCESS)
  if (!order) return '{value}'
  return getQrcodeVal({ ...order.fields, ...{ [hashPrintHeader('imei')]: order.imei } }, qrcodeKeys.value, processedColumns.value)
})

const barcodeVal = computed(() => {
  const order = customOrders.value.find(o => o.status === ORDER_STATUS.SUCCESS)
  if (!order) return "{value}"

  let res = order.imei

  return res
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

async function getServiceColumns(value: number) {
  const { data } = await serviceApi.header(value)

  let serviceHeader: ServiceHeader[] = []
  if (!data || data.length === 0) {
    serviceHeader.push({
      name: '订单结果',
      nameEn: 'result',
    })
  } else {
    serviceHeader = data
    headerKey = data.map(h => h.name)
  }

  serviceCols.value = [...defaultItems, ...serviceHeader.map(h =>  ({
      key: hashPrintHeader(h.name),
      name: h.name,
      nameEn: h.nameEn ? h.nameEn : h.name,
      type: "text"
    }) as PrintHeader
  ), ...functionItems]
}

function handleSelectColumn(key: string, type: TemplateType = 'text') {
  if (type === 'Function') {
    handleFieldFunction(key)
    return
  }

  const header = serviceCols.value.find(h => h.key === key)
  if (!header) return

  const index = selectCols.value.indexOf(key)

  if (index !== -1) {
    selectCols.value.splice(index, 1)
    templateItems.value = templateItems.value.filter(i => i.key !== key)
  } else {
    const pos = getNextItemPosition()

    const newItem: TemplateItem = {
      key: key,
      label: header.name,
      label_local: header.nameEn,
      x: pos.x,
      y: pos.y,
      wrap: false,
      type: type,
      size: isTextField(type) ? 8 : (type === 'barcode' ? 5 : 15),
      showField: false,
      barcodeWidth: 2,
      align: itemAlign.value
    }

    selectCols.value.push(key)
    templateItems.value.push(newItem)
  }
}

function handleFieldFunction(id: string) {
  switch(id) {
    case "AddTemplate":
      openCreateCustomLabel()
      break
  }
}

function openCreateCustomLabel() {
  visibleCreateLabel.value = true
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

function getFieldsMap(fields: ServiceHeader[]) {
  const fieldsCN = fields.map(item => item.name)
  const fieldsEN = fields.map(item => item.nameEn)
  const result: Record<string, FieldMap> = {}

  for (let i = 0; i < fieldsCN.length; i++) {
    const cn = fieldsCN[i]
    const en = fieldsEN[i]

    result[cn] = { cn, en }

    if (en !== null && en !== "") {
      result[en] = { cn, en }
    }
  }

  return result
}

function processResult(content: string) {
  const result: FieldValue = {}
  const items = content.split("<br>")

  const keyMap = getFieldsMap(serviceCols.value)

  if (items.length === 1 && serviceCols.value.length === 1) {
    const key = isEn.value ? (serviceCols.value[0].nameEn ?? serviceCols.value[0].name) : serviceCols.value[0].name
    result[hashPrintHeader(key)] = {
      title: key,
      value: content
    }
  } else {
    for (const item of items) {
      const [key, ...valueParts] = item.split(/[:：]/)
      const rawKey = key.trim()
      const value = valueParts.join(":").trim()

      const mapped = keyMap[rawKey]
      if (!mapped) continue

      const finalKey = isEn.value ? mapped.en ? mapped.en : mapped.cn : mapped.cn
      result[hashPrintHeader(mapped.cn)] = {
        title: finalKey,
        value: value,
      }
    }
  }

  const isSuccess = judgeOrderStatus(serviceCols.value, items)

  if (!isSuccess) {
    result[hashPrintHeader(headerKey[0])] = {
      title: headerKey[0],
      value: content,
    }
  }

  return result
}

function judgeOrderStatus(fields: ServiceColumnItem[], items: string[]) {
  const fieldsCN = fields.map(item => item.name)
  const fieldsEN = fields.map(item => item.nameEn)

  return items.some(item => {
    let texts = item.split(":")

    return texts.some(text => {
      return fieldsCN.includes(text) || fieldsEN.includes(text)
    })
  })
}

function processRawOrders(orders: Order[]) {
  for (let order of orders) {
    customOrders.value.push({
      ...order,
      fields: {...processResult(order.result)}
    })
  }
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

async function exportTemplate() {
  if (templateItems.value.length === 0) {
    if (!await xconfirm(localStore.localData['history_NoFields_Toast'])) return
  }
  if (Object.values(isOverflowMap).some(Boolean)) {
    if (!await xconfirm(localStore.localData['history_FieldsRange'])) return
  }

  await saveTemplate(
    "template",
    currentService.value?.id ?? 0,
    templateItems.value,
    container,
    customLabels.value,
    qrcodeKeys.value,
    'service'
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
    toast.warning(localStore.localData['history_Inconsistent'])
    uploadRef.value.value = ''
  }

  await importTemplateFile(file)
  uploadRef.value.value = ''
}

async function importTemplateFile(file: File) {
  const template = await readTemplateFile(file)

  const currentServiceId = currentService.value?.id ?? 0
  if (currentServiceId !== 0 && template.serviceId !== currentServiceId) {
    return toast.warning(localStore.localData['history_Inconsistent'])
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

async function handleWebGenerate() {
  const body = processRequestParams()

  const pdfBlob = await generatePDF(body)
  const url = URL.createObjectURL(pdfBlob)
  storageUrl.push(url)

  openIframe(url)
}

async function handleGenerate() {
  if (!paperRef.value) return
  if (generating.value) return toast.warning(localStore.localData['history_WaitPDF'])
  if (customOrders.value.length === 0) return toast.warning(localStore.localData['history_FirstSubmitOrder'])
  if (templateItems.value.length === 0) {
    if (!await xconfirm(localStore.localData['history_NoFields_Toast'])) return
  }
  updateOverflowMap()
  if (Object.values(isOverflowMap).some(Boolean)) {
    if (!await xconfirm(localStore.localData['history_FieldsOutRange'])) return
  }

  paperRef.value.classList.add("printing")
  await nextTick()
  
  try {
    generating.value = true
    await pluginGeneratePdf()
  } catch {
    try {
      await handleWebGenerate()
    } catch {
      toast.warning(localStore.localData['history_FailsPDF'])
    }
  } finally {
    generating.value = false
    paperRef.value.classList.remove("printing")
  }
}

function processRequestParams(): PluginPdfRequest {
  const submitedOrders = customOrders.value
  
  const res: PluginPdfRequest = {
    serviceId: currentService.value!.id,
    paper: {
      ...container,
    },
    pages: []
  }

  for (let i = 0; i < submitedOrders.length; i++) {
    const order = submitedOrders[i]
    if (order.status !== ORDER_STATUS.SUCCESS) continue

    const pageItems: PageItem[] = processPageItem(order)

    res.pages.push({ items: pageItems })
  }

  return res
}

function processPageItem(order: CustomSubmitOrder) {
  const selTemplates = templateItems.value
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
        label: isEn.value ? template.label_local : template.label,
        showField: true,
        x: pxTomm(template.x),
        y: pxTomm(template.y),
        value: getQrcodeVal({ ...order.fields, ...{ [hashPrintHeader('imei')]: order.imei } }, qrcodeKeys.value, processedColumns.value),
      })
      continue
    } else if (template.type === 'barcode') {
      pageItems.push({
        ...template,
        showField: template.showField ?? true,
        x: pxTomm(template.x),
        y: pxTomm(template.y),
        value: order.imei,
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
    }
    pageItems.push({
      ...template,
      label: isEn.value ? template.label_local : template.label,
      showField: template.showField ?? true,
      x: pxTomm(template.x),
      y: pxTomm(template.y),
      size: template.size!,
      value: key === hashPrintHeader("imei")
        ? stripHtmlTags(order.imei) || ""
        : stripHtmlTags(order.fields[key] ? order.fields[key].value : '') ?? '',
    })
  }

  return pageItems
}

async function pluginGeneratePdf() {
  const body = processRequestParams()

  const { data } = await axios.post(
    "http://localhost:9999/generate-pdf",
    body,
    {
      responseType: "blob",
      headers: {'x-token': Date.now().toString(16)},
      timeout: 10000,
      // signal: controller,
    },
  )

  const url = URL.createObjectURL(data)
  storageUrl.push(url)
  openIframe(url)
  // window.open(url)

  // URL.revokeObjectURL(url)
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

// async function handleTemplateChange(key: string) {
//   const index = templateItems.value.findIndex(t => t.key === key)
//   if (index === -1) return

//   templateItems.value[index].showField = !templateItems.value[index].showField
//   await nextTick()
//   updateAlignPosition()
// }

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

function initQrField() {
  qrFieldKeys.length = 0
  qrFieldKeys.push(...serviceCols.value.filter((c) => (c.type === 'text' || c.type === 'custom')))
}

async function getServiceDefaultTemplate(id: number) {
  try {
    const { data } = await serviceApi.getTemplate(id)
    const json = JSON.parse(data) as PrintTemplateJson

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

await getServiceColumns(store.selectOrders[0].serviceId)
await getServiceDefaultTemplate(store.selectOrders[0].serviceId)
initQrField()

onMounted(async () => {
  processRawOrders(store.selectOrders)
  await nextTick()
  updateAlignPosition()
  updateOverflowMap()
  qrcodeKeys.value.push(hashPrintHeader("imei"))
})

onBeforeUnmount(() => {
  storageUrl.map(URL.revokeObjectURL)
})
</script>

<template>
  <div class="p-4 h-full w-full flex gap-4 overflow-auto">
    <section class="w-[40%] space-y-4 flex flex-col">
      <div class="flex items-center space-x-2">
        <button class="p-2 flex items-center border border-border rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
          @click="store.views = 'history'">
          <Icon icon="lucide:step-back" />
          <span>{{ localStore.localData['history_PrintReturn'] }}</span>
        </button>

        <span>{{ localStore.localData['history_Currentservice'] }}: {{ currentService!.id }} - {{ currentService!.title }}</span>
      </div>

      <HeaderTagConfig
        :headers="processedColumns"
        :select-cols="selectCols"
        :title="localStore.localData['history_PrintFields']"
        @selected="handleSelectColumn"
      />

      <div class="min-h-56 border rounded-md p-3 space-y-3 bg-muted/30">
        <div class="font-semibold text-sm flex items-center gap-2">
          {{ localStore.localData['history_FiledConfiguration'] }}
          <span class="text-xs text-muted-foreground">
            ({{ localStore.localData['history_ConfigTip'] }})
          </span>
        </div>

        <PaperConfig
          v-model="container"
          @select-layout="applyGlobalLayout"
        />

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
                  <XSelectItem :value="true">{{ localStore.localData['history_LabelContentLines'] }}</XSelectItem>
                  <XSelectItem :value="false">{{ localStore.localData['history_LabelContentNoWrap'] }}</XSelectItem>
                </XSelect>

                <XSelect v-model="field.showField" ui-trigger="w-32">
                  <XSelectItem :value="true">{{ localStore.localData['history_LabelAndContent'] }}</XSelectItem>
                  <XSelectItem :value="false">{{ localStore.localData['history_OnlyShowContent'] }}</XSelectItem>
                </XSelect>

                <button @click="field.flip = false" class="px-2 py-1 border rounded text-xs hover:bg-primary/50"
                  :class="{ 'bg-primary': !field.flip }">
                  {{ localStore.localData['history_White'] }}
                </button>

                <button @click="field.flip = true" class="px-2 py-1 border rounded text-xs"
                  :class="{ 'bg-primary': field.flip }">
                  {{ localStore.localData['history_Black'] }}
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
                  <XSelectItem :value="true">{{ localStore.localData['history_ShowBarcode'] }}</XSelectItem>
                  <XSelectItem :value="false">{{ localStore.localData['history_OnlyShowBarcode'] }}</XSelectItem>
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
                  {{ localStore.localData['history_PrintQrcode'] }}
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

      <div class="flex flex-col items-center">
        <PluginTip />
        <div class="w-full flex items-center justify-between gap-2">
          <XButton class="flex-1" :label="localStore.localData['history_ExportTemplate']" color="success" @click="exportTemplate" />
          <XButton class="flex-1" :label="localStore.localData['history_ImportTemplate']" @click="openImport" />
          <XButton class="flex-1" :label="localStore.localData['history_PrintOrderResult']" color="warning" @click="handleGenerate" />
        </div>
      </div>
    </section>

    <section class="flex-1 flex justify-center">
      <div
        ref="paperRef"
        class="relative bg-white shadow paper-preview"
        :style="paperStyle"
      >
        <div
          class="absolute safe-area-border"
          :style="safeAreaStyle"
        />

        <div
          v-for="item in templateItems"
          :key="item.key"
          :data-key="item.key"
          class="absolute cursor-move select-none template-item"
          :class="[
            { 'overflow-warning': isOverflowMap[item.key] },
            { 'bg-black text-white': item.flip },
            { 'bg-white text-black': !item.flip },
          ]"
          :style="[
            { left: item.x + 'px', top: item.y + 'px', maxWidth: '100%' },
            { fontSize: ptToPx(item.size!) + 'px' }
          ]"
          @mousedown.prevent="startDrag($event, item)"
        >
          <template v-if="isTextField(item.type)">
            <template v-if="item.wrap">
              <div v-if="item.showField" class="font-medium leading-tight">
                {{ isEn ? item.label_local : item.label }}:
              </div>
              <div class="leading-tight break-all template-value">
                {{ typeof previewValue === "string" ? previewValue : stripHtmlTags(previewValue[item.key]) }}
              </div>
            </template>
        
            <template v-else>
              <span class="font-medium" v-if="item.showField">{{ isEn ? item.label_local : item.label }}:</span>
              <span class="ml-1 break-all template-value">{{ typeof previewValue === "string" ? previewValue : stripHtmlTags(previewValue[item.key]) }}</span>
            </template>
          </template>

          <template v-else-if="item.type === 'barcode'">
            <div data-barcode>
              <BarcodePreview
                :data="barcodeVal"
                :size="item.size ?? 20"
                :show-field="item.showField!"
                :module-width-px="item.barcodeWidth!"
              />
            </div>
          </template>

          <template v-else>
            <div data-qrcode>
              <QrPreview
                :data="previewQrcode"
                :size="item.size ?? 25" />
            </div>
          </template>
        </div>
      </div>
    </section>

    <SelectHeader :headers="qrFieldKeys" v-model:keys="qrcodeKeys" v-model="visibleSelQrHeader" />
    <LabelCreate v-model="visibleCreateLabel" @create="handleCustomCreate" />
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
