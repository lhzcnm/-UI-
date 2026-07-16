<script setup lang="ts">
import { toast } from 'vue-sonner'

import { zIllustrateForm, type IllustrateCreate, type IllustrateImageItem } from '@/inters/illustrate'
import { DOCX_STORE } from '../utils'
import { getIllustrateImages } from '@/api/illustrate'
import ImageSortable from './ImageSortable.vue'

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

  store.docxImageMap.set(serviceCode, imageItems)
  images.value = imageItems
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
  console.log(illustrateItem)
  const result = zIllustrateForm.safeParse({
      serviceCode: illustrateItem.serviceCode,
    description: illustrateItem.description,
    serviceDesc: illustrateItem.serviceDesc,
    images: []
  })
  console.log(result)
  // const submitBody: IllustrateCreate = zIllustrateForm.parse({
  //   serviceCode: illustrateItem.serviceCode,
  //   description: illustrateItem.description,
  //   serviceDesc: illustrateItem.serviceDesc,
  //   images: []
  // })

  // const allImages = images.value

  // for (let i = 0; i < allImages.length; i++) {
  //   const image = allImages[i]
  //   const file = await urlToFile(image.imageUrl, Date.now().toString(16))
  //   submitBody.images.push({
  //     sort: image.sort,
  //     file: file
  //   })
  // }
}

async function urlToFile(
  url: string,
  filename: string
) : Promise<File> {
  const res = await fetch(url)

  const blob = await res.blob()

  return new File([blob], filename, {type: blob.type})
}
</script>

<template>
  <XDialog
    v-model="store.visibleImage"
    title="图片预览"
    ui-root="sm:p-0 sm:max-w-3xl"
    ui-header="p-4 border-b"
    draggable
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
      <div class="p-4 flex justify-end gap-4">
        <XButton label="取消" variant="soft" @click="store.visibleImage = false" />
        <XButton label="确认" @click="handleConfirm" />
      </div>
    </template>

  </XDialog>
</template>
