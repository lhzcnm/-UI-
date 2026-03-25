<script setup lang="ts">
import { type XSelectEmits } from '@3un/ui'

const iStore = useSystemStore()

const code = defineModel<string>({ required: true })

const emits = defineEmits<XSelectEmits>()

const input = ref<string>('')

const illustrateKeys = computed(() => {
  return [...iStore.illustrates.keys()]
})

const filteredIllustrate = computed(() => {
  const keyword = input.value.trim().toLowerCase()
  if (!keyword) return illustrateKeys.value

  const illustrates: string[] = []

  for (let illustrate of illustrateKeys.value) {
    if (illustrate.toLowerCase().includes(keyword)) {
      illustrates.push(illustrate)
    }
  }

  return illustrates
})

function getDisplayText(text: string) {
  const keyword = input.value.trim()
  if (!keyword) return text

  const filterText = highlightText(text, keyword)
  return filterText
}

function highlightText(text: string, keyword: string) {
  if (!keyword.trim()) return text

  const reg = new RegExp(`(${keyword})`, 'gi')

  return text.replace(reg, '<mark class="x-highlight">$1</mark>')
}
</script>

<template>
  <XSelect v-model="code"
    v-model:input="input"
    filterable
    placement="bottom-start"
    placeholder="请选择说明文档"
    @selected="emits('selected', $event)">
    <XSelectItem v-for="key in filteredIllustrate" :key="key"
      :value="key" :label="key">
      <template #default>
        <span v-html="getDisplayText(key)"></span>
      </template>
    </XSelectItem>
  </XSelect>
</template>
