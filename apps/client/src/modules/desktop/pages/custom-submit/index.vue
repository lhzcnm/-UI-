<script setup lang="ts">
import { Icon } from '@iconify/vue'
import SelectService from './components/SelectService.vue'
import OrderCard from './components/OrderCard.vue'

import axios from 'axios'
import { hashPrintHeader, ORDER_STATUS, ua, xconfirm, textAlign } from '@3un/utils'
import * as html2image from 'html-to-image'
import jsPDF from 'jspdf'
import { toast } from 'vue-sonner'
import { useThrottleFn, watchOnce } from '@vueuse/core'
import JsBarcode from 'jsbarcode'
import QRCode from 'qrcode'

import type { ContainerItem, PrintHeader, PrintTemplateJson, TemplateItem } from '@/types'
import { getSubmitImei, mmToPt, mmToPx, pxTomm } from '@/utils'
import { serviceApi, type FieldMap, type ServiceDetail, type ServiceHeader } from '@/api/services'
import { orderApi, type CustomSubmitOrder, type FieldValue, type Order, type OrderSubmitParams, type OrderSubmitResult, type ServiceColumnItem } from '@/api/orders'
import { checkPlugin, deviceMap, handleDevice, handleDisconnect, ws, hasNewVersion, hasNotPlugin } from "./utils/useDevice"
import type { DeviceResponse } from '@/types/device'
import type { PageItem, PluginPdfRequest } from '@/types/print'

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
  orientation: 'portrait',
})
const isOverflowMap = reactive<Record<string, boolean>>({})

const resultCol = hashPrintHeader("处理结果")
const orderResultCol = hashPrintHeader("订单结果")
const qrcodeCol = hashPrintHeader("二维码")

const selectCols = ref<string[]>([])
const templateItems = ref<TemplateItem[]>([])
const serviceCols = ref<PrintHeader[]>([])
const generating = ref<boolean>(false)
const serviceId = ref<number>(0)
const queryServices = ref<ServiceDetail[]>([])
const strImeis = ref<string>('')
const customOrders = ref<CustomSubmitOrder[]>([])
const autoPrint = ref<boolean>(false)
const count = ref<number>(0)
const selectOrder = ref<CustomSubmitOrder>()

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
    key: qrcodeCol,
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
const splitOptions = [
  { label: 'Windows', command: () => handleDownload(43) },
  { label: 'MacOS Arm', command: () => handleDownload(44) },
  { label: 'MacOS Intel', command: () => handleDownload(45) },
]
const directionOptions: { value: 'portrait' | 'landscape', label: string }[] = [
  { value: 'portrait', label: t('print.direction.portrait') },
  { value: 'landscape', label: t('print.direction.landscape') },
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

watch(
  () => templateItems.value,
  () => {
    updateAlignPosition()
  },
  {
    deep: true,
  }
)

const isEn = computed(() => locale.value === "en")

const processedColumns = computed(() => (
  serviceCols.value.map(item => ({
    key: item.key,
    label: isEn.value ? item.nameEn : item.name,
    type: item.type
  }))
))

const currentService = computed(() => services.get(serviceId.value))

const validImeis = computed(() => {
  if (!currentService.value) return []
  return getSubmitImei(strImeis.value, currentService.value.imeiType)
})

const orderStat = computed(() => ({
  success: customOrders.value.filter(o => o.status === ORDER_STATUS.SUCCESS).length,
  failed: customOrders.value.filter(o => o.status === ORDER_STATUS.FAILED).length,
}))

const paperStyle = computed(() => {
  const isLandscape = container.orientation === 'landscape'

  const width = isLandscape ? container.height : container.width
  const height = isLandscape ? container.width : container.height

  return {
    width: `${mmToPx(width)}px`,
    height: `${mmToPx(height)}px`,
    padding: `${mmToPx(container.padding.top)}px
      ${mmToPx(container.padding.right)}px
      ${mmToPx(container.padding.bottom)}px
      ${mmToPx(container.padding.left)}px`,
    fontSize: `${mmToPx(container.fontSize)}px`
  }
})

const safeAreaStyle = computed(() => {
  const isLandscape = container.orientation === 'landscape'

  const width = isLandscape ? container.height : container.width
  const height = isLandscape ? container.width : container.height

  const { padding } = container

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

  if (selectOrder.value) {
    order = selectOrder.value
  }

  let res: Record<string, string> = {}

  for (let item of processedColumns.value) {
    const field = order?.fields[item.key] || ''

    if (resultCol === item.key) {
      res[resultCol] = order?.result || "{value}"
    } else {
      res[item.key] = field && field.value !== "" ? field.value : "{value}"
    }
  }
  res[hashPrintHeader("imei")] = order?.imei || "{value}"
  res[orderResultCol] = order?.result || "{value}"
  res['result'] = order?.result || "{value}"

  return res
})

const previewQrcode = computed(() => getPreviewQrcode())

function handleSelectColumn(id: string, type: "text" | "qrcode" | "barcode" = 'text') {
  const index = selectCols.value.indexOf(id)

  if (index !== -1) {
    selectCols.value.splice(index, 1)
    templateItems.value = templateItems.value.filter(i => i.key !== id)
  } else {
    // const isQrcode = id === 'qrcode'
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
      size: (type === 'barcode' ? 5 : 10),
      showField: true,
    }

    selectCols.value.push(id)
    templateItems.value.push(newItem)
  }
}

function getNextItemPosition() {
  const baseX = mmToPx(container.padding.left)
  const baseY = mmToPx(container.padding.top)
  const gap = -6

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

async function exportTemplate() {
  if (templateItems.value.length === 0) {
    if (!await xconfirm(t('print.prompt.export.noField'))) return
  }
  if (Object.values(isOverflowMap).some(Boolean)) {
    if (!await xconfirm(t('print.prompt.export.overflow'))) return
  }

  const template: PrintTemplateJson = {
    serviceId: serviceId.value,

    paper: {
      width: container.width,
      height: container.height,
      padding: { ...container.padding },
      fontSize: container.fontSize,
      orientation: container.orientation,
    },
    items: templateItems.value.map(item => ({
      key: item.key,
      label: item.label,
      label_local: item.label_local,
      align: item.align ?? "left",
      x: item.x,
      y: item.y,
      wrap: item.wrap,
      type: item.type,
      size: item.size,
      showField: item.showField,
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
  if (currentServiceId !== 0 && template.serviceId !== currentServiceId) {
    return toast.warning(t('print.prompt.import.serviceNotMatch'))
  }

  handleSelected(template.serviceId!)

  container.width = template.paper.width
  container.height = template.paper.height
  container.fontSize = template.paper.fontSize
  container.padding.top = template.paper.padding.top
  container.padding.right = template.paper.padding.right
  container.padding.bottom = template.paper.padding.bottom
  container.padding.left = template.paper.padding.left
  container.orientation = template.paper.orientation

  templateItems.value = template.items.map(item => ({ ...item,  align: item.align ?? "left", showField: item.showField ?? true }))

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

function stripHtmlTags(html: string) {
  if (!html) return ''
  return html.replace(/<[^>]+>/g, '')
}

function qrcodeStr(object: Record<string, string> | string | FieldValue) {
  const data = objectToString(object)
  return data
  // return `${origin}/qrcode-result?data=${encodeURIComponent(data)}`
}

function objectToString(object: Record<string, string> | string | FieldValue) {
  return Object.entries(object)
    .map(([key, field]) => {
      const isQrcode = (/^(二维码|qrcode)$/i).test(key)
      if (isQrcode) return
      if (!selectCols.value.includes(key)) return

      if (typeof field === 'string') {
        return `${key}: ${stripHtmlTags(field)}`
      }

      if (typeof field === 'object') {
        return `${field.title}: ${stripHtmlTags(field.value)}`
      }

      return undefined
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
    headerKey = data.map(h => h.name)
  }

  serviceCols.value = [...defaultItems, ...serviceHeader.map(h =>  ({
      key: hashPrintHeader(h.name),
      name: h.name,
      nameEn: h.nameEn ? h.nameEn : h.name,
      type: "text"
    }) as PrintHeader
  )]
}

async function getQueryService() {
  const { data } = await serviceApi.list({ isUnlock: false })
  queryServices.value = data
}

async function handleSelected(value: number) {
  if (value) {
    submited = false
    serviceId.value = value
    close()
    templateItems.value.length = 0
    selectCols.value.length = 0
    customOrders.value.length = 0
    await getServiceColumns(value)

    const defaultTemplates = await getServiceDefaultTemplate(value)

    if (defaultTemplates) {
      processDefaultTemplate(defaultTemplates)
    }
  }
}

async function getServiceDefaultTemplate(id: number) {
  const { data } = await serviceApi.getTemplate(id)
  return data
}

function processDefaultTemplate(jsonStr: string) {
  if (jsonStr === '') return

  const template = JSON.parse(jsonStr) as PrintTemplateJson

  container.width = template.paper.width
  container.height = template.paper.height
  container.fontSize = template.paper.fontSize
  container.padding.top = template.paper.padding.top
  container.padding.right = template.paper.padding.right
  container.padding.bottom = template.paper.padding.bottom
  container.padding.left = template.paper.padding.left

  templateItems.value = template.items.map(item => ({ ...item, showField: item.showField ?? true }))

  selectCols.value = template.items.map(item => item.key)
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
  if (!currentService.value) return toast.warning(t('query.prompt.serviveNull'))
  if (submited) return toast.warning(t('query.prompt.repeat'))

  const imeis = getSubmitImei(strImeis.value, currentService.value.imeiType)

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

    count.value = data.filter(o => o.status === ORDER_STATUS.PROCESSING).length
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

async function handleCount() {
  count.value--

  if (count.value === 0) {
    if (autoPrint.value) {
      await handleGenerate()
    }
    return close()
  }
}

async function dispatchWsMessage(str: string) {
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
  
  await nextTick()
  updateAlignPosition()
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
  const result: FieldValue = {}
  const items = content.split('<br>')

  const keyMap = getFieldsMap(serviceHeaders.map(i => ({ name: i.name, nameEn: i.nameEn })))

  if (items.length === 1 && serviceHeaders.length === 1) {
    const key = headerKey[0]
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

  const isSuccess = judgeOrderStatus(serviceHeaders, items)

  if (!isSuccess) {
    result[hashPrintHeader(headerKey[0])] = {
      title: headerKey[0],
      value: content,
    }
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

async function 
handleGenerate() {
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

  paperRef.value.classList.add("printing")
  await nextTick()

  try {
    generating.value = true
    await pluginGeneratePdf()
  } catch {
    try {
      await generatePDF()
    } catch(err) {
      console.error(err)
      toast.warning(t('print.prompt.pdf.error'))
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
      fontSize: mmToPt(container.fontSize),
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
        value: qrcodeStr({ ...order.fields, [hashPrintHeader("imei")]: {title: "IMEI", value: order.imei} }),
      })
      continue
    } else if (template.type === 'barcode') {
      pageItems.push({
        ...template,
        showField: true,
        x: pxTomm(template.x),
        y: pxTomm(template.y),
        value: order.imei,
      })
      continue
    }
    pageItems.push({
      ...template,
      label: isEn.value ? template.label_local : template.label,
      showField: template.showField ?? true,
      x: pxTomm(template.x),
      y: pxTomm(template.y),
      value: key === hashPrintHeader("imei")
        ? stripHtmlTags(order.imei) || ""
        : stripHtmlTags(order.fields[key] ? order.fields[key].value : '') ?? '',
      align: template.align ? template.align : 'left',
    })
  }

  return pageItems
}

async function pluginGeneratePdf() {
  const body = processRequestParams()

  const { data } = await axios.post(
    "http://localhost:9999/generate-pdf",
    body,
    { responseType: "blob", headers: {'x-token': Date.now().toString(16)}, timeout: 10000 },
  )

  const url = URL.createObjectURL(data)
  window.open(url)

  URL.revokeObjectURL(url)
}

async function generatePDF() {
  const pdf = new jsPDF({
    orientation: container.orientation,
    unit: "px",
    format: [mmToPx(container.width), mmToPx(container.height)],
  })

  for (let i = 0; i < customOrders.value.length; i++) {
    const order = customOrders.value[i]

    if (order.status === ORDER_STATUS.FAILED) continue

    const page = paperRef.value!.cloneNode(true) as HTMLElement
    document.body.appendChild(page)

    const items = Array.from(page.querySelectorAll<HTMLElement>('.template-item'))

    for (const itemEl of items) {
      const key = itemEl.dataset.key!

      const template = templateItems.value.find(t => t.key === key)
      if (!template) continue
      
      if (template.type === 'qrcode') {
        const content = qrcodeStr({ ...order.fields, IMEI: order.imei })
        
        const canvas = document.createElement('canvas')
        await QRCode.toCanvas(canvas, content, {
          margin: 1,
          scale: 4,
          errorCorrectionLevel: "M",
        })

        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'))

        if (blob) {
          const url = URL.createObjectURL(blob)
          storageUrl.push(url)

          const img = document.createElement('img')
          const imageLoadPromise = new Promise<void>((resolve, reject) => {
            img.onload = () => resolve()
            img.onerror = () => reject(new Error(t('print.prompt.pdf.imgError')))
            img.src = url
          })

          img.width = mmToPx(template.size ?? 20)
          img.height = mmToPx(template.size ?? 20)

          const container = itemEl.querySelector('[data-qrcode]')
          if (container) {
            container.innerHTML = ''
            container.appendChild(img)

            await imageLoadPromise
          }
        }
      } else if (template.type === 'barcode') {
        const canvas = document.createElement('canvas')
        
        JsBarcode(canvas, order.imei, {
          format: "CODE128",
          width: mmToPx(template.size! * 0.06),
          height: mmToPx(template.size! * 1.2),
          displayValue: true,
          fontSize: mmToPx(template.size!),
        })
        
        await new Promise(resolve => {
          requestAnimationFrame(() => {
            requestAnimationFrame(resolve)
          })
        })

        const blobPromise = new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"))
        const blob = await blobPromise

        if (blob) {
          const url = URL.createObjectURL(blob)
          storageUrl.push(url)

          const img = document.createElement('img')

          img.setAttribute('data-order-barcode', Date.now().toString(12))

          const imageLoadPromise = new Promise<void>((resolve, reject) => {
            img.onload = () => resolve()
            img.onerror = () => reject(new Error(t('print.prompt.pdf.imgError')))
            img.src = url
          })

          const container = itemEl.querySelector('[data-barcode]')
          if (container) {
            container.innerHTML = ''
            container.appendChild(img)

            await imageLoadPromise

            await new Promise(resolve => {
              requestAnimationFrame(() => {
                requestAnimationFrame(resolve)
              })
            })
          }
        }
      } else {
        const value = key === hashPrintHeader('imei')
          ? order.imei || ""
          : order.fields[key].value ?? ""
        
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

  paperRef.value!.classList.remove("printing")
  pdf.autoPrint({ variant: "non-conform" })
  window.open(pdf.output("bloburi"), "_blank")
}

function handleSelectedOrder(order: CustomSubmitOrder) {
  if (order.status !== ORDER_STATUS.SUCCESS) return

  selectOrder.value = order
}

function getPreviewQrcode() {
  const order = customOrders.value.find(o => o.status === ORDER_STATUS.SUCCESS)
  if (!order) return ''

  return qrcodeStr({ ...order.fields, [hashPrintHeader("imei")]: {title: "IMEI", value: order.imei} })
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

    if (item.align === 'center' || item.align === 'right') {
      applyAlign(item.key, item.align ?? "left")
    }
  })
}

const handleDownload = useThrottleFn(
  (id?: number) => {
    const baseUrl = import.meta.env.VITE_API_URL
    let platform = id

    if (id === undefined) {
      const options = { Windows: 43, MacOS: 44 }
      platform = options[ua.os as keyof typeof options]
    }

    location.href = `${baseUrl}/oss/download/${platform}`
  },
  2000
)

async function handleTemplateChange(key: string) {
  const index = templateItems.value.findIndex(t => t.key === key)
  if (index === -1) return

  templateItems.value[index].showField = !templateItems.value[index].showField
  await nextTick()
  updateAlignPosition()
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

await Promise.all([
  getServices(),
  getQueryService(),
  await checkPlugin(t),
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

      <div class="flex flex-col gap-y-2">
        <PluginTip />
        <div class="flex items-center justify-end gap-2">
          <label class="flex items-center group relative">
            <XSwitch :label="t('print.button.autoprint.label')" v-model="autoPrint" />
            <!-- <span class="absolute opacity-0 group-hover:opacity-100 bg-card rounded top-8 left-1 text-sm p-2">{{ t('print.button.autoprint.tip') }}</span> -->
          </label>
          <XButton color="success" :label="t('print.button.submit')" @click="handleSubmit" />
          <XButton :label="t('print.button.showres')" @click="readOrderResult" />
          <XButton :label="t('print.button.print')" color="warning" @click="handleGenerate" />
        </div>
      </div>

      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <span class="flex-1 h-px bg-zinc-500"></span>
        <span>{{ t('print.prompt.filterFailed') }}</span>
        <span class="flex-1 h-px bg-zinc-500"></span>
      </div>

      <div class="border p-2 space-y-1">
        <div class="font-bold text-sm">{{ t('print.fields.title') }}</div>
        <div class="flex flex-wrap gap-2">
          <template v-for="column in processedColumns" :key="column.key">
            <HeaderTag :id="column.key" :label="column.label" :type="column.type"
              :checked="selectCols.includes(column.key)"
              @click="handleSelectColumn" />
          </template>
        </div>
      </div>
      
      <div class="grid grid-cols-3 gap-4 p-2 rounded-md border border-border shadow-sm">
        <div class="flex flex-col space-y-4">
          <!-- 字体大小 -->
          <div class="flex flex-col gap-1">
            <div class="font-semibold text-sm">{{ t('print.size.font') }} (mm):</div>
            <div class="flex items-center gap-2 w-40">
              <XInputNumber v-model="container.fontSize" :step="1" size="sm" @change="handleContainerChange" />
            </div>
          </div>

          <!-- 纸张方向 -->
          <div>
            <div class="font-semibold text-sm">{{ t('print.direction.title') }}</div>
            <div class="flex items-center gap-4 text-sm">
              <template v-for="option in directionOptions" :key="option.value">
                <button class="flex items-center gap-1 text-lg"
                  :class="{ 'text-primary': option.value === container.orientation }"
                  @click="container.orientation = option.value">
                  <Icon icon="solar:smartphone-linear" :rotate="option.value === 'landscape' ? 45 : 0" />
                  <span>{{ option.label }}</span>
                </button>
              </template>
            </div>
          </div>
        </div>
        
        <!-- 纸张大小 -->
        <div class="flex flex-col space-y-1">
          <div class="font-semibold text-sm">{{ t('print.size.paper.title') }} (mm)</div>
          <div class="flex items-center gap-2">
            <span class="text-xs w-16">{{ t('print.size.paper.long') }}(mm):</span>
            <XInputNumber v-model="container.height" :step="1" size="sm" @change="handleContainerChange" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs w-16">{{ t('print.size.paper.width') }}(mm):</span>
            <XInputNumber v-model="container.width" :step="1" size="sm" @change="handleContainerChange" />
          </div>
        </div>
        <!-- 内边距设置 -->
        <div class="flex flex-col space-y-1">
          <div class="font-semibold text-sm">{{ t('print.size.padding.title') }} (mm)</div>
          <div class="flex items-center gap-2">
            <span class="text-xs w-16">{{ t('print.size.padding.top') }}(mm):</span>
            <XInputNumber v-model="container.padding.top" :step="1" size="sm" @change="handleContainerChange" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs w-16">{{ t('print.size.padding.bottom') }}(mm):</span>
            <XInputNumber v-model="container.padding.bottom" :step="1" size="sm" @change="handleContainerChange" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs w-16">{{ t('print.size.padding.left') }}(mm):</span>
            <XInputNumber v-model="container.padding.left" :step="1" size="sm" @change="handleContainerChange" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs w-16">{{ t('print.size.padding.right') }}(mm):</span>
            <XInputNumber v-model="container.padding.right" :step="1" size="sm" @change="handleContainerChange" />
          </div>
        </div>
      </div>

      <div class="min-h-56 max-h-full border rounded-md p-3 space-y-3 bg-muted/30 overflow-y-auto">
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
                {{ isEn ? field.label_local : field.label }}
              </span>
              <span class="text-xs text-muted-foreground">
                {{ isQrcodeField(field.type)
                  ? `${t('print.size.qrcode.title')}(mm)${t('print.size.qrcode.limitHit')}`
                  : (field.wrap ? t('print.fields.config.wrap') : t('print.fields.config.nowrap')) }}
              </span>
            </div>

            <div class="flex items-center gap-4">
              <div v-if="field.type === 'text'" class="flex items-center gap-2">
                <template v-for="alignItem in textAlign" :key="alignItem.key">
                  <button class="hover:bg-zinc-50 dark:hover:bg-zinc-800" @click="applyAlign(field.key, alignItem.key)"
                    :title="isEn ? alignItem.labelLocal : alignItem.label">
                    <Icon :icon="alignItem.icon" />
                  </button>
                </template>
              </div>
              <div v-if="field.type === 'text'" class="flex gap-2">
                <button class="flex items-center gap-2" @click="handleTemplateChange(field.key)">
                  <Icon icon="lucide:eye" v-if="field.showField" />
                  <Icon icon="lucide:eye-closed" v-else />
                  <span>{{ field.showField ? t('print.fields.config.showLabel') : t('print.fields.config.showContent') }}</span>
                </button>
                <label class="flex items-center gap-3 cursor-pointer select-none">
                  <input type="checkbox" class="peer sr-only" v-model="field.wrap" />
                  <div
                    class="relative w-9 h-5 rounded-full bg-border 
                           peer-checked:bg-primary
                           transition-colors flex"
                  >
                    <XSwitch v-model="field.wrap" @change="handleWrapChange(field.key)" />
                  </div>
                </label>
              </div>
  
              <div v-else class="flex items-center gap-2 mr-2">
                <XInputNumber v-model="field.size!" size="sm" class="w-20" :min="1" @change="updateOverflowMap" />
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
        </div>
      </div>

      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <span class="flex-1 h-px bg-zinc-500"></span>
        <span>{{ t('print.device.module') }}</span>
        <span class="flex-1 h-px bg-zinc-500"></span>
      </div>

      <template v-if="hasNotPlugin">
        <div class="h-36 bg-card flex items-center justify-center rounded-md text-muted-foreground">
          <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <span class="flex-1 h-px bg-zinc-500"></span>
          <div class="flex items-center gap-2">
            <span>{{ t('print.device.download') }}</span>
            <XButtonSplit
              :label="t('device.button.download')" :options="splitOptions"
              size="sm" :openClick="true"
            />
            <XButton size="sm" :label="t('button.fresh')" @click="$router.go(0)" />
          </div>
          <span class="flex-1 h-px bg-zinc-500"></span>
        </div>
          
        </div>
      </template>
      <template v-else-if="deviceMap.size === 0">
        <div class="h-36 bg-card flex items-center justify-center rounded-md text-muted-foreground">
          {{ t('print.device.noDevice') }}
        </div>
      </template>
      <template v-else>
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
      </template>

      <template v-if="!hasNotPlugin && hasNewVersion">
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <span class="flex-1 h-px bg-zinc-500"></span>
          <div class="flex items-center gap-2">
            <span>{{ t('print.device.hasUpdate') }}</span>
            <XButtonSplit
              :label="t('device.button.download')" :options="splitOptions"
              size="sm" :openClick="true"
            />
            <XButton size="sm" :label="t('button.fresh')" @click="$router.go(0)" />
          </div>
          <span class="flex-1 h-px bg-zinc-500"></span>
        </div>
      </template>
    </section>

    <section class="flex-1 flex flex-col items-center gap-y-4">
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <span class="flex-1 h-px bg-zinc-500"></span>
        <span>{{ t('print.paper.title') }}</span>
        <span class="flex-1 h-px bg-zinc-500"></span>
      </div>

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
          :style="{ left: item.x + 'px', top: item.y + 'px', maxWidth: '100%',  }"
          @mousedown.prevent="startDrag($event, item)"
          :data-key="item.key"
        >
          <template v-if="item.type === 'text'">
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
              <BarcodePreview :data="previewValue[hashPrintHeader('imei')]" :size="item.size ?? 20" />
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

      <div class="w-full flex items-center gap-4 text-sm">
        <span class="flex-1 h-px bg-border"></span>
        <span class="">{{ t('print.paper.preview') }}</span>
        <span class="flex-1 h-px bg-border"></span>
      </div>

      <div class="flex-1 overflow-y-auto flex">
        <div class="flex gap-2 flex-wrap">
          <template v-for="order in customOrders" :key="`${order.id}-${order.imei}`">
            <OrderCard :order="order" @click="handleSelectedOrder" />
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

.printing .overflow-warning {
  outline: none;
  background: transparent;
}

.template-item .template-value {
  word-break: break-word;
  white-space: pre-wrap;
}
</style>
