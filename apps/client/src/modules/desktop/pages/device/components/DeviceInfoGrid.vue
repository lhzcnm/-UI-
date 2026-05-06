<script setup lang="ts">
import { tv } from 'tailwind-variants'
import { useClipboard } from '@vueuse/core'
import { toast } from 'vue-sonner'
// import { Icon } from '@iconify/vue'
// import { xconfirm } from '@3un/utils'

// import http from '@/utils/http'
import { STORE } from '../utils'
import { wsFetch } from '@/utils/device/websocket'

const style = tv({
  slots: {
    label: 'inline-block min-w-[88px] text-muted-foreground mr-2',
    value: 'cursor-pointer hover:text-primary active:text-primary/80 break-all',
  },
})

const store = inject(STORE)!
// const uStore = useUserStore()
const deviceStore = useDeviceStore()
const { t, locale } = useI18n()

const { copy } = useClipboard({ legacy: true })

const form = computed({
  get: () => deviceStore.deviceMap.get(store.selected)!.summary,
  set: (value) => deviceStore.deviceMap.get(store.selected)!.summary = value,
})

const defaultState = form.value.ActivationState
const isActivated = ref(defaultState.toLowerCase() === 'activated')
const loading = ref<boolean>(false)

async function handleActivation() {
  if (loading.value) return

  loading.value = true
  try {
    const suffix = isActivated.value ? 'deactivate' : 'activation'
    const [_, uniqueId] = store.selected.split(':')
    
    await wsFetch({ type: suffix, Uid: uniqueId })
    isActivated.value = !isActivated.value
    form.value.ActivationState = isActivated.value
      ? t('device.info.grid.status.already')
      : t('device.info.grid.status.not')
  } catch {} finally {
    loading.value = false
  }
}

async function cp(event: MouseEvent) {
  const target = event.target as HTMLElement
  const text = target.textContent

  if (text && text.trim()) {
    await copy(text.trim())
    toast.success(t('submit.success', { action: t('action.copy') }))
  }
}

const b = style()
</script>

<template>
  <div class="flex gap-4 p-4 bg-card">
    <div class="flex-1 space-y-1">
      <div v-show="form.SerialNumber">
        <span :class="b.label()">{{ t('device.info.grid.sn') }}</span>
        <span :class="b.value()" @click="cp">
          {{ form.SerialNumber }}
        </span>
      </div>
      <div v-show="form.Imei">
        <span :class="b.label()">{{ t('device.info.grid.imei') }}</span>
        <span :class="b.value()" @click="cp">
          {{ form.Imei }}
        </span>
      </div>
      <div v-show="form.ModelNumber">
        <span :class="b.label()">{{ t('device.info.grid.typeNumber') }}</span>
        <span :class="b.value()" @click="cp">
          {{ form.ModelNumber }} {{ form.RegionInfo }}
        </span>
      </div>
      <div v-show="form.ProductType">
        <span :class="b.label()">{{ t('device.info.grid.prodType') }}</span>
        <span :class="b.value()" @click="cp">
          {{ form.ProductType }}
        </span>
      </div>
      <div v-show="form.ProductVersion">
        <span :class="b.label()">{{ t('device.info.grid.system') }}</span>
        <span :class="b.value()" @click="cp">
          {{ form.ProductVersion }} ({{ form.BuildVersion }})
        </span>
      </div>
      <div v-show="form.MLBSerialNumber">
        <span :class="b.label()">{{ t('device.info.grid.motherNo') }}</span>
        <span :class="b.value()" @click="cp">
          {{ form.MLBSerialNumber }}
        </span>
      </div>
      <div v-show="form.Ecid">
        <span :class="b.label()">ECID</span>
        <span :class="b.value()" @click="cp">
          {{ form.Ecid.toUpperCase() }}
        </span>
      </div>
      <div v-show="form.UniqueDeviceID">
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
            {{ isActivated ? t('device.info.grid.actived.already') : t('device.info.grid.actived.not') }}
          </span>
          <button class="ml-2 text-primary" @click="handleActivation">
            {{ isActivated ? t('device.info.grid.actived.action.nega') : t('device.info.grid.actived.action.positive') }}
          </button>
        </div>
      </div>

      <div class="flex items-center" v-show="form.WiFiAddress">
        <span :class="b.label()">{{ t('device.info.grid.wifiAddr') }}</span>
        <div class="flex-1 flex items-center justify-between">
          <span :class="b.value()" @click="cp">
            {{ form.WiFiAddress.toUpperCase() }}
          </span>
        </div>
      </div>
      <div class="flex items-center" v-show="form.SalesRegion">
        <span :class="b.label()">{{ t('device.info.grid.region') }}</span>
        <div class="flex-1 flex items-center justify-between">
          <span :class="b.value()" @click="cp">
            {{ locale === 'zh' ? form.SalesRegion.chinese : form.SalesRegion.english }}
          </span>
        </div>
      </div>
      <div class="flex items-center" v-show="form.iCloud">
        <span :class="b.label()">{{ t('device.info.grid.iCloudBackup') }}</span>
        <div class="flex-1 flex items-center justify-between">
          <span :class="b.value()" @click="cp">
            {{ form.iCloud }}
          </span>
        </div>
      </div>
      <div class="flex items-center" v-show="form.CPU">
        <span :class="b.label()">{{ t('device.info.grid.cpu') }}</span>
        <span :class="b.value()" @click="cp">
          {{ form.CPU }}
        </span>
      </div>
    </div>
  </div>
</template>
