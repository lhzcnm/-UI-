<script setup lang="ts">
import { twJoin } from 'tailwind-merge'

interface ToolbarProps {
  loading?: boolean
}

defineProps<ToolbarProps>()
const toggle = ref(false)
</script>

<template>
  <section class="sticky top-0">
    <div
      :class="twJoin(
        'relative z-10 flex justify-between',
        'px-3 py-2 border-b bg-card',
        toggle && 'border-dashed'
      )"
    >
      <XButton
        label="操作" color="success"
        icon="lucide:chart-no-axes-gantt"
        @click="toggle = !toggle"
      />
      <slot></slot>
    </div>

    <div v-show="loading" class="absolute w-full h-0.5 overflow-hidden bg-primary/10">
      <div class="h-full w-1/3 x-animation-slide rounded bg-primary" />
    </div>

    <Transition name="fade-in">
      <div
        v-if="toggle"
        class="fixed left-0 right-0 size-full bg-black/80"
        @click="toggle = false"
      />
    </Transition>

    <Transition name="toolbar-spread">
      <div
        v-show="toggle"
        :class="twJoin(
          'absolute top-full left-0 right-0 p-3',
          'bg-card border border-t-0 rounded-b-lg shadow-md',
        )"
        @click.stop="toggle = false"
      >
        <slot name="extra" />
      </div>
    </Transition>
  </section>
</template>
