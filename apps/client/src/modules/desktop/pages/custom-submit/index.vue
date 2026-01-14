<script setup lang="ts">
import SelectService from './components/SelectService.vue'
import ColumnTags from './components/ColumnTags.vue'
import QrPreview from './components/QrPreview.vue'
// import OrderCard from './components/OrderCard.vue'

import { watchOnce } from '@vueuse/core'
import { ORDER_STATUS } from '@3un/utils'
import jsPDF from "jspdf"
import * as html2image from 'html-to-image'
import { h } from 'vue'
import { toast } from 'vue-sonner'
import { type XTableColumn } from '@3un/ui'

import { serviceApi, type FieldMap, type Service, type ServiceHeader } from '@/api/services'
import { CUSTOM_SUBMIT_STORE, getDefaultHeaders, type CustomSubmitStore, type TemplateItem } from './utils'
import { orderApi, type CustomSubmitOrder, type Order, type OrderSubmitResult, type ServiceColumnItem } from '@/api/orders'
import { getSubmitImei, mmToPx } from '@/utils'
import { getDefaultColumns } from './utils/columnOrder'

const store: CustomSubmitStore = reactive({
  services: [],
  serviceCols: getDefaultHeaders(),
  selectCols: [],

  container: {
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
  },
  templateItems: [],

  serviceId: 0,
})

provide(CUSTOM_SUBMIT_STORE, store)

const { t, locale } = useI18n()
const { connect, close } = useWsStore()
const serviceStore = useServiceStore()
const uStore = useUserStore()

const strImeis = ref<string>("")
const count = ref<number>(0)
const rawOrders = ref<CustomSubmitOrder[]>([])
const paperRef = ref<HTMLElement | null>(null)
const columns = ref<XTableColumn[]>(getDefaultColumns(t))
const submited = ref<boolean>(false)
const submiting = ref<boolean>(false)
const generating = ref<boolean>(false)

const selectService = shallowRef<Service>()
const validImeis = shallowRef<string[] | undefined>([])

const origin = window.location.origin

watch(
  () => [
    store.container.width,
    store.container.height,
    store.container.padding.top,
    store.container.padding.right,
    store.container.padding.bottom,
    store.container.padding.left,
  ],
  () => {
    clampTemplateItems()
  },
  { deep: false }
)

const isEn = computed(() => locale.value === "en")

const processedColumns = computed(() => store.serviceCols.map(item => isEn.value ? item.nameEn : item.name))

const paperStyle = computed(() => ({
  width: `${mmToPx(store.container.width)}px`,
  height: `${mmToPx(store.container.height)}px`,
  padding: `${mmToPx(store.container.padding.top)}px
    ${mmToPx(store.container.padding.right)}px
    ${mmToPx(store.container.padding.bottom)}px
    ${mmToPx(store.container.padding.left)}px`,
  fontSize: `${mmToPx(store.container.fontSize)}px`
}))

const previewValue = computed(() => {
  let order = rawOrders.value.find(o => o.status === ORDER_STATUS.SUCCESS)
  if (!order) return "{value}"

  let res: Record<string, string> = {}

  for(let item of processedColumns.value) {
    res[item] = order.fields[item]
  }
  res["imei"] = order.imei

  return res
})

const safeAreaStyle = computed(() => {
  const { padding, width, height } = store.container

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

async function getServices() {
  const { data } = await serviceApi.list({ isUnlock: false })
  store.services = data
}

async function handleSelected(value: number) {
  close()
  selectService.value = serviceStore.services.get(value)
  await getServiceColumns(value)
}

async function getServiceColumns(value: number) {
  const { data } = await serviceApi.header(value)
  store.serviceCols = mergeHeaders(data)
  columns.value = mergeTableColumns(generateColumns(data))
}

function mergeHeaders(serviceCols: ServiceHeader[]) {
  const defaultCols = getDefaultHeaders()

  return [
    ...defaultCols,
    ...serviceCols,
  ]
}

function mergeTableColumns(serviceCols: XTableColumn[]) {
  const defaultCols = getDefaultColumns(t)

  return [
    ...defaultCols,
    ...serviceCols,
  ]
}

function generateColumns(headers: ServiceHeader[]) {
  const columns: XTableColumn[] = []

  const isEn = locale.value === "en"

  for (let item of headers) {
    const label = isEn ? item.nameEn : item.name
    columns.push({
      key: label,
      title: label,
      width: item.width,
      render: (_, row: CustomSubmitOrder) => {
        return h("div", {
          innerHTML: row.fields?.[label] ?? ""
        })
      }
    })
  }

  return columns
}

function handleSelectColumn(label: string) {
  const index = store.selectCols.indexOf(label)

  if (index !== -1) {
    store.selectCols.splice(index, 1)
    store.templateItems = store.templateItems.filter(i => i.key !== label)
  } else {
    const isQrcode = (/^(二维码|qrcode)$/i).test(label)
    store.selectCols.push(label)
    store.templateItems.push({
      key: label,
      label: label,
      x: mmToPx(store.container.padding.left),
      y: mmToPx(store.container.padding.top),
      wrap: false,
      type: isQrcode ? "qrcode" : "text",
      ...(isQrcode && {size: 20}),
    })
  }
}

function clampPosition(item: TemplateItem, target: HTMLElement) {
  const padding = store.container.padding
  const containerW = mmToPx(store.container.width)
  const containerH = mmToPx(store.container.height)

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
  }

  function up() {
    document.removeEventListener("mousemove", move)
    document.removeEventListener("mouseup", up)
  }

  document.addEventListener("mousemove", move)
  document.addEventListener("mouseup", up)
}

function handleImport() {
  if (!selectService.value) return
  validImeis.value = processImeis(strImeis.value)
  
  if (!validImeis.value) return
  close()
  rawOrders.value.length = 0
  submited.value = false

  processWaitOrder(validImeis.value)
  strImeis.value = ""
}

function processImeis(imeis: string) {
  if (!selectService.value) return

  const type = selectService.value.imeiType
  return getSubmitImei(imeis, type)
}

function processWaitOrder(imeis: string[]) {
  for (let imei of imeis) {
    const initData: CustomSubmitOrder = {
      id: null,
      serviceId: store.serviceId,
      status: ORDER_STATUS.WAIT,
      imei: imei,
      result: "",
      fields: {},
    }

    for (let column of processedColumns.value) {
      initData["fields"][column] = ""
    }

    rawOrders.value.push(initData)
  }
}

async function handleSubmitOrder() {
  if (submiting.value) return toast.warning("请等待订单处理")
  if (submited.value) return toast.warning("请勿重复提交")
  if (!selectService.value) return toast.warning("请选择服务")
  if (!validImeis.value) return toast.warning("请输入有效imei")
  if (!rawOrders.value.length) return toast.warning("请导入订单")

  connectWebSocket()
  await submitOrder()
}

function connectWebSocket() {
  if (!selectService.value) return
  const { data, status } = connect({ serviceId: selectService.value.id, type: "order" })

  watchOnce(
    () => status.value,
    (value) => {
      if (value !== "OPEN") return
    }
  )

  watch(
    () => data.value,
    (message) => {
      if (!message) return

      dispatchWsMessage(message)
      handleCount()
    }
  )
}

async function submitOrder() {
  if (!selectService.value) return
  if (!validImeis.value) return

  submiting.value = true
  try {
    const params = {
      groupId: selectService.value.parentId,
      serviceId: selectService.value.id,
      imeiList: validImeis.value,
      remark: "",
      isBulk: false,
      language: locale.value,
    }
    const { data } = await orderApi.submit(params)
    uStore.updateCredit()
    count.value = validImeis.value.length
    submited.value = true
    processData(data)
  } catch {} finally {
  }
}

function dispatchWsMessage(message: string) {
  const data = JSON.parse(message) as Order

  const index = rawOrders.value.findIndex(order => order.imei === data.imei)
  const isError = data.status === ORDER_STATUS.FAILED
  const errorCol = processedColumns.value[1]

  if (index === -1) return

  rawOrders.value[index] = {
    ...rawOrders.value[index],
    fields: {
      ...(isError && {[errorCol]: data.result}),
      ...(!isError && processResult(data.result)),
    },
    status: data.status,
    id: data.id,
    result: data.result,
  }
}

function processResult(content: string) {
  const result: Record<string, string> = {}
  const items = content.split("<br>")

  const keyMap = getFieldsMap(store.serviceCols)

  if (items.length === 1 && store.serviceCols.length === 1) {
    const key = isEn.value ? (store.serviceCols[0].nameEn ?? store.serviceCols[0].name) : store.serviceCols[0].name
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

  const isSuccess = judgeOrderStatus(store.serviceCols, items)

  if (!isSuccess) {
    result[processedColumns.value[0]] = content
  }
  
  return result
}

function processData(data: OrderSubmitResult[]) {
  const errorCol = processedColumns.value[1]
  for (let item of data) {
    let index = rawOrders.value.findIndex(order => order.imei === item.imei)

    if (index === -1) return

    const isFailed = item.status === ORDER_STATUS.FAILED
    if (isFailed) handleCount()

    rawOrders.value[index] = {
      ...rawOrders.value[index],
      id: item.codeId,
      status: item.status,
      result: item.message,
      fields: {
        [errorCol]: item.message,
      }
    }
  }
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

function handleCount() {
  count.value--

  if (count.value === 0) {
    submiting.value = false
    close()
  }
}

function stripHtmlTags(html: string) {
  return html.replace(/<[^>]+>/g, '')
}

function objectToString(object: Record<string, string> | string) {
  return Object.entries(object)
    .map(([key, value]) => {
      const isQrcode = (/^(二维码|qrcode)$/i).test(key)
      if (isQrcode) return
      if (!store.selectCols.includes(key)) return
      return `${key}: ${stripHtmlTags(value)}`
    })
    .filter(Boolean)
    .join('\n')
}

function qrcodeStr(object: Record<string, string> | string) {
  const data = objectToString(object)

  return `${origin}/qrcode-result?data=${encodeURIComponent(data)}`
}

function isQrcodeField(key: string) {
  return (/^(二维码|qrcode)$/i).test(key)
}

function clampTemplateItems() {
  const minX = mmToPx(store.container.padding.left)
  const minY = mmToPx(store.container.padding.top)

  const maxX =
    mmToPx(store.container.width) -
    mmToPx(store.container.padding.right) -
    80

  const maxY =
    mmToPx(store.container.height) -
    mmToPx(store.container.padding.bottom) -
    24

  store.templateItems.forEach(item => {
    item.x = Math.min(Math.max(item.x, minX), maxX)
    item.y = Math.min(Math.max(item.y, minY), maxY)
  })
}

async function generatePDF() {
  if (!paperRef.value) return
  if (!rawOrders.value.length) return toast.warning("请导入订单")
  if (submiting.value) return toast.warning("请等待订单处理")
  if (generating.value) return toast.warning("请等待pdf生成")

  generating.value = true
  paperRef.value.classList.add("printing")

  const pdf = new jsPDF({
    unit: "px",
    format: [mmToPx(store.container.width), mmToPx(store.container.height)],
  })

  for (let i = 0; i < rawOrders.value.length; i++) {
    const order = rawOrders.value[i]

    const page = paperRef.value.cloneNode(true) as HTMLElement
    document.body.appendChild(page)

    // 填充数据
    page.querySelectorAll<HTMLElement>('.template-item').forEach(itemEl => {
      const key = itemEl.dataset.key!
      const value = key === 'imei'
        ? order.imei
        : order.fields[key] ?? ''
    
      const valueEl = itemEl.querySelector('.template-value')
    
      if (valueEl) {
        valueEl.textContent = stripHtmlTags(value)
      }
    })

    const imgData = await html2image.toPng(page, {
      pixelRatio: 2,
      backgroundColor: "#ffffff",
      cacheBust: true,
      skipFonts: true,
    })

    document.body.removeChild(page)

    pdf.addImage(imgData, "PNG", 0, 0, mmToPx(store.container.width), mmToPx(store.container.height))

    if (i < rawOrders.value.length - 1) pdf.addPage()
  }

  generating.value = false
  paperRef.value.classList.remove("printing")
  pdf.autoPrint({ variant: "non-conform" })
  window.open(pdf.output("bloburi"), "_blank")
}

await getServices()
await serviceStore.getServices()
</script>

<template>
  <div class="p-4 h-full w-full flex gap-4 overflow-auto">
    <section class="w-[40%] space-y-4 flex flex-col">
      <SelectService ui-trigger="w-full"
        :services="store.services"
        v-model="store.serviceId"
        @selected="handleSelected" />

      <XTextarea v-model="strImeis"
        rows="6"
        class="w-full h-32 border p-2 text-sm"
        placeholder="每行一个 IMEI" />

      <div class="border p-2 space-y-1">
        <div class="font-bold text-sm">服务字段</div>
        <div class="flex flex-wrap gap-2">
          <template v-for="column in processedColumns" :key="column">
            <ColumnTags :label="column"
              :checked="store.selectCols.includes(column)"
              @click="handleSelectColumn" />
          </template>
        </div>
      </div>

      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <div class="flex items-center space-x-2">
            <span>处理中订单:</span>
            <span class="text-primary">{{ count }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <span>订单总数:</span>
            <span class="text-success">{{ rawOrders.length }}</span>
          </div>
        </div>
        <div class="flex items-center justify-end gap-2">
          <XButton label="导入imei" variant="soft" @click="handleImport" />
          <XButton label="提交订单" @click="handleSubmitOrder" />
          <XButton color="success" label="打印结果" @click="generatePDF" />
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4 p-2 rounded-md border border-border shadow-sm">
        <!-- 字体大小 -->
        <div class="flex flex-col space-y-1">
          <div class="font-semibold text-sm">字体大小(mm):</div>
          <div class="flex items-center gap-2 w-40">
            <XInputNumber v-model="store.container.fontSize" :step="1" size="sm" />
          </div>
        </div>
        <!-- 纸张大小 -->
        <div class="flex flex-col space-y-1">
          <div class="font-semibold text-sm">纸张大小 (mm)</div>
          <div class="flex items-center gap-2">
            <span class="text-xs w-16">长(mm):</span>
            <XInputNumber v-model="store.container.height" :step="1" size="sm" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs w-16">宽(mm):</span>
            <XInputNumber v-model="store.container.width" :step="1" size="sm" />
          </div>
        </div>
        <!-- 内边距设置 -->
        <div class="flex flex-col space-y-1">
          <div class="font-semibold text-sm">页边距 (mm)</div>
          <div class="flex items-center gap-2">
            <span class="text-xs w-16">上(mm):</span>
            <XInputNumber v-model="store.container.padding.top" :step="1" size="sm" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs w-16">下(mm):</span>
            <XInputNumber v-model="store.container.padding.bottom" :step="1" size="sm" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs w-16">左(mm):</span>
            <XInputNumber v-model="store.container.padding.left" :step="1" size="sm" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs w-16">右(mm):</span>
            <XInputNumber v-model="store.container.padding.right" :step="1" size="sm" />
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
          <div
            v-for="field in store.templateItems"
            :key="field.key"
            class="flex items-center justify-between gap-3 text-sm px-2 py-1 rounded hover:bg-muted transition"
          >
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
            <div v-if="!isQrcodeField(field.key)">
              <label class="flex items-center gap-3 cursor-pointer select-none">
                <input type="checkbox" class="peer sr-only" v-model="field.wrap" />
                <div
                  class="relative w-9 h-5 rounded-full bg-border
                         peer-checked:bg-primary
                         transition-colors flex"
                >
                  <XSwitch v-model="field.wrap" />
                </div>
              </label>
            </div>

            <div v-else class="flex items-center gap-2">
              <XInputNumber v-model="field.size!" size="sm" class="w-20" />
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex-1 border rounded-md overflow-y-auto"
      >
        <XTable
          :columns="columns"
          :data="rawOrders"
          class="h-full max-w-full border"
        />
      </div>
    </section>
    <section class="flex-1 flex justify-center">
      <div
        ref="paperRef"
        class="relative bg-white shadow paper-preview overflow-hidden"
        :style="paperStyle"
      >
        <div
          class="absolute safe-area-border"
          :style="safeAreaStyle"
        />

        <div
          v-for="item in store.templateItems"
          :key="item.key"
          class="absolute cursor-move select-none template-item text-black py-1"
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
            <QrPreview
              :data="qrcodeStr(previewValue)"
              :size="item.size ?? 20" />
          </template>
        </div>
      </div>
    </section>
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
</style>
