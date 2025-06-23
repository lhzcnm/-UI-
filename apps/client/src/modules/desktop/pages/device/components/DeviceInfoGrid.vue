<script setup lang="ts">
import { tv } from 'tailwind-variants'
import { useClipboard } from '@vueuse/core'
import { toast } from 'vue-sonner'
import { Icon } from '@iconify/vue'
import { xconfirm } from '@3un/utils'

import http from '@/utils/http'
import { wsFetch, STORE } from '../utils'

const style = tv({
  slots: {
    label: 'inline-block w-[88px] text-muted-foreground',
    value: 'cursor-pointer hover:text-primary active:text-primary/80 break-all',
  },
})

const store = inject(STORE)!
const uStore = useUserStore()

const { copy } = useClipboard({ legacy: true })

const form = computed({
  get: () => store.deviceMap.get(store.selected)!.summary,
  set: (value) => store.deviceMap.get(store.selected)!.summary = value,
})

const cache = computed({
  get: () => store.deviceMap.get(store.selected)!.cache,
  set: (value) => store.deviceMap.get(store.selected)!.cache = value,
})

const defaultState = form.value.ActivationState
const isActivated = ref(defaultState === '已激活')

const loadings = reactive({
  networkLock: false,
  activationLock: false,
  warranty: false,
})

async function handleActivation() {
  const suffix = isActivated.value ? 'deactivate' : 'activation'
  const [_, uniqueId] = store.selected.split(':')
  
  await wsFetch({ type: suffix, Uid: uniqueId })
  isActivated.value = !isActivated.value
  form.value.ActivationState = isActivated.value ? '已激活' : '未激活'
}

async function handleNetworkLock() {
  if (!await checkFreecount('NetworkLock')) return

  loadings.networkLock = true
  const { info } = store.deviceMap.get(store.selected)!
  const response = http.post('/device/query', {
    imei: info.InternationalMobileEquipmentIdentity,
    imei2: info.InternationalMobileEquipmentIdentity2,
    sn: info.SerialNumber,
    type: 'NetworkLock',
  })

  response.then(({ data }) => {
    form.value.NetworkLock = data
    cache.value.hasNetworkLock = true
    cache.value.showNetworkLock = true
    uStore.updateCredit()
  })

  response.finally(() => {
    loadings.networkLock = false
  })
}

async function handleActivationLock() {
  if (! await checkFreecount('ActivationLock')) return

  loadings.activationLock = true
  const { info } = store.deviceMap.get(store.selected)!
  const response = http.post('/device/query', {
    imei: info.InternationalMobileEquipmentIdentity,
    imei2: info.InternationalMobileEquipmentIdentity2,
    sn: info.SerialNumber,
    type: 'ActivationLock',
  })

  response.then(({ data }) => {
    form.value.ActivationLock = data
    cache.value.hasActivationLock = true
    cache.value.showActivationLock = true
    uStore.updateCredit()
  })

  response.finally(() => {
    loadings.activationLock = false
  })
}

async function handleWarranty() {
  if (!await checkFreecount('Warranty')) return

  loadings.warranty = true
  const { info } = store.deviceMap.get(store.selected)!
  const response = http.post('/device/query', {
    imei: info.InternationalMobileEquipmentIdentity,
    sn: info.SerialNumber,
    type: 'Warranty',
  })

  response.then(({ data }) => {
    cache.value.hasWarranty = true
    cache.value.showWarranty = true
    form.value.Warranty = data
    uStore.updateCredit()
  })

  response.finally(() => {
    loadings.warranty = false
  })
}

async function checkFreecount(type: string) {
  const { data } = await http.get(`/device/query/${type}`)
  if (data.freeCount > 0) return true
  return await xconfirm`
    当前账户该服务已无免费查询次数<br>
    如果继续查询，将扣除 ${data.price} 积分
  `
}

async function cp(event: MouseEvent) {
  const target = event.target as HTMLElement
  const text = target.textContent

  if (text && text.trim()) {
    await copy(text.trim())
    toast.success('复制成功')
  }
}

type CacheKey = keyof (typeof cache.value)
function showPrevCache(type: CacheKey) {
  cache.value[type] = true
}

const b = style()
</script>

<template>
  <div class="flex gap-4 p-4 bg-card">
    <div class="flex-1 space-y-1">
      <div>
        <span :class="b.label()">序列号</span>
        <span :class="b.value()" @click="cp">
          {{ form.SerialNumber }}
        </span>
      </div>
      <div>
        <span :class="b.label()">串号</span>
        <span :class="b.value()" @click="cp">
          {{ form.Imei }}
        </span>
      </div>
      <div>
        <span :class="b.label()">型号号码</span>
        <span :class="b.value()" @click="cp">
          {{ form.ModelNumber }} {{ form.RegionInfo }}
        </span>
      </div>
      <div>
        <span :class="b.label()">产品类型</span>
        <span :class="b.value()" @click="cp">
          {{ form.ProductType }}
        </span>
      </div>
      <div>
        <span :class="b.label()">系统版本</span>
        <span :class="b.value()" @click="cp">
          {{ form.ProductVersion }} ({{ form.BuildVersion }})
        </span>
      </div>
      <div>
        <span :class="b.label()">主板序号</span>
        <span :class="b.value()" @click="cp">
          {{ form.MLBSerialNumber }}
        </span>
      </div>
      <div>
        <span :class="b.label()">ECID</span>
        <span :class="b.value()" @click="cp">
          {{ form.Ecid.toUpperCase() }}
        </span>
      </div>
      <div>
        <span :class="b.label()">UDID</span>
        <span :class="b.value()" class=" break-all" @click="cp">
          {{ form.UniqueDeviceID.toUpperCase() }}
        </span>
      </div>
    </div>

    <div class="flex-1 space-y-1">
      <div class="flex items-center">
        <span :class="b.label()">激活状态</span>
        <div class="flex-1 flex items-center justify-between">
          <span :class="b.value()" @click="cp">
            {{ form.ActivationState }}
          </span>
          <button class="ml-2 text-primary" @click="handleActivation">
            {{ isActivated ? '反激活' : '激活' }}
          </button>
        </div>
      </div>
      <div class="flex items-center"> 
        <span :class="b.label()">网络锁</span>
        <div class="flex-1 flex items-center justify-between">
          <button
            v-if="!cache.showNetworkLock"
            v-text="'查看上次查询结果'"
            class="text-primary hover:text-primary/85"
            @click="showPrevCache('showNetworkLock')"
          />
          <span v-else v-html="form.NetworkLock" :class="b.value()" @click="cp" />
          <button
            class="flex items-center space-x-1.5 ml-2 text-primary whitespace-nowrap"
            :disabled="loadings.networkLock"
            @click="handleNetworkLock"
          >
            <template v-if="loadings.networkLock">
              <Icon icon="lucide:loader-2" class="animate-spin" />
              <span>查询中...</span>
            </template>
            <span v-else>{{ cache.hasNetworkLock ? '重新查询' : '立即查询' }}</span>
          </button>
        </div>
      </div>
      <div class="flex items-center">
        <span :class="b.label()">激活锁</span>
        <div class="flex-1 flex items-center justify-between">
          <button
            v-if="!cache.showActivationLock"
            v-text="'查看上次查询结果'"
            class="text-primary hover:text-primary/85"
            @click="showPrevCache('showActivationLock')"
          />
          <span v-else v-html="form.ActivationLock" :class="b.value()" @click="cp" />
          <button
            class="flex items-center space-x-1.5 ml-2 text-primary whitespace-nowrap"
            :disabled="loadings.activationLock"
            @click="handleActivationLock"
          >
            <template v-if="loadings.activationLock">
              <Icon icon="lucide:loader-2" class="animate-spin" />
              <span>查询中...</span>
            </template>
            <span v-else>{{ cache.hasActivationLock ? '重新查询' : '立即查询' }}</span>
          </button>
        </div>
      </div>
      <div class="flex items-start">
        <span :class="b.label()">保修期限</span>
        <div class="flex-1 flex items-start justify-between">
          <button
            v-if="!cache.showWarranty"
            v-text="'查看上次查询结果'"
            class="text-primary hover:text-primary/85"
            @click="showPrevCache('showWarranty')"
          />
          <span v-else v-html="form.Warranty" :class="b.value()" @click="cp" />
          <button
            class="flex items-center space-x-1.5 ml-2 text-primary whitespace-nowrap"
            :disabled="loadings.warranty"
            @click="handleWarranty"
          >
            <template v-if="loadings.warranty">
              <Icon icon="lucide:loader-2" class="animate-spin" />
              <span>查询中...</span>
            </template>
            <span v-else>{{ cache.hasWarranty ? '重新查询' : '立即查询' }}</span>
          </button>
        </div>
      </div>
      <div class="flex items-center">
        <span :class="b.label()">WiFi地址</span>
        <div class="flex-1 flex items-center justify-between">
          <span :class="b.value()" @click="cp">
            {{ form.WiFiAddress.toUpperCase() }}
          </span>
        </div>
      </div>
      <div class="flex items-center">
        <span :class="b.label()">销售地区</span>
        <div class="flex-1 flex items-center justify-between">
          <span :class="b.value()" @click="cp">
            {{ form.SalesRegion.chinese }}
          </span>
        </div>
      </div>
      <div class="flex items-center">
        <span :class="b.label()">iCloud备份</span>
        <div class="flex-1 flex items-center justify-between">
          <span :class="b.value()" @click="cp">
            {{ form.iCloud }}
          </span>
        </div>
      </div>
      <div class="flex items-center">
        <span :class="b.label()">CPU类型</span>
        <span :class="b.value()" @click="cp">
          {{ form.CPU }}
        </span>
      </div>
    </div>
  </div>
</template>
