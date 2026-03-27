<script setup lang="ts">
import TemplateTag from './components/TemplateTag.vue'
import TemplateQrcode from './components/TemplateQrcode.vue'

import { Icon } from '@iconify/vue'
import { toast } from 'vue-sonner'

import { getServiceFields, getServices, updateService } from '@/api/services'
import { type Service } from '@/inters/services'
import { mmToPx } from '@/utils'
import { hashPrintHeader, textAlign } from '@3un/utils'
import TemplateBarcode from './components/TemplateBarcode.vue'

interface ContainerItem {
  width: number,
  height: number,
  padding: {
    top: number,
    right: number,
    bottom: number,
    left: number,
  },
  fontSize: number,
  styles: Record<string, string>,
  // portrait - 纵向, landscape - 横向
  orientation?: "portrait" | "landscape",
}

interface TemplateItem {
  key: string,
  label: string,
  label_local: string,
  x: number,
  y: number,
  wrap?: boolean,
  width?: number,
  height?: number,
  type?: "text" | "qrcode" | "barcode",
  align?: "left" | "center" | "right",
  size?: number,
  showField: boolean,
}

interface PrintTemplateJson {
  serviceId?: number,

  paper: {
    width: number,
    height: number,
    padding: {
      top: number,
      right: number,
      bottom: number,
      left: number,
    },
    fontSize: number,
    orientation?: "portrait" | "landscape",
  },
  items: {
    key: string,
    label: string,
    label_local: string,
    x: number,
    y: number,
    wrap?: boolean,
    type?: "text" | "qrcode" | "barcode",
    align?: "left" | "center" | "right",
    size?: number,
    showField: boolean,
  }[],
}

interface PrintHeader {
  key: string,
  name: string,
  nameEn: string,
  type: "text" | "qrcode" | "barcode",
}

interface FieldValue {
  [key: string]: {
    title: string,
    value: string
  }
}

const router = useRouter()
const route = useRoute()
const serviceStore = useServiceStore()

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
  orientation: 'landscape',
})
const isOverflowMap = reactive<Record<string, boolean>>({})

const resultCol = hashPrintHeader("处理结果")
const orderResultCol = hashPrintHeader("订单结果")
const qrcodeCol = hashPrintHeader("二维码")

const serviceId = ref<number>(0)
const services = ref<Service[]>([])
const input = ref<string>('')
const serviceCols = ref<PrintHeader[]>([])
const selectCols = ref<string[]>([])
const templateItems = ref<TemplateItem[]>([])
const lang = ref<'zh' | 'en'>('zh')

const paperRef = ref<HTMLElement | null>(null)

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
const directionOptions: { value: 'portrait' | 'landscape', label: string }[] = [
  { value: 'portrait', label: '纵向' },
  { value: 'landscape', label: '横向' },
]

const isEn = computed(() => lang.value === 'en')

const processedColumns = computed(() => (
  serviceCols.value.map(item => ({
    key: item.key,
    label: isEn.value ? item.nameEn : item.name,
    type: item.type
  }))
))

const filteredServices = computed(() => {
  const inputValue = input.value.trim().toLowerCase()
  let res: Service[] = []
  if (!inputValue) res = services.value

  res = services.value.filter((s) => s.packageTitle.toLowerCase().includes(inputValue) || s.packageId.toString().includes(inputValue))

  return res
})

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

const previewValue = computed(() => {
  let res: FieldValue = {}

  for (let item of processedColumns.value) {
    res[item.key] = {
      title: item.label,
      value: "{value}"
    }
  }
  res[hashPrintHeader("imei")] = {
    title: "IMEI",
    value: "{value}"
  }
  res[resultCol] = {
    title: "处理结果",
    value: "{value}"
  }
  res[orderResultCol] = {
    title: "订单结果",
    value: "{value}"
  }

  return res
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

type ClearType = 'category' | 'keyword'
function handleClear(type: ClearType) {
  router.replace({ path: route.path, query: {[type]: undefined}})
}

async function getQueryService() {
  services.value = await getServices({ isUnlock: false })
}

function getDisplayText(service: Service) {
  const keyword = input.value.trim()
  if (!keyword) return `${service.packageId} - ${service.packageTitle}`

  const idText = highlightText(service.packageId.toString(), keyword)
  const titleText = highlightText(service.packageTitle, keyword)
  return `${idText} - ${titleText}`
}

function highlightText(text: string, keyword: string) {
  if (!keyword.trim()) return text
  const reg = new RegExp(`(${keyword})`, 'gi')
  return text.replace(reg, '<mark class="x-highlight">$1</mark>')
}

function handleSelectColumn(key: string, type: "text" | "qrcode" | "barcode" = 'text') {
  const header = serviceCols.value.find(h => h.key === key)
  if (!header) return

  const index = selectCols.value.indexOf(key)

  if (index !== -1) {
    selectCols.value.splice(index, 1)
    templateItems.value = templateItems.value.filter(i => i.key !== key)
  } else {
    // const isQrcode = isQrcodeField(key)
    const pos = getNextItemPosition()

    const newItem: TemplateItem = {
      key: key,
      label: header.name,
      label_local: header.nameEn,
      x: pos.x,
      y: pos.y,
      wrap: false,
      type: type,
      size: (type === 'barcode' ? 5 : 10),
      showField: true,
    }

    selectCols.value.push(key)
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

async function handleSelected(id: number | undefined) {
  if (!id) return

  serviceCols.value.length = 0
  selectCols.value.length = 0
  templateItems.value.length = 0
  const serviceFields = await getFieldsByid(id)

  serviceCols.value = [
    ...defaultItems,
    ...serviceFields.list.map<PrintHeader>(h => ({
      key: hashPrintHeader(h.name),
      name: h.name,
      nameEn: h.nameEn ? h.nameEn : h.name,
      type: "text"
    }))
  ]
  
  const selService = services.value.find(s => s.packageId === id)
  if (selService) {
    processServiceTemplate(selService.template ?? '')
  }
}

async function getFieldsByid(id: number) {
  return await getServiceFields({
    serviceId: id,
    page: 1,
    pageSize: 500,
  })
}

function isQrcodeField(key: string) {
  return key === 'qrcode'
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
}

function objectToString(object: Record<string, string> | string | FieldValue) {
  return Object.entries(object)
    .map(([key, field]) => {
      const isQrcode = qrcodeCol === key
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

async function handleSave() {
  const selService = serviceStore.itemMap.get(serviceId.value)
  if (!selService) return toast.warning('请选择服务后重试')

  try {
    const curServiceTemplate: PrintTemplateJson = {
      serviceId: serviceId.value,
  
      paper: {
        width: container.width,
        height: container.height,
        padding: { ...container.padding },
        fontSize: container.fontSize,
        orientation: container.orientation ?? 'portrait',
      },
      items: templateItems.value.map(item => ({
        key: item.key,
        label: item.label,
        label_local: item.label_local,
        align: item.align,
        x: item.x,
        y: item.y,
        wrap: item.wrap,
        type: item.type,
        size: item.size,
        showField: item.showField,
      }))
    }

    const json = JSON.stringify(curServiceTemplate, null, 2)
    await updateService({
      ...selService,
      template: json,
    })

    toast.success('保存成功')
    const index = services.value.findIndex(s => s.packageId === serviceId.value)
    if (index !== -1) {
      services.value[index].template = json
    }
  } finally {}
}

function processServiceTemplate(jsonStr: string) {
  if (jsonStr === '') return
  const template = JSON.parse(jsonStr) as PrintTemplateJson

  container.width = template.paper.width
  container.height = template.paper.height
  container.fontSize = template.paper.fontSize
  container.padding.top = template.paper.padding.top
  container.padding.right = template.paper.padding.right
  container.padding.bottom = template.paper.padding.bottom
  container.padding.left = template.paper.padding.left
  container.orientation = template.paper.orientation

  templateItems.value = template.items.map(item => ({ ...item, showField: item.showField ?? true }))

  selectCols.value = template.items.map(item => item.key)
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

onMounted(async () => {
  await getQueryService()
})
</script>

<template>
  <div>
    <section class="p-3 border-b">
      <XSelect
        v-model="serviceId"
        v-model:input="input"
        filterable clearable ui-trigger="w-56 mr-2"
        placement="bottom-start"
        @clear="handleClear('category')"
        @selected="handleSelected"
      >
        <XSelectItem
          v-for="service in filteredServices" :key="service.packageId"
          :value="service.packageId" :label="service.packageTitle"
          ui-root="py-1"
        >
          <div class="flex-1 flex items-center justify-between space-x-3">
            <span class="text-left" v-html="getDisplayText(service)"></span>
            <span class="text-primary">￥{{ service.packagePrice }}</span>
          </div>
        </XSelectItem>
      </XSelect>
    </section>

    <section class="p-3 flex gap-4 overflow-y-auto">
      <div class="w-[40%] space-y-4 flex flex-col">
        <div class="border p-2 space-y-1 rounded-md">
          <div class="font-bold text-sm">服务字段</div>
          <div class="flex flex-wrap gap-2">
            <template v-for="column in processedColumns" :key="column.key">
              <TemplateTag :id="column.key" :label="column.label"
                :checked="selectCols.includes(column.key)" :type="column.type"
                @click="handleSelectColumn" />
            </template>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4 p-2 rounded-md border border-border shadow-sm">
          <div class="flex flex-col space-y-4">
          <!-- 字体大小 -->
          <div class="flex flex-col gap-1">
            <div class="font-semibold text-sm">字体大小 (mm):</div>
            <div class="flex items-center gap-2 w-40">
              <XInputNumber v-model="container.fontSize" :step="1" size="sm" @change="handleContainerChange" />
            </div>
          </div>

          <!-- 纸张方向 -->
          <div>
            <div class="font-semibold text-sm">纸张方向</div>
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
            <div class="font-semibold text-sm">纸张大小 (mm)</div>
            <div class="flex items-center gap-2">
              <span class="text-xs w-16">长(mm):</span>
              <XInputNumber v-model="container.height" :step="1" size="sm" @change="handleContainerChange" />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs w-16">宽(mm):</span>
              <XInputNumber v-model="container.width" :step="1" size="sm" @change="handleContainerChange" />
            </div>
          </div>
          <!-- 内边距设置 -->
          <div class="flex flex-col space-y-1">
            <div class="font-semibold text-sm">页面边距 (mm)</div>
            <div class="flex items-center gap-2">
              <span class="text-xs w-16">上(mm):</span>
              <XInputNumber v-model="container.padding.top" :step="1" size="sm" @change="handleContainerChange" />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs w-16">下(mm):</span>
              <XInputNumber v-model="container.padding.bottom" :step="1" size="sm" @change="handleContainerChange" />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs w-16">左(mm):</span>
              <XInputNumber v-model="container.padding.left" :step="1" size="sm" @change="handleContainerChange" />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs w-16">右(mm):</span>
              <XInputNumber v-model="container.padding.right" :step="1" size="sm" @change="handleContainerChange" />
            </div>
          </div>
        </div>

        <div class="max-h-full border rounded-md p-3 space-y-3 bg-muted/30 overflow-y-auto">
          <div class="font-semibold text-sm flex items-center gap-2">
            字段显示配置
            <span class="text-xs text-muted-foreground">
              (控制打印预览区域中的显示方式)
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
                  {{ isQrcodeField(field.type!)
                    ? '二维码尺寸(mm)二维码尺寸过小可能会导致无法识别'
                    : (field.wrap ? '标签与内容分行显示' : '标签与内容同行显示') }}
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
                    <span>显示标签</span>
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
                  <XInputNumber v-model="field.size!" size="sm" :min="1" @change="updateOverflowMap" />
                </div>
  
                <button class="hover:text-success" @click="handleSelectColumn(field.key)">
                  <Icon icon="lucide:trash-2" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <XButton label="保存模板" @click="handleSave" />
        </div>
      </div>

      <div
        ref="paperRef"
        class="mx-auto relative bg-white shadow paper-preview"
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
          <template v-if="item.type === 'text'">
            <template v-if="item.wrap">
              <div v-if="item.showField" class="font-medium leading-tight">
                {{ item.label }}:
              </div>
              <div class="leading-tight break-all template-value">
                {{ typeof previewValue === "string" ? previewValue : stripHtmlTags(previewValue[item.key].value) }}
              </div>
            </template>
        
            <template v-else>
              <span class="font-medium" v-if="item.showField">{{ item.label }}:</span>
              <span class="ml-1 break-all template-value">{{ typeof previewValue === "string" ? previewValue : stripHtmlTags(previewValue[item.key].value) }}</span>
            </template>
          </template>

          <template v-else-if="item.type === 'barcode'">
            <div data-barcode>
              <TemplateBarcode data="{value}" :size="item.size ?? 20" />
            </div>
          </template>

          <template v-else>
            <div data-qrcode>
              <TemplateQrcode
                :data="qrcodeStr(previewValue)"
                :size="item.size ?? 25" />
            </div>
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

.overflow-warning {
  outline: 1px dashed #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

.template-item .template-value {
  word-break: break-word;
  white-space: pre-wrap;
}
</style>
