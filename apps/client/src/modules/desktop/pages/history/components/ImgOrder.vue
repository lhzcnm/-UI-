<script setup lang="ts">
import { HISTORY_STORE } from '../utils'

interface ImgOrderProps {
  imgs: string[],
}

interface ImgOrderEmits {
  close: []
}

const { imgs } = defineProps<ImgOrderProps>()

const emits = defineEmits<ImgOrderEmits>()

const store = inject(HISTORY_STORE)!
</script>

<template>
  <XDialog
    v-model="store.visibleOrderImg"
    title="图片展示"
    uiRoot="sm:max-w-[48rem] h-[calc(100vh-10rem)] flex flex-col"
    @close="emits('close')"
  >
    <template #default>
      <div class="h-full overflow-auto flex flex-col gap-2">
        <template v-if="imgs.length === 0">
          <span>这里空空如也</span>
        </template>
        <template v-else>
          <div class="border rounded" v-for="(img) in imgs" :key="img" :alt="img">
            <img :src="img" :alt="img">
          </div>
        </template>
      </div>
    </template>
  </XDialog>
</template>
