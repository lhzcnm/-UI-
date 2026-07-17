<script setup lang="ts">
import { toast } from 'vue-sonner'
import ImageSortable from './ImageSortable.vue'

import { createFormData } from '@3un/utils'

import { type IllustrateImageItem, type IllustrateSubmitForm } from '@/inters/illustrate'
import { DOCX_STORE } from '../utils'
import { getIllustrateImages, updateIllustrate } from '@/api/illustrate'
import { buildIllustrateBody } from '@/utils/illustrate.ts'

const store = inject(DOCX_STORE)!
const iStore = useSystemStore()

const images = ref<IllustrateImageItem[]>([])

const imageUploadRef = ref<HTMLInputElement | null>(null)

const storageUrl: string[] = []

watch(
  () => store.visibleImage,
  async (val) => {
    if (!val) {
      storageUrl.map(URL.revokeObjectURL)
    }
    if (val) {
      await getImages()
    }
  }
)

async function getImages() {
  if (store.index === undefined) return

  const serviceCode = iStore.illustrateList[store.index].serviceCode
  if (store.docxImageMap.has(serviceCode)) {
    images.value = store.docxImageMap.get(serviceCode)!
    return
  }

  const imageItems = await getIllustrateImages({ serviceCode: serviceCode })
  // if (imageItems.length === 0) {
  //   toast.warning("该模块暂无图片")
  //   return
  // }

  if (imageItems.length > 0) {
    store.docxImageMap.set(serviceCode, imageItems)
    images.value = imageItems
  }
}

function handleUploadImage() {
  if (!imageUploadRef.value) return
  imageUploadRef.value.click()
}

function handleImageChange(e: Event) {
  const target = e.target as HTMLInputElement
  const files = target.files

  if (!files || files.length === 0) return

  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      toast.error(`${file.name} 不是图片`)
      continue
    }

    const url = URL.createObjectURL(file)
    storageUrl.push(url)

    images.value.push({
      id: Date.now() + Math.random(),
      sort: images.value.length + 1,
      imageUrl: url,
    })
  }

  target.value = ''
}

async function handleConfirm() {
  if (store.index === undefined) return

  const illustrateItem = iStore.illustrateList[store.index]

  const allImages = images.value.map((item, index) => ({
    ...item,
    sort: index + 1,
  }))

  const submitBody = await buildIllustrateBody(illustrateItem, allImages)

  try {
    await confirmUpdate(submitBody)
  } finally {
    store.docxImageMap.clear()
  }
}

async function confirmUpdate(body: IllustrateSubmitForm) {
  const formdata = createFormData(body)

  await updateIllustrate(formdata)
  toast.success("更新成功")

  store.visibleImage = false
  store.refresh = !store.refresh
}

function handleClose() {
  store.visibleImage = false
  images.value = []
}
</script>

<template>
  <XDialog
    v-model="store.visibleImage"
    title="图片预览"
    ui-root="sm:p-0 sm:max-w-3xl max-h-[calc(100%-3.75rem)]"
    ui-header="p-4 border-b"
    draggable
    @close="handleClose"
  >
    <template #default>
      <ImageSortable
        class="px-4 pb-4"
        v-model="images"
        @add="handleUploadImage"
      />
      
      <input ref="imageUploadRef" type="file" class="hidden" accept="image/*" @change="handleImageChange">
    </template>

    <template #footer>
      <div class="p-4 flex justify-end gap-2">
        <XButton label="取消" variant="soft" @click="handleClose" />
        <XButton label="确认" @click="handleConfirm" />
      </div>
    </template>
  </XDialog>
</template>
