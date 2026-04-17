<script setup lang="ts">
import { type OssUpload, zOssUpload } from '@/inters/oss'
import { OSS_STORE } from '../utils'
import { validate, type ValidRule } from '@/utils'
import { UpdateOssData } from '@/api/oss'
import OssUploadForm from './OssUploadForm.vue'

const store = inject(OSS_STORE)!

const form = ref<OssUpload>(zOssUpload.parse({}))

watch(
  () => store.visibleUpdate,
  (val) => val && (form.value = zOssUpload.parse({}))
)

function getRules() {
  const { ossId, fileName, url } = form.value
  const rules: ValidRule[] = [
    { rule: !!ossId, message: "请选择上传的oss" },
    { rule: !!fileName, message: "请输入正确的文件名" },
    { rule: !!url, message: "请输入正确的oss链接" },
  ]

  return rules
}

async function handleSave() {
  if (!validate(getRules())) return

  try {
    await UpdateOssData(form.value)
    store.visibleUpdate = false
    store.refresh = !store.refresh
  } finally {
  }
}
</script>

<template>
  <XDialog
    v-model="store.visibleUpdate"
    title="更新oss路径"
    draggable
    ui-root="sm:max-w-md sm:p-0"
    ui-header="p-4 border-b"
  >
    <template #default>
      <OssUploadForm class="p-4" v-model="form" />
    </template>

    <template #footer>
      <div class="p-4 flex justify-end space-x-2">
        <XButton label="取消" variant="soft" @click="store.visibleUpdate = false" />
        <XButton label="更新" @click="handleSave" />
      </div>
    </template>
  </XDialog>
</template>
