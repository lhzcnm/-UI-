<script setup lang="ts">
import DeviceList     from './views/DeviceList.vue'
import DeviceDetail   from './views/DeviceDetail.vue'
import WaitConnect    from './views/WaitConnect.vue'
import PluginMissing  from './views/PluginMissing.vue'
import PluginVersion  from './views/PluginVersion.vue'
import PrintDialog    from './components/PrintDialog.vue'
import Preview        from './views/Preview.vue'

import type {
  DeviceStore,
} from './types'

import { STORE } from './utils'
import { useDeviceStore } from '@/stores/device'
import { wsFetch } from '@/utils/device/websocket'
import { checkVersion, hasNewVersion } from '@/utils/device'

const store: DeviceStore = reactive({
  visiblePrint     : false,
  hasNewVersion    : false,
  deviceStatus     : 'wait',
  prevStatus       : 'wait',
  screenshotStatus : 'wait',
  printIndex       : '',
  screenshot       : '',
  selected         : '',
  queryServices    : [],
})

provide(STORE, store)

const deviceStore = useDeviceStore()
const { getServices } = useServiceStore()

let pluginRunning: boolean = false

watch(
  () => deviceStore.hasNewVersion,
  (val) => val && (store.hasNewVersion = true)
)

watch(
  () => deviceStore.pluginMustUpdate,
  (val) => val && (store.deviceStatus = 'list')
)

watch(
  () => deviceStore.version,
  (newVersion) => {
    if (checkVersion(newVersion)) {
      store.deviceStatus = 'plugin'
    }
  }
)

watch(
  () => store.selected,
  (value) => {
    if (!value) return
    store.screenshot = ''

    const [, uniqueId] = value.split(':')
    checkScreenshot(uniqueId)
  },
)

watch(
  [() => deviceStore.deviceMap.size, () => deviceStore.recoveryDeviceMap.size],
  ([deviceSize, reccoverySize]) => {
    console.log(deviceSize, reccoverySize)
    if (deviceSize === 0 && reccoverySize === 0) {
      store.deviceStatus = 'wait'
    } else {
      store.deviceStatus = 'list'
    }
  }, { immediate: true }
)

async function init() {
  try {
    await deviceStore.getPluginInfo()
    pluginRunning = true
  } catch {
    pluginRunning = false
    store.deviceStatus = 'plugin'
  }
}

async function checkPluginInfo() {
  if (pluginRunning) {
    if (checkVersion(deviceStore.version)) {
      deviceStore.pluginMustUpdate = true
      // store.deviceStatus = 'plugin'
    }
    
    if (hasNewVersion(deviceStore.version)) {
      deviceStore.hasNewVersion = true
      // store.hasNewVersion = true
    }
  }
}

await init()
await checkPluginInfo()

await deviceStore.getNormalDevices()
await deviceStore.getRecoveryDevices()

async function getScreenshot(id: string) {
  const data = await wsFetch<string>({
    type: 'screenshot',
    Uid: id,
  })

  if (data === 'failed') store.screenshot = ''
  else store.screenshot = `data:image/png;base64,${data}`
}

async function checkScreenshot(id: string) {
  const data = await wsFetch<string>({
    type: 'mountImage',
    Uid: id,
  })

  const isSuccess = data.endsWith('success')
  const status = isSuccess ? 'success' : 'fail'

  if (isSuccess) await getScreenshot(id)
  store.screenshotStatus = status
}

await Promise.all([
  getServices(),
])

const components = {
  list: DeviceList,
  wait: WaitConnect,
  detail: DeviceDetail,
  plugin: PluginMissing,
  version: PluginVersion,
  printView: Preview,
}
</script>

<template>
  <div class="p-4 h-full">
    <Transition name="fade-in" mode="out-in">
      <component :is="components[store.deviceStatus]" />
    </Transition>

    <PrintDialog />
  </div>
</template>
