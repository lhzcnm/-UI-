<script setup lang="ts">
import { locales } from '@/utils/locales'
import { XPopover } from '@3un/ui'
import { Icon } from '@iconify/vue'

const systemStore = useSystemStore()

const visible = ref<boolean>(false)
const curLocale = ref<string>()

curLocale.value = systemStore.locale ?? navigator.language

function handleClick(lang: string) {
  visible.value = false
  curLocale.value = lang

  systemStore.setLocale(lang)
  location.reload()
}
</script>

<template>
  <XPopover
    v-model="visible" placement="bottom-start"
    :close-on-click-outside="true"
  >
    <template #trigger>
      <button
        class="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        <Icon
          icon="lucide:languages"
          class="text-zinc-70 dark:text-zinc-200 size-6"
        />
      </button>
    </template>

    <template #default>
      <div class="p-2 flex flex-col space-y-2 w-32">
        <div
          class="p-2 cursor-pointer hover:bg-zinc-50 hover:dark:bg-zinc-900 rounded"
          :class="{ 'bg-zinc-100 dark:bg-zinc-800': curLocale === locale.value }"
          v-for="locale in locales" @click="handleClick(locale.value)">
          <span>{{ locale.label }}</span>
        </div>
      </div>
    </template>
  </XPopover>
</template>
