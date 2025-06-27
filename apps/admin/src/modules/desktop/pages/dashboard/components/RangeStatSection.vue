<script setup lang="ts">
interface StatSectionProps {
  title: string
  selected: (value: string) => void
}

const props = defineProps<StatSectionProps>()

const selected = ref('7')
</script>

<template>
  <section>
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-xl font-bold">{{ props.title }}</h3>

      <div class="flex items-center space-x-2">
        <XSelect
          v-model="selected"
          ui-trigger="w-48"
          @selected="props.selected"
        >
          <XSelectItem value="7">最近7天</XSelectItem>
          <XSelectItem value="30">最近一个月</XSelectItem>
          <XSelectItem value="90">最近三个月</XSelectItem>
          <XSelectItem value="180">最近半年</XSelectItem>
          <XSelectItem value="365">最近一年</XSelectItem>
        </XSelect>
      </div>
    </div>

    <slot></slot>
  </section>
</template>
