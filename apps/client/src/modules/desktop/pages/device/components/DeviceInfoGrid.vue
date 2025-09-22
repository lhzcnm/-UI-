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
    label: 'inline-block min-w-[88px] text-muted-foreground mr-2',
    value: 'cursor-pointer hover:text-primary active:text-primary/80 break-all',
  },
})

const store = inject(STORE)!
const uStore = useUserStore()
const { t, locale } = useI18n()

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
const isActivated = ref(defaultState === t('device.info.grid.actived.already'))

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
  form.value.ActivationState = isActivated.value
    ? t('device.info.grid.status.already')
    : t('device.info.grid.status.not')
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
    ${t('device.info.grid.query.confirm', { point: data.point })}
  `
}

async function cp(event: MouseEvent) {
  const target = event.target as HTMLElement
  const text = target.textContent

  if (text && text.trim()) {
    await copy(text.trim())
    toast.success(t('submit.success', { action: t('action.copy') }))
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
        <span :class="b.label()">{{ t('device.info.grid.sn') }}</span>
        <span :class="b.value()" @click="cp">
          {{ form.SerialNumber }}
        </span>
      </div>
      <div>
        <span :class="b.label()">{{ t('device.info.grid.imei') }}</span>
        <span :class="b.value()" @click="cp">
          {{ form.Imei }}
        </span>
      </div>
      <div>
        <span :class="b.label()">{{ t('device.info.grid.typeNumber') }}</span>
        <span :class="b.value()" @click="cp">
          {{ form.ModelNumber }} {{ form.RegionInfo }}
        </span>
      </div>
      <div>
        <span :class="b.label()">{{ t('device.info.grid.prodType') }}</span>
        <span :class="b.value()" @click="cp">
          {{ form.ProductType }}
        </span>
      </div>
      <div>
        <span :class="b.label()">{{ t('device.info.grid.system') }}</span>
        <span :class="b.value()" @click="cp">
          {{ form.ProductVersion }} ({{ form.BuildVersion }})
        </span>
      </div>
      <div>
        <span :class="b.label()">{{ t('device.info.grid.motherNo') }}</span>
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
        <span :class="b.label()">{{ t('device.info.grid.activeStatus') }}</span>
        <div class="flex-1 flex items-center justify-between">
          <span :class="b.value()" @click="cp">
            {{ form.ActivationState }}
          </span>
          <button class="ml-2 text-primary" @click="handleActivation">
            {{ isActivated ? t('device.info.grid.actived.nega') : t('device.info.grid.actived.already') }}
          </button>
        </div>
      </div>
      <div class="flex items-center"> 
        <span :class="b.label()">{{ t('device.info.grid.netLock') }}</span>
        <div class="flex-1 flex items-center justify-between">
          <button
            v-if="!cache.showNetworkLock"
            class="text-primary hover:text-primary/85"
            @click="showPrevCache('showNetworkLock')"
          >
            {{ t('device.info.grid.query.last') }}
          </button>
          <span v-else v-html="form.NetworkLock" :class="b.value()" @click="cp" />
          <button
            class="flex items-center space-x-1.5 ml-2 text-primary whitespace-nowrap"
            :disabled="loadings.networkLock"
            @click="handleNetworkLock"
          >
            <template v-if="loadings.networkLock">
              <Icon icon="lucide:loader-2" class="animate-spin" />
              <span>{{ t('device.info.grid.query.ing') }}...</span>
            </template>
            <span v-else>{{ cache.hasNetworkLock ? t('device.info.grid.query.re') : t('device.info.grid.query.now') }}</span>
          </button>
        </div>
      </div>
      <div class="flex items-center">
        <span :class="b.label()">{{ t('device.info.grid.activeLock') }}</span>
        <div class="flex-1 flex items-center justify-between">
          <button
            v-if="!cache.showActivationLock"
            class="text-primary hover:text-primary/85"
            @click="showPrevCache('showActivationLock')"
          >
            {{ t('device.info.grid.query.last') }}
          </button>
          <span v-else v-html="form.ActivationLock" :class="b.value()" @click="cp" />
          <button
            class="flex items-center space-x-1.5 ml-2 text-primary whitespace-nowrap"
            :disabled="loadings.activationLock"
            @click="handleActivationLock"
          >
            <template v-if="loadings.activationLock">
              <Icon icon="lucide:loader-2" class="animate-spin" />
              <span>{{ t('device.info.grid.query.ing') }}...</span>
            </template>
            <span v-else>{{ cache.hasActivationLock ? t('device.info.grid.query.re') : t('device.info.grid.query.now') }}</span>
          </button>
        </div>
      </div>
      <div class="flex items-start">
        <span :class="b.label()">{{ t('device.info.grid.deadLine') }}</span>
        <div class="flex-1 flex items-start justify-between">
          <button
            v-if="!cache.showWarranty"
            class="text-primary hover:text-primary/85"
            @click="showPrevCache('showWarranty')"
          >
            {{ t('device.info.grid.query.last') }}
          </button>
          <span v-else v-html="form.Warranty" :class="b.value()" @click="cp" />
          <button
            class="flex items-center space-x-1.5 ml-2 text-primary whitespace-nowrap"
            :disabled="loadings.warranty"
            @click="handleWarranty"
          >
            <template v-if="loadings.warranty">
              <Icon icon="lucide:loader-2" class="animate-spin" />
              <span>{{ t('device.info.grid.query.ing') }}...</span>
            </template>
            <span v-else>{{ cache.hasWarranty ? t('device.info.grid.query.re') : t('device.info.grid.query.now') }}</span>
          </button>
        </div>
      </div>
      <div class="flex items-center">
        <span :class="b.label()">{{ t('device.info.grid.wifiAddr') }}</span>
        <div class="flex-1 flex items-center justify-between">
          <span :class="b.value()" @click="cp">
            {{ form.WiFiAddress.toUpperCase() }}
          </span>
        </div>
      </div>
      <div class="flex items-center">
        <span :class="b.label()">{{ t('device.info.grid.region') }}</span>
        <div class="flex-1 flex items-center justify-between">
          <span :class="b.value()" @click="cp">
            {{ locale === 'zh' ? form.SalesRegion.chinese : form.SalesRegion.english }}
          </span>
        </div>
      </div>
      <div class="flex items-center">
        <span :class="b.label()">{{ t('device.info.grid.iCloudBackup') }}</span>
        <div class="flex-1 flex items-center justify-between">
          <span :class="b.value()" @click="cp">
            {{ form.iCloud }}
          </span>
        </div>
      </div>
      <div class="flex items-center">
        <span :class="b.label()">{{ t('device.info.grid.cpu') }}</span>
        <span :class="b.value()" @click="cp">
          {{ form.CPU }}
        </span>
      </div>
    </div>
  </div>
</template>
