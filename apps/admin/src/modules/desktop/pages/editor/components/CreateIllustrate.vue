<script setup lang="ts">
import { toast } from 'vue-sonner'

import { type IllustrateCreate, zIllustrate, zIllustrateForm } from '@/inters/illustrate'
import { EDITOR_STORE } from '../utils'

const store = inject(EDITOR_STORE)!

const iStore = useSystemStore()

const form = ref<IllustrateCreate>(zIllustrateForm.parse({}))

watch(
  () => store.visibleIllustrateCreate,
  (val) => {
    if (val) form.value = zIllustrateForm.parse({})
  }
)

function handleSave() {
  const { serviceCode } = form.value
  if (!serviceCode) return toast.warning("请输入文档类型")
  if (iStore.illustrates.has(serviceCode)) return toast.warning("文档类型已存在")

  iStore.illustrates.set(serviceCode, zIllustrate.parse(form.value))
  store.illustrates.set(serviceCode, zIllustrate.parse(form.value))

  store.selectIllustrate = serviceCode
  store.visibleIllustrateCreate = false
}
</script>

<template>
  <XDialog v-model="store.visibleIllustrateCreate"
    title="新增文档"
    draggable
    ui-root="sm:p-0 sm:max-w-md"
    ui-header="sm:p-4 border-b">
    <template #default>
      <form class="divide-y p-4">
        <FormField label="文档类型" desc="文档类型(如提交订单为submit)">
          <XInput placeholder="请输入文档类型" v-model="form.serviceCode" />
        </FormField>
      </form>
    </template>
    <template #footer>
      <div class="p-4 flex justify-end gap-2">
        <XButton label="取消" variant="outline" @click="store.visibleIllustrateCreate = false" />
        <XButton label="确认" @click="handleSave" />
      </div>
    </template>
  </XDialog>
</template>
