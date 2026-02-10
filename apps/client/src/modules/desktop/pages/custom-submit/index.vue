<script setup lang="ts">
import { Icon } from '@iconify/vue'
import SelectService from './components/SelectService.vue'
import OrderCard from './components/OrderCard.vue'

import { ORDER_STATUS, xconfirm } from '@3un/utils'
import * as html2image from 'html-to-image'
import jsPDF from 'jspdf'
import { toast } from 'vue-sonner'
import { watchOnce } from '@vueuse/core'

import type { ContainerItem, PrintTemplateJson, TemplateItem } from '@/types'
import { getSubmitImei, mmToPx } from '@/utils'
import { serviceApi, type FieldMap, type ServiceDetail, type ServiceHeader } from '@/api/services'
import { orderApi, type CustomSubmitOrder, type Order, type OrderSubmitParams, type OrderSubmitResult, type ServiceColumnItem } from '@/api/orders'
import { checkPlugin, deviceMap, handleDevice, handleDisconnect, ws } from "./utils/useDevice"
import type { DeviceResponse } from '@/types/device'

const { services, getServices } = useServiceStore()
const { t, locale } = useI18n()
const { connect, close } = useWsStore()
const { updateCredit } = useUserStore()

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

const selectCols = ref<string[]>([])
const templateItems = ref<TemplateItem[]>([])
const serviceCols = ref<ServiceHeader[]>([])
const generating = ref<boolean>(false)
const serviceId = ref<number>(0)
const queryServices = ref<ServiceDetail[]>([])
const strImeis = ref<string>('')
const customOrders = ref<CustomSubmitOrder[]>([])
const autoPrint = ref<boolean>(false)
const count = ref<number>(0)

const paperRef = ref<HTMLElement | null>(null)
const uploadRef = ref<HTMLInputElement | null>(null)

const defaultItems = [
  {
    name: "IMEI",
    nameEn: "IMEI"
  },
  {
    name: "二维码",
    nameEn: "Qrcode",
  },
]

let serviceHeaders: ServiceHeader[] = []
let headerKey: string[] = []
let submited: boolean = false
let storageUrl: string[] = []

watch(
  ws.data,
  async (val: string) => {
    if (val.startsWith('disconnected')) {
      return handleDisconnect(val)
    }
    if (val.startsWith('{"id"')) return
    if (val.includes('DeviceID')) {
      const data = JSON.parse(val) as DeviceResponse

      await handleDevice(data, t)
    }
  }
)

const isEn = computed(() => locale.value === "en")

const processedColumns = computed(() => serviceCols.value.map(item => isEn.value ? item.nameEn : item.name))

const currentService = computed(() => services.get(serviceId.value))

const validImeis = computed(() => {
  if (!currentService.value) return []
  return getSubmitImei(strImeis.value, currentService.value.imeiType)
})

const orderStat = computed(() => ({
  success: customOrders.value.filter(o => o.status === ORDER_STATUS.SUCCESS).length,
  failed: customOrders.value.filter(o => o.status === ORDER_STATUS.FAILED).length,
}))

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
  let order = customOrders.value.find(o => o.status === ORDER_STATUS.SUCCESS)
  if (!order) return "{value}"

  let res: Record<string, string> = {}

  for (let item of processedColumns.value) {
    const value = order.fields[item]

    if ((/^(处理结果|Result)$/i).test(item)) {
      res["处理结果"] = order.result
      res["Result"] = order.result
    } else {
      res[item] = value && value !== "" ? value : "{value}"
    }
  }
  res["IMEI"] = order.imei || "{value}"
  res['订单结果'] = order.result || "{value}"
  res['result'] = order.result || "{value}"

  return res
})

function handleSelectColumn(label: string) {
  const index = selectCols.value.indexOf(label)

  if (index !== -1) {
    selectCols.value.splice(index, 1)
    templateItems.value = templateItems.value.filter(i => i.key !== label)
  } else {
    const isQrcode = (/^(二维码|qrcode)$/i).test(label)
    const pos = getNextItemPosition()

    const newItem: TemplateItem = {
      key: label,
      label: label,
      x: pos.x,
      y: pos.y,
      wrap: false,
      type: isQrcode ? "qrcode" : "text",
      ...(isQrcode && {size: 25}),
    }

    selectCols.value.push(label)
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
  return (/^(二维码|qrcode)$/i).test(key)
}

async function exportTemplate() {
  if (templateItems.value.length === 0) {
    if (!await xconfirm(t('print.export.noField'))) return
  }
  if (Object.values(isOverflowMap).some(Boolean)) {
    if (!await xconfirm(t('print.export.overflow'))) return
  }

  const template: PrintTemplateJson = {
    serviceId: serviceId.value,

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
    toast.warning(t('print.prompt.import.serviceNotMatch'))
    uploadRef.value.value = ''
  }

  await importTemplate(file)
  uploadRef.value.value = ''
}

async function importTemplate(file: File) {
  const template = await readTemplateFile(file)

  const currentServiceId = serviceId.value
  if (template.serviceId !== currentServiceId) {
    return toast.warning(t('print.prompt.import.serviceNotMatch'))
  }

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

function stripHtmlTags(html: string) {
  return html.replace(/<[^>]+>/g, '')
}

function qrcodeStr(object: Record<string, string> | string) {
  const data = objectToString(object)
  return data
  // return `${origin}/qrcode-result?data=${encodeURIComponent(data)}`
}

function objectToString(object: Record<string, string> | string) {
  return Object.entries(object)
    .map(([key, value]) => {
      const isQrcode = (/^(二维码|qrcode)$/i).test(key)
      if (isQrcode) return
      if (!selectCols.value.includes(key)) return
      return `${key}: ${stripHtmlTags(value)}`
    })
    .filter(Boolean)
    .join('\n')
}

async function getServiceColumns(value: number) {
  const { data } = await serviceApi.header(value)

  serviceHeaders = data

  let serviceHeader: ServiceHeader[] = []
  if (!data || data.length === 0) {
    serviceHeader.push({
      name: '订单结果',
      nameEn: 'result',
    })
  } else {
    serviceHeader = data
    headerKey = data.map(h => isEn.value ? h.nameEn : h.name)
  }

  serviceCols.value = [...defaultItems, ...serviceHeader]
}

async function getQueryService() {
  const { data } = await serviceApi.list({ isUnlock: false })
  queryServices.value = data
}

async function handleSelected(value: number) {
  if (value) {
    submited = false
    close()
    templateItems.value.length = 0
    selectCols.value.length = 0
    customOrders.value.length = 0
    await getServiceColumns(value)
  }
}

function handleClickPhone(imei: string) {
  if (!strImeis.value.trim()) {
    strImeis.value = imei
    return
  }

  submited = false
  const imeis = strImeis.value.split('\n')

  if (imeis.length === 0) {
    strImeis.value = ''
    imeis.push(imei)
  } else if (!imeis.includes(imei)) {
    imeis.push(imei)
  }

  strImeis.value = imeis.join('\n')
}

async function handleSubmit() {
  if (!currentService.value) return toast.warning('query.prompt.serviveNull')
  if (submited) return toast.warning(t('query.prompt.repeat'))

  const imeis = getSubmitImei(strImeis.value, currentService.value.imeiType)
  count.value = imeis.length

  customOrders.value = []
  customOrders.value = processSubmitOrder(imeis)

  if (imeis.length === 0) return toast.warning(t('query.prompt.scan'))

  strImeis.value = ''

  dispatchWebsocket()
  await submitOrder(imeis)
}

function dispatchWebsocket() {
  const { data, status } = connect({
    serviceId: serviceId.value,
    type: 'order',
  })

  watchOnce(
    status,
    (value) => {
      if (value !== 'OPEN') {
        console.warn(`[3un] WebSocket ${t('action.submit.fail', { action: t('action.connect') })}`, value)
        return close()
      }
    }
  )

  watch(
    data,
    (val) => {
      if (!val) return

      dispatchWsMessage(val)
      handleCount()
    }
  )
}

async function submitOrder(imeiList: string[]) {
  if (!currentService.value) return

  try {
    const params: OrderSubmitParams = {
      serviceId: currentService.value.id,
      imeiList: imeiList,
      isBulk: false,
      language: locale.value,
      remark: '',
    }
    const { data } = await orderApi.submit(params)
    processSubmitedOrder(data)
    submited = true
    await updateCredit()
  } catch {}
}

function processSubmitOrder(imeiList: string[]) {
  const buckets: CustomSubmitOrder[] = []

  for (let i = 0; i < imeiList.length; i++) {
    const initData: CustomSubmitOrder = {
      id: 0,
      serviceId: currentService.value!.id,
      status: ORDER_STATUS.WAIT,
      imei: imeiList[i],
      result: '',
      fields: {},
    }

    buckets.push(initData)
  }

  return buckets
}

function processSubmitedOrder(data: OrderSubmitResult[]) {
  const errMsgCol = headerKey[0]

  for (let item of data) {
    const index = customOrders.value.findIndex(o => o.imei === item.imei)

    if (index === -1) return

    customOrders.value[index] = {
      ...customOrders.value[index],
      ...({ [errMsgCol]: item.message }),
      result: item.message,
      status: item.status,
      id: item.codeId,
    }
  }
}

function handleCount() {
  count.value--

  if (count.value === 0) {
    if (autoPrint.value) {
      generatePDF()
    }
    return close()
  }
}

function dispatchWsMessage(str: string) {
  const data = JSON.parse(str) as Order

  let index = customOrders.value.findIndex(o => o.imei === data.imei)
  if (index === -1) return

  customOrders.value[index] = {
    ...customOrders.value[index],
    status: data.status,
    id: data.id,
    result: data.result,
    fields: {
      ...processOrderResult(data.result)
    }
  }
}

function getFieldsMap(fields: ServiceColumnItem[]) {
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

function processOrderResult(content: string) {
  const result: Record<string, string> = {}
  const items = content.split('<br>')

  const keyMap = getFieldsMap(serviceHeaders.map(i => ({ name: i.name, nameEn: i.nameEn })))

  if (items.length === 1 && serviceHeaders.length === 1) {
    const key = headerKey[0]
    result[key] = content
  } else {
    for (const item of items) {
      const [key, ...valueParts] = item.split(/[:：]/)
      const rawKey = key.trim()
      const value = valueParts.join(":").trim()

      const mapped = keyMap[rawKey]
      if (!mapped) continue

      const finalKey = isEn.value ? mapped.en ? mapped.en : mapped.cn : mapped.cn
      result[finalKey] = value
    }
  }

  const isSuccess = judgeOrderStatus(serviceHeaders, items)

  if (!isSuccess) {
    result[headerKey[0]] = content
  }

  return result
}

function readOrderResult() {
  xconfirm({
    title: t('print.dialog.order.title'),
    text: convertResultToHtml(customOrders.value),
  })
}

function convertResultToHtml(orders: CustomSubmitOrder[]) {
  return orders.map(order => `
    <div class="border-b last:border-0 py-3 space-y-2">
      
      <div class="text-sm font-semibold text-gray-800 dark:text-gray-200">
        IMEI：
        <span class="font-mono text-gray-600 dark:text-gray-400">
          ${order.imei}
        </span>
      </div>

      <div class="
        text-sm
        leading-relaxed
        bg-gray-50
        dark:bg-gray-900
        rounded-md
        px-3
        py-2
        text-gray-700
        dark:text-gray-300
      ">
        ${order.result}
      </div>

    </div>
  `).join('')
}

async function generatePDF() {
  if (!paperRef.value) return
  if (generating.value) return toast.warning(t('print.prompt.pdf.gerenting'))
  if (customOrders.value.length === 0) return toast.warning(t('print.prompt.pdf.notOrder'))
  if (count.value > 0) return toast.warning(t('print.prompt.pdf.processing'))
  if (templateItems.value.length === 0) {
    if (!await xconfirm(t('print.prompt.pdf.noField'))) return
  }
  updateOverflowMap()
  if (Object.values(isOverflowMap).some(Boolean)) {
    if (!await xconfirm(t('print.prompt.pdf.overflow'))) return
  }

  generating.value = true
  paperRef.value.classList.add("printing")

  const pdf = new jsPDF({
    unit: "px",
    format: [mmToPx(container.width), mmToPx(container.height)],
  })

  for (let i = 0; i < customOrders.value.length; i++) {
    const order = customOrders.value[i]

    if (order.status === ORDER_STATUS.FAILED) continue

    const page = paperRef.value.cloneNode(true) as HTMLElement
    document.body.appendChild(page)

    const items = Array.from(page.querySelectorAll<HTMLElement>('.template-item'))

    for (const itemEl of items) {
      const key = itemEl.dataset.key!
      
      if (isQrcodeField(key)) {
        const qrcodeItem = templateItems.value.find(i => i.type === 'qrcode')
        if (!qrcodeItem) continue
        const { data } = await orderApi.generateQrcode({
          content: qrcodeStr({ ...order.fields, IMEI: order.imei })}
        )

        const blob = new Blob([data], { type: 'image/png' })
        const url = URL.createObjectURL(blob)
        storageUrl.push(url)

        const img = document.createElement("img")

        const imageLoadPromise = new Promise<void>((resolve, reject) => {
          img.onload = () => resolve()
          img.onerror = () => reject(new Error(t('print.prompt.pdf.imgError')))
          img.src = url
        })

        img.width = mmToPx(qrcodeItem.size ?? 25)
        img.height = mmToPx(qrcodeItem.size ?? 25)

        itemEl.querySelector('[data-qrcode]')!.innerHTML = ''
        itemEl.querySelector('[data-qrcode]')!.appendChild(img)

        await imageLoadPromise
      } else {
        const value = key === "IMEI"
          ? order.imei || ""
          : order.fields[key] ?? ""
        
        itemEl.querySelector(".template-value")!.textContent = stripHtmlTags(value)
      }
    }

    await document.fonts.ready

    const imgData = await html2image.toPng(page, {
      pixelRatio: 2,
      backgroundColor: "#ffffff",
      cacheBust: false,
      skipFonts: true,
    })

    document.body.removeChild(page)

    pdf.addImage(imgData, "PNG", 0, 0, mmToPx(container.width), mmToPx(container.height))

    if (i < customOrders.value.length - 1) {
      pdf.addPage()
    }
  }

  generating.value = false
  paperRef.value.classList.remove("printing")
  pdf.autoPrint({ variant: "non-conform" })
  window.open(pdf.output("bloburi"), "_blank")
}

await Promise.all([
  getServices(),
  getQueryService(),
  checkPlugin(t),
])

onBeforeUnmount(() => {
  storageUrl.map(URL.revokeObjectURL)
})
</script>

<template>
  <div class="p-4 h-full w-full flex gap-4 overflow-auto">
    <section class="w-[40%] space-y-4 flex flex-col">
      <SelectService
        :services="queryServices"
        v-model="serviceId"
        @selected="handleSelected" />

      <div class="flex justify-between gap-8">
        <div class="flex-1">
          <XTextarea v-model="strImeis" :placeholder="t('imei.placeholder')" rows="8" @change="submited = false" />
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="flex items-center gap-2">
            <div class="w-full px-4 py-2 bg-card rounded-lg">
              <span>{{ t('query.imei.valid') }}: <b class="text-primary">{{ validImeis.length }}</b></span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-full px-4 py-2 bg-card rounded-lg">
              <span>{{ t('query.imei.processing') }}: <b class="text-primary">{{ count }}</b></span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-full px-4 py-2 bg-card rounded-lg">
              <span>{{ t('query.imei.processed') }}: <b class="text-success">{{ orderStat.success }}</b></span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-full px-4 py-2 bg-card rounded-lg">
              <span>{{ t('query.imei.failed') }}: <b class="text-danger">{{ orderStat.failed }}</b></span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2">
        <label class="flex items-center group relative">
          <XSwitch :label="t('print.button.autoprint.label')" v-model="autoPrint" />
          <span class="absolute opacity-0 group-hover:opacity-100 bg-card rounded top-8 left-1 text-sm p-2">{{ t('print.button.autoprint.tip') }}</span>
        </label>
        <XButton color="success" :label="t('print.button.submit')" @click="handleSubmit" />
        <XButton :label="t('print.button.showres')" @click="readOrderResult" />
        <XButton :label="t('print.button.print')" color="warning" @click="generatePDF" />
      </div>

      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <span class="flex-1 h-px bg-zinc-500"></span>
        <span>{{ t('print.prompt.filterFailed') }}</span>
        <span class="flex-1 h-px bg-zinc-500"></span>
      </div>

      <div class="border p-2 space-y-1">
        <div class="font-bold text-sm">{{ t('print.fields.title') }}</div>
        <div class="flex flex-wrap gap-2">
          <template v-for="column in processedColumns" :key="column">
            <ColumnTags :label="column"
              :checked="selectCols.includes(column)"
              @click="handleSelectColumn" />
          </template>
        </div>
      </div>
      
      <div class="grid grid-cols-3 gap-4 p-2 rounded-md border border-border shadow-sm">
        <div class="flex flex-col space-y-1">
          <div class="font-semibold text-sm">{{ t('print.size.font') }} (mm):</div>
          <div class="flex items-center gap-2 w-40">
            <XInputNumber v-model="container.fontSize" :step="1" size="sm" />
          </div>
        </div>
        <!-- 纸张大小 -->
        <div class="flex flex-col space-y-1">
          <div class="font-semibold text-sm">{{ t('print.size.paper.title') }} (mm)</div>
          <div class="flex items-center gap-2">
            <span class="text-xs w-16">{{ t('print.size.paper.long') }}(mm):</span>
            <XInputNumber v-model="container.height" :step="1" size="sm" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs w-16">{{ t('print.size.paper.width') }}(mm):</span>
            <XInputNumber v-model="container.width" :step="1" size="sm" />
          </div>
        </div>
        <!-- 内边距设置 -->
        <div class="flex flex-col space-y-1">
          <div class="font-semibold text-sm">{{ t('print.size.padding.title') }} (mm)</div>
          <div class="flex items-center gap-2">
            <span class="text-xs w-16">{{ t('print.size.padding.top') }}(mm):</span>
            <XInputNumber v-model="container.padding.top" :step="1" size="sm" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs w-16">{{ t('print.size.padding.bottom') }}(mm):</span>
            <XInputNumber v-model="container.padding.bottom" :step="1" size="sm" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs w-16">{{ t('print.size.padding.left') }}(mm):</span>
            <XInputNumber v-model="container.padding.left" :step="1" size="sm" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs w-16">{{ t('print.size.padding.right') }}(mm):</span>
            <XInputNumber v-model="container.padding.right" :step="1" size="sm" />
          </div>
        </div>
      </div>

      <div class="max-h-full border rounded-md p-3 space-y-3 bg-muted/30 overflow-y-auto">
        <div class="font-semibold text-sm flex items-center gap-2">
          {{ t('print.fields.config.title') }}
          <span class="text-xs text-muted-foreground">
            ({{ t('print.fields.config.tip') }})
          </span>
        </div>

        <div class="space-y-2">
          <div
            v-for="field in templateItems"
            :key="field.key"
            class="flex items-center justify-between gap-3 text-sm px-2 py-1 rounded hover:bg-muted transition"
          >
            <div class="flex items-center gap-2 min-w-0">
              <span class="w-32 truncate font-medium text-foreground">
                {{ field.label }}
              </span>
              <span class="text-xs text-muted-foreground">
                {{ isQrcodeField(field.key)
                  ? `${t('print.size.qrcode.title')}(mm)${t('print.size.qrcode.limitHit')}`
                  : (field.wrap ? t('print.fields.config.wrap') : t('print.fields.config.nowrap')) }}
              </span>
            </div>

            <div class="flex items-center">
              <div v-if="!isQrcodeField(field.key)" class="mr-4">
                <label class="flex items-center gap-3 cursor-pointer select-none">
                  <input type="checkbox" class="peer sr-only" v-model="field.wrap" />
                  <div
                    class="relative w-9 h-5 rounded-full bg-border
                           peer-checked:bg-primary
                           transition-colors flex"
                  >
                    <XSwitch v-model="field.wrap" @change="updateOverflowMap" />
                  </div>
                </label>
              </div>
  
              <div v-else class="flex items-center gap-2 mr-2">
                <XInputNumber v-model="field.size!" size="sm" class="w-20" :min="20" @change="updateOverflowMap" />
              </div>
  
              <button class="hover:text-success" @click="handleSelectColumn(field.key)">
                <Icon icon="lucide:trash-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="flex justify-between space-x-2">
          <XButton class="flex-1" :label="t('print.button.template.export')" color="success" @click="exportTemplate" />
          <XButton color="warning" class="flex-1" :label="t('print.button.template.import')" @click="openImport" />
          <!-- <XButton class="flex-1" :label="t('print.button.submit')" @click="handleSubmit" /> -->
        </div>

        <div class="flex items-center justify-end space-x-2">
          <div class="flex items-center gap-2">
            <!-- <label class="flex items-center group relative">
              <XSwitch :label="t('print.button.autoprint.label')" v-model="autoPrint" />
              <span class="absolute opacity-0 group-hover:opacity-100 bg-card rounded top-8 left-1 text-sm p-2">{{ t('print.button.autoprint.tip') }}</span>
            </label> -->
            <!-- <XButton :label="t('print.button.showres')" @click="readOrderResult" /> -->
            <!-- <XButton :label="t('print.button.print')" color="warning" @click="generatePDF" /> -->
          </div>
        </div>

        <!-- <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <span class="flex-1 h-px bg-zinc-500"></span>
          <span>{{ t('print.prompt.filterFailed') }}</span>
          <span class="flex-1 h-px bg-zinc-500"></span>
        </div> -->
      </div>

      <div class="grid grid-cols-3 gap-2">
        <template v-for="[_, phone] in deviceMap">
          <div class="p-4 bg-card border rounded hover:shadow transition-all duration-200 cursor-pointer"
            @click="handleClickPhone(phone.info.InternationalMobileEquipmentIdentity)">
            <div class="mb-4">
              <div class="flex items-center justify-between mb-1">
                <h3>{{ phone.product.Name }}</h3>
              </div>
              <div class="text-sm text-muted-foreground">
                <p>{{ t('device.card.serial') }}: {{ phone.info.SerialNumber }}</p>
                <p>imei: {{ phone.info.InternationalMobileEquipmentIdentity }}</p>
                <p>{{ t('device.card.type') }}: {{ phone.info.ModelNumber }} {{ phone.info.RegionInfo }}</p>
              </div>
            </div>
          </div>
        </template>
      </div>
    </section>

    <section class="flex-1 flex flex-col items-center gap-y-4">
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
          class="absolute cursor-move select-none template-item text-black"
          :class="{ 'overflow-warning': isOverflowMap[item.key] }"
          :style="{ left: item.x + 'px', top: item.y + 'px', maxWidth: '100%' }"
          @mousedown.prevent
          @mousedown="startDrag($event, item)"
          :data-key="item.key"
        >
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
              <span class="ml-1 break-all template-value">{{ typeof previewValue === "string" ? previewValue : stripHtmlTags(previewValue[item.key]) }}</span>
            </template>
          </template>

          <template v-else>
            <div data-qrcode>
              <QrPreview
                :data="qrcodeStr(previewValue)"
                :size="item.size ?? 25" />
            </div>
          </template>
        </div>
      </div>

      <div class="max-h-full overflow-y-auto flex flex-wrap gap-2">
        <template v-for="order in customOrders" :key="`${order.id}-${order.imei}`">
          <OrderCard :order="order" />
        </template>
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
