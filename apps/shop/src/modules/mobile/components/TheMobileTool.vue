<script setup lang="ts">
import { twJoin } from 'tailwind-merge'
const visible = defineModel<boolean>({ default: false })
const { t } = useI18n()
</script>

<template>
  <section class="w-full sticky top-0 z-[1000]">
    <div
      :class="twJoin(
        'relative z-[1002] flex justify-between items-center',
        'px-3 py-2 border-b bg-card',
        visible && 'border-dashed',
      )"
    >
      <XButton
        :label="t('button.action')"
        color="success"
        icon="lucide:chart-no-axes-gantt"
        @click="visible = !visible"
      />
      <slot name="default" />
    </div>

    <Transition name="toolbar-spread">
      <div
        v-show="visible"
        :class="twJoin(
          'absolute top-full left-0 right-0 z-[1002] p-3',
          'bg-card border border-t-0 rounded-b-lg shadow-md'
        )"
      >
        <slot name="extra" />
      </div>
    </Transition>

    <Transition name="fade-in">
      <div
        v-if="visible"
        class="fixed inset-0 bg-black/70 z-[1001]"
        @click="visible = false"
      ></div>
    </Transition>
  </section>
</template>
