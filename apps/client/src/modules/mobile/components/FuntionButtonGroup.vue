<script setup lang="ts">
import { getLanuagestring } from '@/utils/constant'
import { THEME } from '@3un/utils'
import { Icon } from '@iconify/vue'

interface FunctionOption {
  icon: string
  value: string
  label: string
  command: () => void
}

const theme = inject(THEME)!

const { locale } = useI18n()
// const iStore = useSystemStore()
const router = useRouter()
const route = useRoute()

const visible = ref<boolean>(false)

const html = document.documentElement

const isEn = computed(() => locale.value === 'en')

const lang = computed(() => isEn.value ? 'en' : 'zh')

const themeIcon = computed(() => theme.value.isDark ? 'lucide:moon' : 'lucide:sun')

const functionOptions = computed<FunctionOption[]>(() => ([
  { icon: themeIcon.value, value: 'theme', label: getLanuagestring('theme', lang.value ), command: toggleTheme },
  // { icon: 'lucide:refresh-cw', value: 'refresh', label: getLanuagestring('instructions', lang.value), command: toggleLanguage },
  { icon: 'lucide:refresh-cw', value: 'refresh', label: getLanuagestring('refresh', lang.value), command: handleRefresh },
  { icon: 'lucide:circle-question-mark', value: 'illustrate', label: getLanuagestring('instructions', lang.value), command: goToInstruction },
]))

function toggleTheme() {
  theme.value.isDark = !theme.value.isDark
  const target = theme.value.isDark ? 'dark' : 'light'

  localStorage.setItem('theme', target)
  html.className = html.className.replace(theme.value.name, target)
  theme.value.name = target
  visible.value = false
}

async function handleRefresh()  {
  try {
    const fullPath = route.fullPath
    await router.replace('/redirect')
    await nextTick()
    await router.replace(fullPath)
  } finally {}
}

function goToInstruction() {
  window.open('http://docx.3unlocked.com', '_blank')
  visible.value = false
}
</script>

<template>
  <XPopover
    v-model="visible"
    :close-on-click-outside="true"
  >
    <template #trigger>
      <button class="py-1 flex items-center bg-muted rounded-full px-2 text-gray-500 text-sm">
        <Icon icon="uil:setting" class="size-5" />
        <span>{{ getLanuagestring('funtion_tools', lang) }}</span>
      </button>
    </template>

    <template #default>
      <div class="flex flex-col divide-y">
        <button
          class="px-3 py-2 flex items-center space-x-2"
          v-for="option in functionOptions" :key="option.value"
          @click="option.command"
        >
          <Icon :icon="option.icon" />
          <span>{{ option.label }}</span>
        </button>
      </div>
    </template>
  </XPopover>
</template>
