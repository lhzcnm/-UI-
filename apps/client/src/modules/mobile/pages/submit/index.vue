<script setup lang="ts">
import OrderResultModal from './components/OrderResultModal.vue'
import { Icon } from '@iconify/vue'

import { toast } from 'vue-sonner'
import { twJoin } from 'tailwind-merge'
import * as XLSX from 'xlsx'

import type { SubmitStore } from './utils'
import type { Service } from '@/api/services'
import type { Order, OrderSubmitResult } from '@/api/orders'

import { ua, IMEIValidator } from '@3un/utils'
import { getSubmitImei, base64ToFile } from '@/utils'
import { IMEI_TYPE, ORDER_STATUS, ORDER_VERIFY } from '@3un/utils'
import type { XNativeSelectValue } from '@3un/ui'

import { SUBMIT_STORE } from './utils'
import { orderApi } from '@/api/orders'
import { wxApi } from '@/api/wx'

const props = defineProps<{ id: string }>()

const serviceStore = useServiceStore()
await serviceStore.getServices()

const { connect, close } = useWsStore()
const uStore = useUserStore()

const store: SubmitStore = reactive({
  service: undefined,
  serviceId: 0,
  rawOrders: [],
  visible: false,
  count: 0,
})

provide(SUBMIT_STORE, store)

const formatLoading = ref(false)
const submitLoading = ref(false)

const form = reactive({
  groupId: getGroupId(+props.id),
  serviceId: +props.id,
  pushMsg: true,
  remark: '',
  imei: '',
})

const options = computed(() => {
  const findIndex = serviceStore.details
    .findIndex(item => item.id === form.groupId)

  if (findIndex === -1) return []
  return serviceStore.details[findIndex].children
})

const validImeiList = computed(() => handleImei(form.imei))
const fileInputRef = useTemplateRef('fileInputRef')

onBeforeMount(() => {
  if (!props.id) return
  store.serviceId = +props.id
  store.service = serviceStore.services.get(+props.id)
})

function getGroupId(serviceId: number) {
  const group = serviceStore.services.get(serviceId)
  return group?.parentId || -1
}

function handleScan() {
  if (!store.serviceId) return toast.warning('请先选择服务')

  window.wx.scanQRCode({
    needResult: 1,
    scanType: ['qrCode', 'barCode'],
    fail: (res: any) => window.alert(res.errMsg),
    success: (res: any) => {
      const imei = res.resultStr.split(',')[1]
      if (!imei) return toast.warning('识别不到IMEI/SN')

      const trimed = form.imei.trim()
      form.imei = trimed ? `${trimed}\n${imei}` : imei
    },
  })
}

async function handleFileChange(event: Event) {
  if (!store.serviceId) return toast.warning('请先选择服务')

  const file = (event.target as HTMLInputElement).files![0]
  const extension = file.name.split('.').pop()!.toLowerCase()
  let text = ''

  try {
    if (['txt', 'csv'].includes(extension)) {
      text = await file.text()
    }
    else if (['xlsx', 'xls'].includes(extension)) {
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer)
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
      const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })
      text = data.flat().filter(Boolean).join('\n')
    }

    const trimed = form.imei.trim()
    const imeiList = handleImei(text).join('\n')
    form.imei = trimed ? `${trimed}\n${imeiList}` : imeiList
  } catch (error) {
    console.error('[File parse error]', error)
    toast.error('文件解析错误')
  }
}

function handleImei(text = '') {
  const imeiType = store.service?.imeiType || IMEI_TYPE.NONE
  let validList = getSubmitImei(text, imeiType)

  // 防止 IMEI 和 SN 混用时识别为空
  if (validList.length === 0 && imeiType !== IMEI_TYPE.SN) {
    validList = IMEIValidator.findAllImeis(text)
  }

  return validList
}

function handlePhoto() {
  if (!store.serviceId) return toast.warning('请先选择服务')

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
      })
    },
  })
}

function handlePickImage() {
  if (!store.serviceId) return toast.warning('请先选择服务')

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

        const response = await wxApi.ocr(formData)
        return response.data
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
  if (!store.serviceId) return toast.warning('请先选择服务')
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
  store.count = 0

  if (form.imei.trim()) {
    form.imei = handleImei(form.imei).join('\n')
  }
}

function handleSubmit() {
  if (!store.service) {
    return toast.warning('请先选择服务')
  }

  if (!form.imei.trim()) {
    return toast.warning('未识别到 IMEI/SN')
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
  }

  const response = orderApi.submit(params)
  response.then(({ data }) => {
    serviceStore.addRecentService(service.id)

    if (service.isUnlock) {
      toast.success('提交成功，请稍后前往"订单"页面查看')
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
      id: 0, index: i,
      serviceId: form.serviceId,
      credits: store.service?.price || 0,
      result: isFailed ? item.message : '订单处理中',
      verify: ORDER_VERIFY.NORMAL,
      status: item.status,
      imei: item.imei,
      remark: form.remark,
      createTime: '刚刚',
      recommends: [],
    })
  }

  store.rawOrders = buckets
}

function handleOrder(order: Order) {
  const index = validImeiList.value.indexOf(order.imei)
  if (index === -1) return console.error('[3un] IMEI 不存在', order)

  store.rawOrders[index] = {
    ...store.rawOrders[index],
    ...order,
  }
}

function handleCount() {
  store.count = store.count - 1

  if (store.count === 0) {
    form.imei = ''
    form.remark = ''
    return close()
  }
}

function handlePushMsgChange(value: boolean) {
  if (value) return
  
  const confirm = window.confirm('确定不接收公众号推送结果吗？')
  if (!confirm) form.pushMsg = true
}
</script>

<template>
  <div class="p-4 m-3 space-y-4 bg-card rounded-lg">
    <div>
      <div class="flex items-center justify-between mb-2">
        <h2 class="font-medium">选择服务</h2>
        <RouterLink
          v-if="form.serviceId"
          :to="`/service/${form.serviceId}`"
          class="flex items-center text-sm text-muted-foreground"
        >
          查看服务说明
          <Icon icon="lucide:chevron-right" />
        </RouterLink>
      </div>
      <div class="space-y-2">
        <XNativeSelect
          v-model="form.groupId"
          :default="-1"
          :options="[...serviceStore.details]"
          @change="form.serviceId = 0"
          placeholder="请选择服务组"
          label-key="title"
          value-key="id"
          class="w-full"
        />
        <XNativeSelect
          v-model="form.serviceId"
          :default="0"
          :options="options"
          :disabled="form.groupId === -1"
          @change="handleServiceChange"
          placeholder="请选择服务"
          label-key="title"
          value-key="id"
          class="w-full"
        />
      </div>
    </div>

    <div>
      <div class="flex items-center justify-between mb-2">
        <h2 class="font-medium">IMEI/SN 信息</h2>
        <div class="flex items-center space-x-2">
          <button 
            :class="twJoin(
              'flex items-center justify-center size-8',
              'bg-muted text-muted-foreground rounded-full',
            )"
            @click="handleFileInput"
            title="导入文件"
          >
            <Icon icon="lucide:file-input" />
          </button>
          <button
            v-if="ua.isWechat"
            :class="twJoin(
              'flex items-center justify-center size-8',
              'bg-muted text-muted-foreground rounded-full',
            )"
            @click="handleScan"
            title="扫码"
          >
            <Icon icon="lucide:scan-line" />
          </button>
        </div>
      </div>

      <div class="relative">
        <XTextarea
          v-model="form.imei" rows="5"
          placeholder="IMEI/SN，一行一个&#13;&#10;支持导入 txt、csv、xlsx、xls 文件"
        />
        <div v-show="formatLoading" class="absolute top-2 right-2 text-sm text-muted-foreground">
          <Icon icon="svg-spinners:270-ring" class="text-primary" />
        </div>
      </div>

      <input
        ref="fileInputRef"
        type="file" hidden
        accept=".xlsx,.xls,.csv,.txt" 
        @change="handleFileChange"
      />

      <div v-if="ua.isWechat" class="flex items-center justify-between space-x-2">
        <XButton
          class="w-full" label="选择图片"
          color="success" icon="lucide:image-up" @click="handlePickImage"
        />
        <XButton
          class="w-full" label="拍照识别"
          icon="lucide:camera" @click="handlePhoto"
        />
      </div>
    </div>

    <div>
      <h2 class="font-medium mb-2">附加信息</h2>
      <XTextarea 
        v-model="form.remark"
        placeholder="备注信息（可选）"
        class="mb-3"
      />

      <XSwitch
        v-model="form.pushMsg"
        label="推送结果(提交量较大时，建议关闭)"
        @change="handlePushMsgChange"
      />
    </div>

    <XButton
      class="w-full"
      label="提交订单"
      :loading="submitLoading"
      @click="handleSubmit"
    />

    <OrderResultModal />
  </div>
</template>
