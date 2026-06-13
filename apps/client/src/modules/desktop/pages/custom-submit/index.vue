<script setup lang="ts">
import { Icon } from '@iconify/vue'
import OrderCard from './components/OrderCard.vue'
import SelectService from './components/SelectService.vue'
import PaperConfig from '@desktop/components/print/PaperConfig.vue'
import HeaderTagConfig from '@desktop/components/print/HeaderTagConfig.vue'
import SelectHeader from '@desktop/components/print/SelectHeader.vue'
import LabelCreate from '@desktop/components/print/LabelCreate.vue'

import axios from 'axios'
import { hashPrintHeader, ORDER_STATUS, ua, xconfirm, textAlign } from '@3un/utils'
import { toast } from 'vue-sonner'
import { useThrottleFn, watchOnce } from '@vueuse/core'

import type { LabelCreateForm, PrintHeader, PrintTemplateJson, TemplateItem, TemplateType } from '@/types'
import { filterNumber, getSubmitImei, handleInputChange, mmToPx, openIframe, ptToPx, pxTomm, readTemplateFile, stripHtmlTags } from '@/utils'
import { serviceApi, type FieldMap, type Service, type ServiceDetail, type ServiceHeader } from '@/api/services'
import { orderApi, type CustomSubmitOrder, type FieldValue, type Order, type OrderSubmitParams, type OrderSubmitResult, type ServiceColumnItem } from '@/api/orders'
import { LAYOUT_POSITION, type PageItem, type PluginPdfRequest } from '@/types/print'
import { checkVersion, hasNewVersion } from '@/utils/device'
import usePrinter from '@/composable/print'
import type { DeviceMapItem } from '@/types/device'
import { generatePDF } from '@/utils/print'
import { getLanuagestring } from '@/utils/constant'

const deviceStore = useDeviceStore()
const { services, getServices } = useServiceStore()
const { locale } = useI18n()
const localStore = useLocalStore()
const { connect, close } = useWsStore()
const { updateCredit } = useUserStore()
const iStore = useSystemStore()

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

const serviceId = ref<number>(0)
const queryServices = ref<ServiceDetail[]>([])
const strImeis = ref<string>('')
const customOrders = ref<CustomSubmitOrder[]>([])
const autoPrint = ref<boolean>(false)
const count = ref<number>(0)
const selectOrder = ref<CustomSubmitOrder>()
const hasDeviceSn = ref<boolean>(false)
const visibleCreateLabel = ref<boolean>(false)
const deviceServices = ref<Service[]>([])

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

const deviceFields: PrintHeader[] = [
  {
    key: 'device_version',
    name: '版本',
    nameEn: 'IOS version',
    type: 'device'
  },
  {
    key: 'device_model',
    name: '型号',
    nameEn: 'Device Model',
    type: 'device',
  },
  {
    key: 'device_country',
    name: '销售地区',
    nameEn: 'Country',
    type: 'device',
  },
  {
    key: 'product_type',
    name: '产品类型',
    nameEn: 'Product Type',
    type: 'device',
  },
]

const resultCol = hashPrintHeader("处理结果")
const orderResultCol = hashPrintHeader("订单结果")

const splitOptions = [
  { label: 'Windows', command: () => handleDownload(43) },
  { label: 'MacOS Arm', command: () => handleDownload(44) },
  { label: 'MacOS Intel', command: () => handleDownload(45) },
]

let serviceHeaders: ServiceHeader[] = []
let headerKey: string[] = []
let submited: boolean = false
let pluginRunning: boolean = false
let deviceItems: DeviceMapItem[] = []

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
  () => deviceStore.deviceMap,
  () => deviceItems = Array.from(deviceStore.deviceMap.values()),
  { immediate: true }
)

const currentService = computed(() => services.get(serviceId.value))

const validImeis = computed(() => {
  if (!currentService.value) return []
  return getSubmitImei(strImeis.value, currentService.value.imeiType)
})

const orderStat = computed(() => ({
  success: customOrders.value.filter(o => o.status === ORDER_STATUS.SUCCESS).length,
  failed: customOrders.value.filter(o => o.status === ORDER_STATUS.FAILED).length,
}))

const previewValue = computed(() => {
  const res: Record<string, string> = {}
  const customLabelVals = customLabels.value

  for (const key of Object.keys(customLabelVals)) {
    res[key] = customLabelVals[key].value
  }

  const order = selectOrder.value || customOrders.value.find(o => o.status === ORDER_STATUS.SUCCESS)
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

const previceDeviceItem = computed(() => {
  let imeiList: string[] = []
  if (strImeis.value) {
    imeiList = strImeis.value.split('\n')

  } else {
    imeiList = customOrders.value.map(o => o.imei)
  }

  const deviceImeis = deviceItems.map(d => d.info.InternationalMobileEquipmentIdentity)

  if (!imeiList.some(i => deviceImeis.includes(i))) {
    return '{value}'
    // return deviceItems.find(d => d.info.InternationalMobileEquipmentIdentity === imeiList.find(i => deviceImeis.includes(i)))
  }

  const deviceItem = deviceItems.find(d => d.info.InternationalMobileEquipmentIdentity === imeiList.find(i => deviceImeis.includes(i)))

  let res: Record<string, string> = {}
  res['device_version'] = deviceItem ? `${deviceItem.summary.ProductVersion} ${deviceItem.summary.BuildVersion}` : '{value}'
  res['device_model'] = deviceItem ? `${deviceItem.info.ModelNumber} ${deviceItem.info.RegionInfo}` : '{value}'
  res['device_country'] = deviceItem ? isEn.value ? deviceItem.summary.SalesRegion.english : deviceItem.summary.SalesRegion.chinese : '{value}'
  res['product_type'] = deviceItem ? deviceItem.summary.ProductType : '{value}'

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

function handleSelectColumn(id: string, type: TemplateType = 'text') {
  if (type === 'Function') {
    handleFieldFunction(id)
    return
  }
  
  const index = selectCols.value.indexOf(id)

  if (index !== -1) {
    selectCols.value.splice(index, 1)
    templateItems.value = templateItems.value.filter(i => i.key !== id)
  } else {
    // const isQrcode = id === 'qrcode'
    const pos = getNextItemPosition()
    const field = serviceCols.value.find(c => c.key === id) || deviceFields.find(d => d.key === id)
    if (!field) return

    const newItem: TemplateItem = {
      key: id,
      label: field.name,
      label_local: field.nameEn,
      x: pos.x,
      y: pos.y,
      wrap: false,
      type: type,
      size: isTextField(type) || type === 'device' ? 8 : (type === 'barcode' ? 5 : 15),
      showField: false,
      barcodeWidth: 2,
      align: itemAlign.value ?? undefined,
    }

    selectCols.value.push(id)
    templateItems.value.push(newItem)
  }
}

function handleFieldFunction(id: string) {
  switch (id) {
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

async function exportTemplate() {
  if (templateItems.value.length === 0) {
    if (!await xconfirm(localStore.localData['print_NoFieldsExport_Toast'])) return
  }
  if (Object.values(isOverflowMap).some(Boolean)) {
    if (!await xconfirm(localStore.localData['print_SomeFieldsExceed_Toast'])) return
  }

  await saveTemplate(
    "template",
    serviceId.value,
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
    toast.warning(localStore.localData['print_ModuleService_Toast'])
    uploadRef.value.value = ''
  }

  await importTemplateFile(file)
  uploadRef.value.value = ''
}

async function importTemplateFile(file: File) {
  const template = await readTemplateFile(file)

  const currentServiceId = serviceId.value
  if (currentServiceId !== 0 && template.serviceId !== currentServiceId) {
    return toast.warning(localStore.localData['print_ModuleService_Toast'])
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

  serviceCols.value = [...defaultItems, ...serviceHeader.map(h => ({
    key: hashPrintHeader(h.name),
    name: h.name,
    nameEn: h.nameEn ? h.nameEn : h.name,
    type: "text"
  }) as PrintHeader
  ), ...functionItems]

  initQrField()
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

    await getServiceDefaultTemplate(value)
  }
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

    // Object.entries(customLabels.value)
    //   .map(([_, value]) => {
    //     handleCustomCreate(value)
    //   })
  } catch {}
}

function handleClickPhone(imei: string, isNormal: boolean = true) {
  if (isNormal) {
    hasDeviceSn.value = true
  }

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
  if (serviceId.value === 0) return toast.warning(localStore.localData['print_PleaseSelectService_Toast'])
  if (!currentService.value) return toast.warning(localStore.localData['print_PleaseSelectService_Toast'])
  if (submited) return toast.warning(localStore.localData['print_NotSubmitRepeatedly_Toast'])

  const imeis = getSubmitImei(strImeis.value, currentService.value.imeiType)

  customOrders.value = []
  customOrders.value = processSubmitOrder(imeis)

  if (imeis.length === 0) return toast.warning(localStore.localData['print_NotRecongnized'])

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
        // console.warn(`[3un] WebSocket ${t('submit.fail', { action: t('action.connect') })}`, value)
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
    title: localStore.localData['print_ResultsOrder'],
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

async function handleGenerate() {
  if (!paperRef.value) return
  if (generating.value) return toast.warning(localStore.localData['print_WaitPDF'])
  if (customOrders.value.length === 0) return toast.warning(localStore.localData['print_FIrstSubmitOrder_Toast'])
  if (count.value > 0) return toast.warning(localStore.localData['print_WaitOrdersFinish_Toast'])
  if (templateItems.value.length === 0) {
    if (!await xconfirm(localStore.localData['print_NoFieldsIsPrint'])) return
  }
  updateOverflowMap()
  if (Object.values(isOverflowMap).some(Boolean)) {
    if (!await xconfirm(localStore.localData['print_SomeExceedFields_Toast'])) return
  }

  paperRef.value.classList.add("printing")
  await nextTick()

  try {
    generating.value = true
    await pluginGeneratePdf()
  } catch {
    try {
      await handleWebGenerate()
    } catch(err) {
      console.error(err)
      toast.warning(localStore.localData['print_FailedPDF'])
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
        showField: template.showField!,
        x: pxTomm(template.x),
        y: pxTomm(template.y),
        value: getQrcodeVal({
          ...order.fields,
          ...{ [hashPrintHeader('imei')]: order.imei } },
          qrcodeKeys.value,
          processedColumns.value
        ),
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
    }  else if (template.type === 'device') {
      if (!hasDeviceSn.value) continue

      const device = deviceItems.find(d => d.info.InternationalMobileEquipmentIdentity === order.imei)
      if (!device) continue

      pageItems.push({
        ...template,
        label: isEn.value ? template.label_local : template.label,
        showField: template.showField ?? true,
        x: pxTomm(template.x),
        y: pxTomm(template.y),
        size: template.size!,
        value: getDeviceValue(device, template.key),
      })
      continue
    } else {
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
        align: template.align ? template.align : 'left',
      })
    }
  }

  return pageItems
}

function getDeviceValue(device: DeviceMapItem, key: string) {
  switch (key) {
    case "device_version":
      return `${device.summary.ProductVersion} ${device.summary.BuildVersion}`
    case "device_model":
      return `${device.info.ModelNumber} ${device.info.RegionInfo}`
    case "device_country":
      return isEn.value ? device.summary.SalesRegion.english : device.summary.SalesRegion.chinese
    case "product_type":
      return device.summary.ProductType
  }
}

async function pluginGeneratePdf() {
  const body = processRequestParams()

  const { data } = await axios.post(
    "http://localhost:9999/generate-pdf",
    body,
    { responseType: "blob", headers: {'x-token': Date.now().toString(16)}, timeout: 10000 },
  )

  const url = URL.createObjectURL(data)
  storageUrl.push(url)
  // window.open(url)
  openIframe(url)

  // URL.revokeObjectURL(url)
}

async function handleWebGenerate() {
  const body = processRequestParams()

  const pdfBlob = await generatePDF(body)

  const url = URL.createObjectURL(pdfBlob)
  storageUrl.push(url)

  openIframe(url)
}

function handleSelectedOrder(order: CustomSubmitOrder) {
  if (order.status !== ORDER_STATUS.SUCCESS) return

  selectOrder.value = order
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

async function init() {
  try {
    await deviceStore.getPluginInfo()
    pluginRunning = true
  } catch {
    pluginRunning = false
    deviceStore.pluginMustUpdate = true
  }
}

async function checkPluginInfo() {
  if (pluginRunning) {
    if (checkVersion(deviceStore.version)) {
      deviceStore.pluginMustUpdate = true
    }
    
    if (hasNewVersion(deviceStore.version)) {
      deviceStore.hasNewVersion = true
    }
  }
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

async function getDeviceService() {
  const { data } = await serviceApi.list({
    isDeviceShow: true
  })
  deviceServices.value = processServiceCate2Service(data)
}

function processServiceCate2Service(serviceCates: ServiceDetail[]) {
  let services: Service[] = []

  for (let category of serviceCates) {
    services.push(...category.children)
  }

  return services
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

await init()
await checkPluginInfo()
await deviceStore.getNormalDevices()
await deviceStore.getRecoveryDevices()

await Promise.all([
  getServices(),
  getQueryService(),
  getDeviceService(),
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
        @selected="handleSelected"
      />

      <div class="flex flex-col gap-2">
        <div class="text-sm font-medium text-slate-700 dark:text-slate-200">{{ getLanuagestring("print_commonly_used_service", iStore.lang) }}</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
          <button
            v-for="service in deviceServices" :key="service.id"
            class="inline-flex items-center gap-2 p-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 cursor-pointer"
            @click="handleSelected(service.id)"
          >
            <!-- <input
              type="checkbox"
              class="w-4 h-4 text-primary rounded"
              :value="service.id"
              v-model="selectedDeviceServiceIds"
            /> -->
            <span class="truncate text-sm">{{ service.title }}（{{ service.id }}）</span>
          </button>
        </div>
      </div>

      <div class="flex justify-between gap-8">
        <div class="flex-1">
          <XTextarea v-model="strImeis" :placeholder="localStore.localData['print_Input_IMEI/SN']" rows="8" @change="submited = false" />
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="flex items-center gap-2">
            <div class="w-full px-4 py-2 bg-card rounded-lg">
              <span>{{ localStore.localData['print_CustomVaildData'] }}: <b class="text-primary">{{ validImeis.length }}</b></span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-full px-4 py-2 bg-card rounded-lg">
              <span>{{ localStore.localData['print_ProcessingOrders'] }}: <b class="text-primary">{{ count }}</b></span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-full px-4 py-2 bg-card rounded-lg">
              <span>{{ localStore.localData['print_SuccessfulOrders'] }}: <b class="text-success">{{ orderStat.success }}</b></span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-full px-4 py-2 bg-card rounded-lg">
              <span>{{ localStore.localData['print_FailedOrders'] }}: <b class="text-danger">{{ orderStat.failed }}</b></span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-y-2">
        <PluginTip />
        <div class="flex items-center justify-end gap-2">
          <label class="flex items-center group relative">
            <XSwitch :label="localStore.localData['print_AutoPrint']" v-model="autoPrint" />
          </label>
          <XButton color="success" :label="localStore.localData['print_SubmitOrders']" @click="handleSubmit" />
          <XButton :label="localStore.localData['print_ViewOrderResult']" @click="readOrderResult" />
          <XButton :label="localStore.localData['print_PrintResult']" color="warning" @click="handleGenerate" />
        </div>
      </div>

      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <span class="flex-1 h-px bg-zinc-500"></span>
        <span>{{ localStore.localData['print_SmallTitle'] }}</span>
        <span class="flex-1 h-px bg-zinc-500"></span>
      </div>

      <HeaderTagConfig
        :headers="processedColumns"
        :select-cols="selectCols"
        :title="localStore.localData['print_PrintFields']"
        @selected="handleSelectColumn"
      />

      <div class="border p-2 space-y-1">
        <div class="font-bold text-sm">{{ localStore.localData['print_Device'] }}</div>
        <div class="flex flex-wrap gap-2">
          <template v-for="item in deviceFields" :key="item.key">
            <HeaderTag
              :label="isEn ? item.nameEn : item.name"
              :id="item.key"
              :checked="selectCols.includes(item.key)"
              :type="item.type"
              @click="handleSelectColumn"
            />
          </template>
        </div>
      </div>

      <PaperConfig
        v-model="container"
        @select-layout="applyGlobalLayout"
      />

      <div class="min-h-56 max-h-full border rounded-md p-3 space-y-3 bg-muted/30 overflow-y-auto">
        <div class="font-semibold text-sm flex items-center gap-2">
          {{ localStore.localData['print_FieldsConfig'] }}
          <span class="text-xs text-muted-foreground">
            ({{ localStore.localData['print_ControlDisplay'] }})
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
                  :placeholder="localStore.localData['print_FontSize']"
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
                  <XSelectItem :value="true">{{ localStore.localData['print_SomeLine'] }}</XSelectItem>
                  <XSelectItem :value="false">{{ localStore.localData['print_OneLine'] }}</XSelectItem>
                </XSelect>

                <XSelect v-model="field.showField" ui-trigger="w-32">
                  <XSelectItem :value="true">{{ localStore.localData['print_LabelContent'] }}</XSelectItem>
                  <XSelectItem :value="false">{{ localStore.localData['print_OnlyContent'] }}</XSelectItem>
                </XSelect>

                <button @click="field.flip = false" class="px-2 py-1 border rounded text-xs hover:bg-primary/50"
                  :class="{ 'bg-primary': !field.flip }">
                  {{ localStore.localData['print_White'] }}
                </button>

                <button @click="field.flip = true" class="px-2 py-1 border rounded text-xs"
                  :class="{ 'bg-primary': field.flip }">
                  {{ localStore.localData['print_Black'] }}
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
                  <XSelectItem :value="true">{{ localStore.localData['print_BarcodeContent'] }}</XSelectItem>
                  <XSelectItem :value="false">{{ localStore.localData['print_OnlyBarcode'] }}</XSelectItem>
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
                  {{ localStore.localData['print_QRcode'] }}
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

      <div class="flex flex-col gap-2">
        <div class="flex justify-between space-x-2">
          <XButton class="flex-1" :label="localStore.localData['print_ExportTemplate']" color="success" @click="exportTemplate" />
          <XButton color="warning" class="flex-1" :label="localStore.localData['print_ImportTemplate']" @click="openImport" />
        </div>
      </div>

      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <span class="flex-1 h-px bg-zinc-500"></span>
        <span>{{ localStore.localData['print_ReaderModule'] }}</span>
        <span class="flex-1 h-px bg-zinc-500"></span>
      </div>

      <!-- <template v-if="deviceStore.pluginMustUpdate">
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
      </template> -->
      
      <template v-if="deviceStore.deviceMap.size === 0 && deviceStore.recoveryDeviceMap.size === 0">
        <div class="h-36 bg-card flex items-center justify-center rounded-md text-muted-foreground">
          {{ localStore.localData['print_USB_Runing'] }}
        </div>
      </template>
      <template v-else>
        <div class="flex flex-col">
          <div class="grid grid-cols-3 gap-2">
            <template v-for="[_, phone] in deviceStore.deviceMap">
              <div class="p-4 bg-card border rounded hover:shadow transition-all duration-200 cursor-pointer"
                @click="handleClickPhone(phone.info.InternationalMobileEquipmentIdentity ?? phone.info.SerialNumber)">
                <div class="mb-4">
                  <div class="flex items-center justify-between mb-1">
                    <h3>{{ phone.product.Name }}</h3>
                  </div>
                  <div class="text-sm text-muted-foreground">
                    <p>{{ localStore.localData['print_SerialNumber'] }}: {{ phone.info.SerialNumber }}</p>
                    <p>imei: {{ phone.info.InternationalMobileEquipmentIdentity }}</p>
                    <p>{{ localStore.localData['print_Model'] }}: {{ phone.info.ModelNumber }} {{ phone.info.RegionInfo }}</p>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <div class="flex justify-between items-center mb-4">
            <div>
              <h2 class="text-xl font-bold text-foreground">{{ localStore.localData['print_ReciveryList'] }}</h2>
              <p class="text-sm text-muted-foreground">{{ localStore.localData['print_TotalDevices'].replace('@', deviceStore.recoveryDeviceMap.size.toString()) }}</p>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-2">
            <template v-for="[_, device] in deviceStore.recoveryDeviceMap">
              <div class="p-4 bg-card border rounded hover:shadow transition-all duration-200 cursor-pointer"
                @click="handleClickPhone(device.serialNo, false)">
                <div class="mb-4">
                  <div class="flex items-center justify-between mb-1">
                    <h3>{{ device.name }}</h3>
                  </div>

                  <div class="text-sm text-muted-foreground">
                    <p>ecid: {{ device.ecid }}</p>
                    <p>{{ localStore.localData['print_SerialNumber'] }}: {{ device.serialNo }}</p>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>

      <template v-if="!deviceStore.pluginMustUpdate && deviceStore.hasNewVersion">
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <span class="flex-1 h-px bg-zinc-500"></span>
          <div class="flex items-center gap-2">
            <span>{{ localStore.localData['print_UpdatePlugin'] }}</span>
            <XButtonSplit
              :label="localStore.localData['print_DownloadPlugin']" :options="splitOptions"
              size="sm" :openClick="true"
            />
            <XButton size="sm" :label="localStore.localData['print_Refresh']" @click="$router.go(0)" />
          </div>
          <span class="flex-1 h-px bg-zinc-500"></span>
        </div>
      </template>
    </section>

    <section class="flex-1 flex flex-col items-center gap-y-4">
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <span class="flex-1 h-px bg-zinc-500"></span>
        <span>{{ localStore.localData['print_PreviewArea'] }}</span>
        <span class="flex-1 h-px bg-zinc-500"></span>
      </div>

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
          <template v-if="item.type === 'text' || item.type === 'custom'">
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
              <span class="ml-1 break-all template-value">{{ typeof previewValue === "string" ? previewValue :
                stripHtmlTags(previewValue[item.key]) }}</span>
            </template>
          </template>

          <template v-else-if="item.type === 'device'">
            <template v-if="item.wrap">
              <div v-if="item.showField" class="font-medium leading-tight">
                {{ isEn ? item.label_local : item.label }}:
              </div>
              <div class="leading-tight break-all template-value">
                {{ typeof previceDeviceItem === "string" ? previceDeviceItem :
                  stripHtmlTags(previceDeviceItem[item.key])
                }}
              </div>
            </template>

            <template v-else>
              <span class="font-medium" v-if="item.showField">{{ isEn ? item.label_local : item.label }}:</span>
              <span class="ml-1 break-all template-value">{{ typeof previceDeviceItem === "string" ? previceDeviceItem :
                stripHtmlTags(previceDeviceItem[item.key]) }}</span>
            </template>
          </template>

          <template v-else-if="item.type === 'barcode'">
            <div data-barcode>
              <BarcodePreview
                :data="barcodeVal"
                :size="+filterNumber(item.size!.toString())"
                :show-field="item.showField!"
                :module-width-px="+filterNumber(item.barcodeWidth!.toString())"
              />
            </div>
          </template>

          <template v-else>
            <div data-qrcode>
              <QrPreview :data="previewQrcode" :size="+filterNumber(item.size!.toString())" />
            </div>
          </template>
        </div>
      </div>

      <div class="w-full flex items-center gap-4 text-sm">
        <span class="flex-1 h-px bg-border"></span>
        <span class="">{{ localStore.localData['print_DifferentPreview'] }}</span>
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

    <SelectHeader v-model="visibleSelQrHeader" v-model:keys="qrcodeKeys" :headers="qrFieldKeys" />
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
