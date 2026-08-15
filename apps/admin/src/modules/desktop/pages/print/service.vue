<script setup lang="ts">
import { Icon } from '@iconify/vue'
import PaperConfig from './component/PaperConfig.vue'
import SelectService from './component/SelectService.vue'
import HeaderTagConfig from './component/HeaderTagConfig.vue'
import BarcodePreview from './component/BarcodePreview.vue'
import QrPreview from './component/QrPreview.vue'
import SelectHeader from './component/SelectHeader.vue'
// import LabelCreate from './component/LabelCreate.vue'

import { hashPrintHeader, textAlign } from '@3un/utils'
import type { CSSProperties } from 'vue'
import { toast } from 'vue-sonner'

import { getServiceFields, getServiceGroups, getServices, updateService } from '@/api/services'
import { type Service, type ServiceDetail, type ServiceGroup } from '@/inters/services'
import type { XSelectProps } from '@3un/ui'
import {
  type TemplateItem,
  type ContainerItem,
  type LabelCreateForm,
  type PrintHeader,
  type ServiceHeader,
  type HeaderTag,
  type PrintTemplateJson,
  type TemplateType
} from './type'
import { functionItems, getQrcodeVal, initContainer, isTextField, ptToPx, pxToMM, scaleOptions } from './utils'
import { handleInputNumberChange, mmToPx } from '@/utils'
import { stripHtmlTags } from './utils'

const isOverflowMap = reactive<Record<string, boolean>>({})

const queryServices = ref<ServiceDetail[]>([])
const serviceId = ref<number>(0)
const container = ref<ContainerItem>(initContainer)
const templateItems = ref<TemplateItem[]>([])
const customLabels = ref<Record<string, LabelCreateForm>>({})
const qrcodeKeys = ref<string[]>([])
const serviceCols = ref<PrintHeader[]>([])
const selectCols = ref<string[]>([])
// const visibleCreateLabel = ref<boolean>(false)
const visibleSelQrHeader = ref<boolean>(false)
const scale = ref<number>(1)

const paperRef = ref<HTMLElement | null>(null)
    
const selectProps: XSelectProps = {
  uiTrigger: 'w-56'
}
    
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

// const resultCol = hashPrintHeader("处理结果")
// const orderResultCol = hashPrintHeader("订单结果")

let storageServices: Service[] = []
let qrFieldKeys: PrintHeader[] = []
let serviceHeaders: ServiceHeader[] = []
let serviceTemplateMap: Map<number, string> = new Map<number, string>()

const isLandscape = computed(() => container.value.orientation === 'landscape')

const processedColumns = computed<HeaderTag[]>(() => (
  serviceCols.value.map(item => ({
    key: item.key,
    label: item.name,
    type: item.type
  }))
))

const paperStyle = computed(() => {
  const width = isLandscape.value ? container.value.height : container.value.width
  const height = isLandscape.value ? container.value.width : container.value.height

  return {
    width: `${mmToPx(width)}px`,
    height: `${mmToPx(height)}px`,
    padding: `${mmToPx(container.value.padding.top)}px
    ${mmToPx(container.value.padding.right)}px
    ${mmToPx(container.value.padding.bottom)}px
    ${mmToPx(container.value.padding.left)}px`,
  }
})

const safeAreaStyle = computed(() => {
  const width = isLandscape.value ? container.value.height : container.value.width
  const height = isLandscape.value ? container.value.width : container.value.height

  const { padding } = container.value

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

const barcodeVal = computed(() => '1234567890')

const previewValue = computed(() => "测试值")

const previewQrcode = computed(() => {
  let res: Record<string, string> = {}

  for (let item of serviceHeaders) {
    res[hashPrintHeader(item.name)] = "测试值"
  }
  return getQrcodeVal({ ...res, ...{ [hashPrintHeader('imei')]: "1234567890" } }, qrcodeKeys.value, processedColumns.value)
})

const containerWrapperStyle = computed(() => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  overflow: 'auto',
  padding: '20px'
}))

const zoomStyle = computed(() => ({
  transform: `scale(${scale.value})`,
  transformOrigin: 'top center',
  transition: 'transform 0.2s ease-in-out'
}))

const scaledPaperStyle = computed<CSSProperties>(() => {
  // const width = isLandscape.value
  //   ? container.value.height
  //   : container.value.width

  const height = isLandscape.value
    ? container.value.width
    : container.value.height

  return {
    // width: `${mmToPx(width) * scale.value}px`,
    height: `${mmToPx(height) * scale.value}px`,
    position: 'relative',
  }
})

async function getQueryService() {
  const groups = await getServiceGroups()
  const services = await getServices({ isUnlock: false })

  storageServices = services

  queryServices.value = processServiceDetail(groups, services)

  for (let item of services) {
    serviceTemplateMap.set(item.packageId, item.template ?? '')
  }
}

function processServiceDetail(groups: ServiceGroup[], services: Service[]) {
  let list: ServiceDetail[] = []

  for (const group of groups) {
    const children: Service[] = []

    for (const item of services) {
      if (item.categoryId === group.categoryId) {
        children.push(item)
      }
    }

    if (children.length > 0) {
      list.push({ ...group, children })
    }

  }

  return list
}

async function getCurServiceFields(serviceId: number) {
  const fields = await getServiceFields({
    page: 1,
    pageSize: 500,
    serviceId: serviceId,
  })

  serviceHeaders = fields.list

  let serviceHeader: ServiceHeader[] = []

  if (!fields || fields.list.length === 0) {
    serviceHeader.push({
      name: '订单结果',
      nameEn: 'result',
    })
  } else {
    serviceHeader = fields.list
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

function initQrField() {
  qrFieldKeys = serviceCols.value.filter(
    c => c.type === 'text' || c.type === 'custom'
  )
}

function processedDefaultTemplate(serviceId: number) {
  const template = serviceTemplateMap.get(serviceId)
  if (!template) {
    container.value = initContainer
    templateItems.value = []
    // customLabels.value = {}
    qrcodeKeys.value = [hashPrintHeader('imei')]
    selectCols.value = []
  } else {
    const json = JSON.parse(template) as PrintTemplateJson
    container.value = json.paper
    templateItems.value = json.items.map(item => ({
      ...item,
      x: mmToPx(item.x),
      y: mmToPx(item.y),
    }))
    qrcodeKeys.value = json.qrcodeKeys
    selectCols.value = templateItems.value.map(i => i.key)
    // customLabels.value = json.customLabels
  }
}

async function handleSelected(value: number) {
  if (value) {
    container.value = initContainer
    templateItems.value = []
    customLabels.value = {}
    qrcodeKeys.value = []
    qrFieldKeys = []
    serviceCols.value = []
    selectCols.value = []
    await getCurServiceFields(value)
    processedDefaultTemplate(value)
    qrcodeKeys.value.push(hashPrintHeader("imei"))
  }
}

function handleSelectColumn(id: string, type: TemplateType = 'text') {
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
      size: isTextField(type) ? 8 : (type === 'barcode' ? 3 : 15),
      showField: true,
      barcodeWidth: 1,
    }

    selectCols.value.push(id)
    templateItems.value.push(newItem)
  }
}

function getNextItemPosition() {
  const baseX = mmToPx(container.value.padding.left)
  const baseY = mmToPx(container.value.padding.top)
  const gap = 0

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

// function handleFieldFunction(id: string) {
//   switch (id) {
//     case "AddTemplate":
//       openCreateCustomLabel()
//       break
//   }
// }

// function openCreateCustomLabel() {
//   visibleCreateLabel.value = true
// }

function applyAlign(key: string, align: string) {
  if (!paperRef.value) return

  const index = templateItems.value.findIndex(t => t.key === key)
  if (index === -1) return

  const el = paperRef.value.querySelector<HTMLElement>(`.template-item[data-key="${key}"]`)
  if (!el) return

  const safe = paperRef.value.querySelector('.safe-area-border') as HTMLElement
  if (!safe) return

  const isLandscape = container.value.orientation === 'landscape'

  const paperWidth = mmToPx(
    isLandscape ? container.value.height : container.value.width
  )

  const elWidth = el.offsetWidth
  const safeWidth = safe.offsetWidth

  const paddingLeft = mmToPx(container.value.padding.left)
  const paddingRight = mmToPx(container.value.padding.right)

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

async function handleWrapChange(key: string) {
  const index = templateItems.value.findIndex(t => t.key === key)
  if (index === -1) return

  await nextTick()
  updateOverflowMap()
  updateAlignPosition()
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

function startDrag(e: MouseEvent, item: TemplateItem) {
  const target = e.currentTarget as HTMLElement
  if (!target) return

  const startX = e.clientX
  const startY = e.clientY
  const initX = item.x
  const initY = item.y

  item.align = undefined

  function move(ev: MouseEvent) {
    const dx = (ev.clientX - startX) / scale.value
    const dy = (ev.clientY - startY) / scale.value

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
  const padding = container.value.padding
  const containerW = mmToPx(isLandscape.value ? container.value.height : container.value.width)
  const containerH = mmToPx(isLandscape.value ? container.value.width : container.value.height)

  // 元素实际宽高
  const elRect = target.getBoundingClientRect()
  const width = elRect.width / scale.value
  const height = elRect.height / scale.value

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
  if (!serviceId.value) return toast.warning('请选择服务后重试')

  const service = storageServices.find(s => s.packageId === serviceId.value)
  if (!service) return toast.warning('请选择正确的服务')

  try {
    const json: PrintTemplateJson = {
      serviceId: serviceId.value,
      isDevice: false,

      paper: container.value,
      items: templateItems.value.map(item => ({
        ...item,
        x: pxToMM(item.x),
        y: pxToMM(item.y),
      })),

      qrcodeKeys: qrcodeKeys.value,
      customLabels: {},
    }

    await updateService({
      ...service,
      packageId: serviceId.value,
      template: JSON.stringify(json),
    })

    serviceTemplateMap.set(serviceId.value, JSON.stringify(json))
    toast.success('更新模板成功')
  } catch {
    toast.warning('更新模板失败, 请重试')
  }
}

// function handleCustomCreate(template: LabelCreateForm) {
//   const templateKey = hashPrintHeader(template.label)
//   const lastIndex = serviceCols.value.length - 1
//   const customColumn: PrintHeader = {
//     key: templateKey,
//     name: template.label,
//     nameEn: template.label,
//     type: 'custom'
//   }

//   serviceCols.value.splice(lastIndex, 0, customColumn)

//   handleSelectColumn(customColumn.key, customColumn.type)
//   customLabels.value[templateKey] = template
//   initQrField()
// }

await getQueryService()
</script>

<template>
  <div>
    <section class="flex items-center p-3 border-b">
      <SelectService
        :services="queryServices"
        :select-props="selectProps"
        v-model="serviceId"
        @selected="handleSelected"
      />
    </section>

    <section class="p-3 flex gap-32">
      <div class="flex-shrink-0 flex flex-col gap-2 min-w-96 max-w-[42%]">
        <HeaderTagConfig :headers="processedColumns" :select-cols="selectCols" @selected="handleSelectColumn" />

        <PaperConfig v-model="container" />

        <div class="min-h-56 max-h-full border rounded-md p-3 space-y-3 bg-muted/30 overflow-y-auto">
          <div class="font-semibold text-sm flex items-center gap-2">
            字段显示配置
            <span class="text-xs text-muted-foreground">
              (控制打印预览区域的显示方式)
            </span>
          </div>

          <div class="space-y-3">
            <div v-for="field in templateItems" :key="field.key"
              class="flex items-center justify-between px-3 py-2 rounded-lg border bg-card hover:bg-muted/50 transition">
              <div class="w-32 truncate font-medium">
                {{ field.label }}
              </div>

              <div class="flex items-center gap-3 flex-wrap">
                <template v-if="isTextField(field.type)">
                  <XInput v-model="field.size" ui-root="w-16" placeholder="字号"
                    @change="(e: Event) => field.size = handleInputNumberChange(e)" />

                  <div class="flex border rounded overflow-hidden">
                    <button v-for="alignItem in textAlign" :key="alignItem.key" class="px-2 py-1 hover:bg-muted"
                      @click="applyAlign(field.key, alignItem.key)">
                      <Icon :icon="alignItem.icon" />
                    </button>
                  </div>

                  <!-- <XSwitch v-model="field.wrap" @change="handleWrapChange(field.key)" /> -->
                  <XSelect v-model="field.wrap" ui-trigger="w-32" @selected="handleWrapChange">
                    <XSelectItem :value="true">标签与内容换行</XSelectItem>
                    <XSelectItem :value="false">标签与内容同行</XSelectItem>
                  </XSelect>

                  <XSelect v-model="field.showField" ui-trigger="w-32">
                    <XSelectItem :value="true">显示标签与内容</XSelectItem>
                    <XSelectItem :value="false">仅显示内容</XSelectItem>
                  </XSelect>

                  <button @click="field.flip = false" class="px-2 py-1 border rounded text-xs hover:bg-primary/50"
                    :class="{ 'bg-primary': !field.flip }">
                    黑底白字
                  </button>

                  <button @click="field.flip = true" class="px-2 py-1 border rounded text-xs"
                    :class="{ 'bg-primary': field.flip }">
                    白底黑字
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
                    <XSelectItem :value="true">显示条码与内容</XSelectItem>
                    <XSelectItem :value="false">仅显示条吗</XSelectItem>
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
                    二维码设置
                  </button>

                  <XInput v-model="field.size" ui-root="w-16"
                    @change="(e: Event) => field.size = handleInputNumberChange(e)" />
                </template>

                <button class="text-muted-foreground hover:text-destructive" @click="handleSelectColumn(field.key)">
                  <Icon icon="lucide:trash-2" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex">
          <XButton class="flex-1" label="保存服务默认模板" @click="handleSave" />
        </div>
      </div>

      <div class="flex-1 flex flex-col items-center gap-y-4">
        <div class="w-full flex items-center gap-2 text-sm text-muted-foreground">
          <span class="flex-1 h-px bg-zinc-300 dark:bg-zinc-700"></span>
          <div class="flex items-center gap-2 px-2">
            <span>预览缩放:</span>
            <div class="divide-x border rounded-md">
              <button
                class="px-2 py-1"
                :class="{ 'bg-primary/80 text-white': scale === opt.value }"
                v-for="opt in scaleOptions" :value="opt.value"
                @click="scale = opt.value"
              >
                <span>{{ opt.label }}</span>
              </button>
            </div>
          </div>
          <span class="flex-1 h-px bg-zinc-300 dark:bg-zinc-700"></span>
        </div>

        <div :style="containerWrapperStyle">
          <div :style="scaledPaperStyle">
            <div :style="zoomStyle">
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
                        {{ item.label }}:
                      </div>
                      <div class="leading-tight break-all template-value">
                        {{ typeof previewValue === "string" ? previewValue : stripHtmlTags(previewValue[item.key]) }}
                      </div>
                    </template>
  
                    <template v-else>
                      <span class="font-medium" v-if="item.showField">{{ item.label }}:</span>
                      <span class="ml-1 break-all template-value">
                        {{ typeof previewValue === "string" ? previewValue : stripHtmlTags(previewValue[item.key]) }}
                      </span>
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
                      <QrPreview :data="previewQrcode" :size="item.size ?? 25" />
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <SelectHeader :headers="qrFieldKeys" v-model:keys="qrcodeKeys" v-model="visibleSelQrHeader" />
    <!-- <LabelCreate v-model="visibleCreateLabel" @create="handleCustomCreate" /> -->
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
