<script setup lang="ts">
import type { ToolGlobalProps } from '@/inters/tool'
import { Icon } from '@iconify/vue'

const { t } = useI18n()

interface ThemeToolProps extends ToolGlobalProps {}

const props = defineProps<ThemeToolProps>()
const iStore = useSystemStore()

const isDark = computed(() => iStore.theme === 'dark')

function toggleTheme() {
  iStore.toggleTheme()
}
</script>

<template>
  <button :class="props.class" @click="toggleTheme()">
    <Icon
      :icon="isDark ? 'openmoji:crescent-moon' : 'openmoji:sun'"
      class="size-10 transition-transform duration-300"
    />
    <span class="text-sm">{{ t('shop.tool.name.theme') }}</span>
  </button>
</template>
