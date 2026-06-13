<script setup lang="ts">
import OrderResultModal from './components/OrderResultModal.vue'
import { Icon } from '@iconify/vue'

import { toast } from 'vue-sonner'
import { twJoin } from 'tailwind-merge'
import dayjs from 'dayjs'


import type { SubmitStore } from './utils'
import { serviceApi, type Service } from '@/api/services'
import type { Order, OrderSubmitResult } from '@/api/orders'

import { ua, IMEIValidator, xconfirm, createFormData } from '@3un/utils'
import { getSubmitImei, base64ToFile } from '@/utils'
import { IMEI_TYPE, ORDER_STATUS, ORDER_VERIFY } from '@3un/utils'
import type { XNativeSelectValue } from '@3un/ui'

import { findNodes, SUBMIT_STORE } from './utils'
import { orderApi } from '@/api/orders'
import { wxApi } from '@/api/wx'
import type { AxiosResponse } from 'axios'
import OrderHistoryModal from './components/OrderHistoryModal.vue'
import ServiceItemCard from './components/ServiceItemCard.vue'
import ExportDialog from './components/ExportDialog.vue'

interface TheProps {
  id: string
  imei: string
}

const props = defineProps<TheProps>()

const serviceStore = useServiceStore()
await serviceStore.getServices()

const importDialog = ref<boolean>(false)

const { connect, close } = useWsStore()
const uStore = useUserStore()
const favoriteData = ref<any[]>([])
const favoriteIds = ref<number[]>([])
const storeService = useServiceStore()

const { locale } = useI18n()
const localStore = useLocalStore()

const store: SubmitStore = reactive({
  service: undefined,
  serviceId: 0,
  rawOrders: [],
  visible: false,
  visibleHistory: false,
  count: 0,
  serviceHeader: [],
})

provide(SUBMIT_STORE, store)

const formatLoading = ref(false)
const submitLoading = ref(false)

const form = reactive({
  groupId: getGroupId(+props.id),
  serviceId: +props.id,
  pushMsg: true,
  remark: '',
  imei: props.imei || '',
})

// const imeis = ref<string>('')

const mode = import.meta.env.VITE_APP_MODE

const textBtnModes = [
  'JiuXing',
]

const options = computed(() => {
  const findIndex = serviceStore.details
    .findIndex(item => item.id === form.groupId)

  if (findIndex === -1) return []
  return serviceStore.details[findIndex].children
})

const unitPrice = computed(() => {
  const service = serviceStore.services.get(store.serviceId)

  if (!service) return "0.00"
  return service.price
})

const validImeiList = computed(() => handleImei(form.imei))
const fileInputRef = useTemplateRef('fileInputRef')

const usefulCount = computed(() => {
  if (!store.service) return
  return Math.floor(+uStore.info.credits / store.service.price)
})

onBeforeMount(async () => {
  if (!props.id) return
  store.serviceId = +props.id
  store.service = serviceStore.services.get(+props.id)
})

function getGroupId(serviceId: number) {
  const group = serviceStore.services.get(serviceId)
  return group?.parentId || -1
}

function handleScan() {
  if (!store.serviceId) return toast.warning(localStore.localData['submit_ServicePlaceholderTable'])

  window.wx.scanQRCode({
    needResult: 1,
    scanType: ['qrCode', 'barCode'],
    fail: (res: any) => window.alert(res.errMsg),
    success: (res: any) => {
      const imei = res.resultStr.split(',')[1]
      if (!imei) return toast.warning(localStore.localData['submit_NullImei'])

      const trimed = form.imei.trim()
      form.imei = trimed ? `${trimed}\n${imei}` : imei
    },
  })
}

async function handleServiceCols(value: number) {
  const { data } = await serviceApi.header(value)

  store.serviceHeader = data.map(item => (locale.value === 'zh' ? item.name : item.nameEn ? item.nameEn : item.name))
}

// 原前端上传文件IMEI/SN处理逻辑
// async function handleFileChange(event: Event) {
//   if (!store.serviceId) return toast.warning(t('query.prompt.serviveNull'))

//   const file = (event.target as HTMLInputElement).files![0]
//   const extension = file.name.split('.').pop()!.toLowerCase()
//   let text = ''

//   try {
//     if (['txt', 'csv'].includes(extension)) {
//       text = await file.text()
//     }
//     else if (['xlsx', 'xls'].includes(extension)) {
//       const buffer = await file.arrayBuffer()
//       const workbook = XLSX.read(buffer)
//       const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
//       const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })
//       text = data.flat().filter(Boolean).join('\n')
//     }

//     const trimed = form.imei.trim()
//     const imeiList = handleImei(text).join('\n')
//     form.imei = trimed ? `${trimed}\n${imeiList}` : imeiList
//   } catch (error) {
//     console.error('[File parse error]', error)
//     toast.error(t('query.prompt.file'))
//   }
// }

// 上传文件 后端处理IMEI/SN逻辑
async function handleFileChange(event: Event) {
  if (!store.serviceId) return toast.warning(localStore.localData['submit_ServicePlaceholderTable'])

  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  // 验证文件类型
  const extension = file.name.split('.').pop()?.toLowerCase()
  const validExtensions = ['txt', 'csv', 'xlsx', 'xls']
  if (!extension || !validExtensions.includes(extension)) {
    toast.warning('不支持的文件格式，请上传 txt、csv、xlsx 或 xls 文件')
    return
  }

  // 验证文件大小
  if (file.size > 50 * 1024 * 1024) {
    toast.warning('文件过大，请上传小于50MB的文件')
    return
  }

  try {
    // 创建 FormData
    const formData = createFormData({
      file: file,
    })
    serviceStore.importFile = file
    const res = await serviceApi.importFile(formData)

    if (res.data.success) {
      form.imei = res.data.collected.join('\n')
    } else {
      importDialog.value = true
    }

  } catch (error) {
  } finally {
    // 清空 input
    (event.target as HTMLInputElement).value = ''
  }
}

// 上传文件同时包含IMEI和sn, 提示框提交逻辑
async function handSubmit(mode: number) {
  try {
    if (!serviceStore.importFile) {
      toast.warning('请先选择文件')
      return
    }

    const formData = createFormData({
      file: serviceStore.importFile,
      type: mode
    })

    const res = await serviceApi.importFile(formData)

    console.log(res)

    // 验证返回数据
    if (res.data?.collected && Array.isArray(res.data.collected)) {
      form.imei = res.data.collected.join('\n')
      importDialog.value = false
    } else {
      toast.warning('未检测到有效数据')
    }

  } catch (error) {
    console.error('导入失败:', error)
    toast.error('文件导入失败，请重试')
  }
}

function handleImei(text = '') {
  const imeiType = store.service?.imeiType || IMEI_TYPE.NONE
  const service = serviceStore.services.get(form.serviceId)

  let validList: string[] = []
  if (service) {
    validList = getSubmitImei(text, imeiType, service.domesticSerialType)
  }

  // 防止 IMEI 和 SN 混用时识别为空
  if (validList.length === 0 && imeiType !== IMEI_TYPE.SN) {
    validList = IMEIValidator.findAllImeis(text)
  }

  return validList
}

function handlePhoto() {
  if (!store.serviceId) return toast.warning(localStore.localData['submit_ServicePlaceholderTable'])

  window.wx.chooseImage({
    sizeType: ['original'],
    sourceType: ['camera'],
    fail: (res) => window.alert(res.errMsg),
    success: (res) => {
      const localId = res.localIds[0]
      formatLoading.value = true

      getImageData(localId).then((data) => {
        const file = base64ToFile(data)
        const formData = new FormData()
        formData.append('file', file)

        const response = wxApi.ocr(formData)
        response.then(({ data }) => {
          const imeiList = handleImei(data).join('\n')
          const trimed = form.imei.trim()

          form.imei = trimed ? `${trimed}\n${imeiList}` : imeiList
          formatLoading.value = false
        })

        response.catch((err) => {
          if (err.code === "ECONNABORTED") {
            return toast.error(localStore.localData['submit_RequestTimeout'])
          }
          return toast.error(localStore.localData['submit_RequestError'])
        })

        response.finally(() => {
          formatLoading.value = false
        })
      })
    },
  })
}

function handlePickImage() {
  if (!store.serviceId) return toast.warning(localStore.localData['submit_ServicePlaceholderTable'])

  window.wx.chooseImage({
    count: 9,
    sizeType: ['original'],
    sourceType: ['album'],
    fail: (res) => window.alert(res.errMsg),
    success: async ({ localIds }) => {
      formatLoading.value = true

      const imageDataList = await Promise.all(localIds.map(getImageData))
      const result = await Promise.all(imageDataList.map(async (data) => {
        const file = base64ToFile(data)
        const formData = new FormData()
        formData.append('file', file)

        try {
          const response = await wxApi.ocr(formData)
          return response.data
        } catch (err: AxiosResponse | any) {
          if (err.code === "ECONNABORTED") {
            return toast.error(localStore.localData['submit_RequestTimeout'])
          }
          return toast.error(localStore.localData['submit_RequestError'])
        } finally {
          formatLoading.value = false
        }
      }))

      const ocrText = result.toString()
      const imeiList = handleImei(ocrText).join('\n')
      const trimed = form.imei.trim()

      form.imei = trimed ? `${trimed}\n${imeiList}` : imeiList
      formatLoading.value = false
    },
  })
}

function handleFileInput() {
  if (!store.serviceId) return toast.warning(localStore.localData['submit_ServicePlaceholderTable'])
  fileInputRef.value?.click()
}

function getImageData(localId: string) {
  return new Promise<string>((resolve, reject) => {
    window.wx.getLocalImgData({
      localId: localId,
      fail: (res) => reject(res.errMsg),
      success: ({ localData }) => {
        let base64 = localData

        // 在 iOS 上，需要去掉 data:image/jpeg;base64, 前缀
        if (ua.os === 'iOS') {
          base64 = base64.replace(/^data:image\/\w+;base64,/, '')
        }

        resolve(base64)
      },
    })
  })
}

function handleServiceChange(value: XNativeSelectValue) {
  store.service = serviceStore.services.get(+value!)
  store.serviceId = +value!
  store.rawOrders = []
  form.groupId = findNodes(storeService.details, { mode: 'parent', targetId: +value! }) as any
  form.serviceId = store.serviceId
  store.count = 0
  handleServiceCols(+value!)

  if (form.imei.trim()) {
    form.imei = handleImei(form.imei).join('\n')
  }
}

function handleSubmit() {
  if (!store.service) {
    return toast.warning(localStore.localData['submit_ServicePlaceholderTable'])
  }

  if (!form.imei.trim()) {
    return toast.warning(localStore.localData['submit_NullImei'])
  }

  submitLoading.value = true

  if (store.service.isUnlock) {
    return submitOrder(store.service)
  }

  submitQueryOrder(store.service)
}

function submitQueryOrder(service: Service) {
  const { data, status } = connect({
    serviceId: service.id,
    type: 'order',
  })

  watch(
    status,
    (value) => {
      if (value !== 'OPEN') {
        console.warn('[3un] WebSocket 连接失败', value)
        return
      }

      submitOrder(service)
      uStore.updateCredit()
    },
    { once: true }
  )

  watch(data, (value) => {
    if (!value) return

    handleOrder(JSON.parse(value))
    handleCount()
  })
}

function submitOrder(service: Service) {
  const params = {
    groupId: service.parentId,
    serviceId: service.id,
    imeiList: validImeiList.value,
    remark: form.remark,
    isBulk: !form.pushMsg,
    language: locale.value,
  }

  const response = orderApi.submit(params)
  response.then(({ data }) => {
    serviceStore.addRecentService(service.id)

    // 缓存这一批提交的订单id
    const codeIds = data.map(item => item.codeId)
    localStorage.setItem('codeIds', JSON.stringify(codeIds))

    const errorOrders = data.map(item => `${item.imei}: ${item.message ? item.message : localStore.localData['submit_SubmitSuccess']}`)

    if (service.isUnlock) {
      xconfirm({
        title: localStore.localData['submit_OrderResultTable'],
        text: errorOrders.join('<br>'),
      })

      return
    }

    store.count = data.length
    fillSubmitOrderResult(data)

    store.visible = true
  })

  response.catch((err) => {
    console.error('[3un] 提交订单失败', err)
    close()
  })

  response.finally(() => {
    submitLoading.value = false

    if (service.isUnlock) {
      form.imei = ''
    }
  })
}

function fillSubmitOrderResult(data: OrderSubmitResult[]) {
  const buckets: (Order & { index?: number })[] = []

  for (let i = 0; i < data.length; i++) {
    const item = data[i]

    const index = validImeiList.value.indexOf(item.imei)

    if (index === -1) return console.error('[3un] IMEI 不存在', item)

    const isFailed = item.status === ORDER_STATUS.FAILED
    if (isFailed) handleCount()

    buckets.push({
      id: item.codeId ?? 0, index: i,
      serviceId: form.serviceId,
      credits: store.service?.price || 0,
      result: isFailed ? item.message : localStore.localData['submit_ProcessingOrder'],
      verify: ORDER_VERIFY.NORMAL,
      status: item.status,
      imei: item.imei,
      remark: form.remark,
      createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      recommends: [],
    })
  }

  store.rawOrders.length = 0
  store.rawOrders.push(...buckets)
}

function handleOrder(order: Order) {
  const index = validImeiList.value.indexOf(order.imei)
  if (index === -1) return console.error('[3un] IMEI 不存在', order)

  store.rawOrders.splice(index, 1, {
    ...store.rawOrders[index],
    ...order,
  })
}

async function handleCount() {
  store.count = store.count - 1

  if (store.count === 0) {
    form.imei = ''
    form.remark = ''
    return close()
  }
}

function handlePushMsgChange(value: boolean) {
  if (value) return

  const confirm = window.confirm(localStore.localData['submit_PushResultToast'])
  if (!confirm) form.pushMsg = true
}

function handleOpenOrder() {
  if (store.serviceId == 0) return toast.warning(localStore.localData['submit_ServicePlaceholderTable'])

  store.visibleHistory = true
}

onBeforeMount(() => { })



async function favoriteClick(serviceId: number | undefined) {
  try {
    const res = await serviceApi.favorite(serviceId)
    favoriteIds.value = res.data
    favoriteData.value = findNodes(storeService.details, { mode: 'children', targetIds: res.data }) as any
  } catch {
  }
}

const imeiCount = computed(() => {
  return form.imei && form.imei.trim() !== ''
    ? form.imei.split('\n').filter(item => item.trim() !== '').length
    : 0
})

onMounted(() => {
  favoriteClick(undefined)
})

// const { t } = useI18n()
</script>

<template>
  <div class="w-full h-full">
    <!-- 收藏服务 -->
    <div v-if="favoriteData.length > 0" class="flex flex-col m-2 max-h-56 bg-card rounded-lg">
      <div @click="favoriteClick(undefined)" class="font-bold w-full h-8 border-b text-center pt-1">
        {{ localStore.localData['submit_FavoriteService'] }}
      </div>

      <section class="flex-1 overflow-auto">
        <ServiceItemCard @click="handleServiceChange(item.id)" v-for="item in favoriteData" :key="item.id" :data="item"
          :data-id="item.id" @update-service="favoriteClick(undefined)" />
      </section>
    </div>

    <section class="m-2 bg-card rounded-lg">
      <div @click="favoriteClick(undefined)" class="font-bold w-full h-8 border-b text-center pt-1">
        {{ localStore.localData['submit_SubmitOrders'] }}
      </div>

      <div class="p-2 space-y-4">

        <div>
          <div class="flex items-center justify-between mb-2">
            <h2 class="font-medium">{{ localStore.localData['submit_SelectServicesTiltle'] }}</h2>
            <RouterLink v-if="form.serviceId" :to="`/service/${form.serviceId}`"
              class="flex items-center text-sm text-muted-foreground">
              {{ localStore.localData['submit_ServiceDescription'] }}
              <Icon icon="lucide:chevron-right" />
            </RouterLink>
          </div>
          <div class="flex space-x-2">
            <XNativeSelect v-model="form.groupId" :default="-1" :options="[...serviceStore.details]"
              @change="form.serviceId = 0" :placeholder="localStore.localData['submit_SelectGroup']" label-key="title" value-key="id"
              class="w-full" />
            <XNativeSelect v-model="form.serviceId" :default="0" :options="options" :disabled="form.groupId === -1"
              @change="handleServiceChange" :placeholder="localStore.localData['submit_ServicePlaceholderTable']" label-key="title" value-key="id"
              class="w-full" />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <h2 class="font-medium">IMEI/SN</h2>
            <div class="flex items-center space-x-2">
              <template v-if="textBtnModes.includes(mode)">
                <button :class="twJoin(
                  'flex items-center justify-center',
                  'text-muted-foreground rounded-full',
                  'h-8 text-sm bg-muted'
                )" @click="handleFileInput">
                  <span>{{ localStore.localData['submit_Import'] }}</span>
                </button>
              </template>

              <!-- 导入文件 -->
              <template v-else>
                <button :class="twJoin(
                  'flex items-center justify-center size-8',
                  'bg-muted text-muted-foreground rounded-full',
                )" @click="handleFileInput">
                  <Icon icon="lucide:file-input" />
                </button>
              </template>

              <button v-if="ua.isWechat" :class="twJoin(
                'flex items-center justify-center size-8',
                'bg-muted text-muted-foreground rounded-full',
              )" @click="handleScan">
                <Icon icon="lucide:scan-line" />
              </button>

              <button v-if="form.serviceId !== 0" :class="twJoin(
                'flex items-center justify-center size-8',
                'bg-muted text-muted-foreground rounded-full',
              )" @click="favoriteClick(form.serviceId)">
                <Icon :icon="favoriteIds.includes(form.serviceId) ? 'tabler:star-filled' : 'tabler:star'"
                  :class="favoriteIds?.includes(form.serviceId) ? 'text-yellow-500' : 'text-gray-400'" />

              </button>

            </div>
          </div>

          <div class="relative mb-2">
            <div class="flex justify-between space-x-2">
              <XTextarea v-model="form.imei" rows="5" :placeholder="localStore.localData['submit_ImportIMEIPlaceholder']" />


              <div  class="flex flex-col justify-between py-1">
                <XButton variant="outline" size="sm" icon="gridicons:aside" :label="localStore.localData['submit_OrdersHistory']" color="primary"
                  :loading="submitLoading" @click="handleOpenOrder">
                </XButton>

                <XButton v-if="ua.isWechat" variant="outline" size="sm" :label="localStore.localData['submit_SelectImg']" color="success"
                  icon="lucide:image-up" @click="handlePickImage" />

                <XButton v-if="ua.isWechat" variant="outline" size="sm" :label="localStore.localData['submit_TakePhoto']" icon="lucide:camera"
                  @click="handlePhoto" />
              </div>
            </div>

            <div class="flex flex-col">

              <div class="flex space-x-2">
                <div class="text-sm text-muted-foreground">{{ localStore.localData['submit_ImportVaildQuantity'] }}：{{ imeiCount }}</div>
                
                <span v-if="store.service" class="text-sm text-muted-foreground">{{ localStore.localData['submit_ImportUnitPrice'].replace('@', unitPrice) }}</span>
              </div>

              <span v-if="store.service" class="text-sm text-muted-foreground">{{ localStore.localData['submit_ImportBlance'] }}: ￥{{
                uStore.info.credits }}, {{ localStore.localData['submit_ImportSubmitOrder'].replace('@', unitPrice) }}</span>
            </div>
            <!-- <span v-if="store.service" class="text-sm text-muted-foreground">{{ t('query.prompt.balance') }}: ￥{{ uStore.info.credits }}, {{ t('query.submitCount', { count: usefulCount }) }}</span> -->
            <div v-show="formatLoading" class="absolute top-2 right-2 text-sm text-muted-foreground">
              <Icon icon="svg-spinners:270-ring" class="text-primary" />
            </div>
          </div>

          <input ref="fileInputRef" type="file" hidden accept=".xlsx,.xls,.csv,.txt" @change="handleFileChange" />


        </div>

        <div>
          <h2 class="font-medium mb-2">{{ localStore.localData['submit_Additional'] }}</h2>
          <XTextarea v-model="form.remark" :placeholder="localStore.localData['submit_ImportRemarkPlaceholder']" class="mb-3" />

          <XSwitch v-model="form.pushMsg" :label="localStore.localData['submit_PushResultToast']" @change="handlePushMsgChange" />
        </div>

        <XButton class="w-full" :label="localStore.localData['submit_Submit']" :loading="submitLoading" @click="handleSubmit" />

        <OrderResultModal />
        <OrderHistoryModal :service-id="store.serviceId" />
      </div>
    </section>


    <XDialog v-model="importDialog" :maskClosable="false" ui-root="p-0 sm:p-0 sm:max-w-[450px]" draggable>
      <template #header>
        <div class="p-2">
          <div class="w-full text-center">{{ localStore.localData['submit_FileImportSelect'] }}</div>
          <div @click="importDialog = false" class="fixed top-1 right-4">x</div>
        </div>
      </template>
      <ExportDialog @update-mode="handSubmit" />
    </XDialog>
  </div>

</template>
