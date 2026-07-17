<script setup lang="ts">
import type { IllustrateItem } from '@/inters/illustrate';
import { type XSelectEmits } from '@3un/ui'

const iStore = useSystemStore()

const code = defineModel<string>({ required: true })

const emits = defineEmits<XSelectEmits>()

const input = ref<string>('')

const illustrateList = computed(() => iStore.illustrateList)

const filteredIllustrate = computed(() => {
  const keyword = input.value.trim().toLowerCase()
  if (!keyword) return illustrateList.value

  const illustrates: IllustrateItem[] = []

  for (let illustrate of illustrateList.value) {
    if (
      illustrate.description?.toLowerCase().includes(keyword)
      || illustrate.serviceCode.toLowerCase().includes(keyword)
    ) {
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
    <XSelectItem v-for="item in filteredIllustrate" :key="item.serviceCode"
      :value="item.serviceCode" :label="item.description ? item.description : item.serviceCode">
      <template #default>
        <span v-html="getDisplayText(item.description ? item.description : item.serviceCode)"></span>
      </template>
    </XSelectItem>
  </XSelect>
</template>
