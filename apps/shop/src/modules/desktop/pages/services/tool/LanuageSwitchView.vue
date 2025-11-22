<script setup lang="ts">
import type { LocaleType } from '@/inters/shop'
import TheGlobalBack from './TheGlobalBack.vue'

const iStore = useSystemStore()
const { t, locale } = useI18n()

const languages = [
  { id: 'zh', name: '中文' },
  { id: 'en', name: 'English' },
]

const selected = ref(locale.value)

function changeLanguage(lang: string) {
  iStore.setLocale(lang as LocaleType)
  location.reload()
}
</script>

<template>
  <div class="w-full flex flex-col">
    <TheGlobalBack :name="t('shop.tool.title.lang')" />

    <div
      class="m-2 flex flex-col mt-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 
             bg-white dark:bg-zinc-900 shadow-lg overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800">
      <label
        v-for="language in languages"
        :key="language.id"
        class="flex items-center justify-between px-5 py-4 text-lg cursor-pointer rounded
               hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        @click="changeLanguage(language.id)"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-3.5 h-3.5 rounded-full border-2 transition-all duration-200"
            :class="selected === language.id
              ? 'border-blue-500 bg-blue-500'
              : 'border-zinc-400 dark:border-zinc-600 bg-transparent'"
          />
          <span class="font-medium">{{ language.name }}</span>
        </div>

        <svg
          v-if="selected === language.id"
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </label>
    </div>
  </div>
</template>

