<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { getLanuagestring } from '@/utils/constant'
import { STORE } from '../utils'

const store = inject(STORE)!
const { deviceMap } = useDeviceStore()
const iStore = useSystemStore()
const localStore = useLocalStore()

const imageUrl = ref<string>('')

watch(
  () => store.visibleImage,
  (val) => {
    if (val) {
      URL.revokeObjectURL(imageUrl.value)
      renderImageBlob()
    }
  }
)

const dialogTitle = computed(() => getLanuagestring('preview', iStore.isEn ? 'en' : 'zh'))

function renderImageBlob() {
  if (store.previewImage) {
    imageUrl.value = URL.createObjectURL(store.previewImage)
  }
}

function handleSave() {
  const device = deviceMap.get(store.selected)
  if (device) {
    const devicename = device.product.Name
    const sn = device.info.SerialNumber
    const now = Date.now()

    const filename = `${devicename}_${sn}_${now}.png`

    const link = document.createElement('a')
    link.href = imageUrl.value
    link.download = filename
    link.click()
    link.remove()
    store.visibleImage = false
  }
}

onBeforeUnmount(() => {
  URL.revokeObjectURL(imageUrl.value)
})
</script>

<template>
  <XDialog
    v-model="store.visibleImage"
    :title="dialogTitle"
    ui-root="sm:max-w-[50vw] sm:p-0 max-h-[90vh]"
    ui-header="p-0"
  >
    <template #header>
      <div class="flex items-center justify-between gap-4 px-4 py-3 border-b">
        <div class="min-w-0">
          <h3 class="text-lg font-medium truncate">{{ dialogTitle }}</h3>
        </div>
        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-slate-100"
          @click="store.visibleImage = false"
          aria-label="Close"
        >
          <Icon icon="lucide:x" class="size-6" />
        </button>
      </div>
    </template>

    <template #default>
      <div class="flex min-h-[60vh] items-center justify-center overflow-hidden p-4">
        <img
          :src="imageUrl"
          alt=""
          class="max-w-full max-h-[calc(90vh-10rem)] object-contain"
        />
      </div>
    </template>

    <template #footer>
      <div class="flex flex-wrap items-center justify-end gap-2 border-t px-4 py-3">
        <XButton variant="soft" :label="localStore.localData['device_PluginCancel']" @click="store.visibleImage = false" />
        <XButton :label="localStore.localData['device_DownloadPlugin']" @click="handleSave" />
      </div>
    </template>
  </XDialog>
</template>
