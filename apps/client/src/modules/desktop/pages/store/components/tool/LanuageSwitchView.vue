<script setup lang="ts">
import TheGlobalBack from './TheGlobalBack.vue'

const iStore = useSystemStore()
const { locale } = useI18n()

const languages = [
  { id: 'zh', name: '中文' },
  { id: 'en', name: 'English' },
]

const selected = ref(locale.value)

function changeLanguage(lang: string) {
  iStore.setLocale(lang)
  location.reload()
}
</script>

<template>
  <div class="w-full flex flex-col">
    <TheGlobalBack name="语言切换" />

    <div class="flex flex-col space-y-2 mt-4">
      <label
        v-for="language in languages"
        :key="language.id"
        class="flex items-center gap-2 cursor-pointer py-4 px-2 text-xl rounded-lg bg-zinc-100 dark:bg-zinc-950 hover:bg-zinc-400 dark:hover:bg-zinc-800 transition"
      >
        <input
          type="radio"
          name="language"
          :value="language.id"
          v-model="selected"
          @change="changeLanguage(language.id)"
          class="accent-blue-500 dark:accent-blue-400"
        />
        <span>{{ language.name }}</span>
      </label>
    </div>
  </div>
</template>
