<script setup lang="ts">
import { twJoin } from 'tailwind-merge'

const visible = ref<boolean>(false)
</script>

<template>
  <section class="sticky top-0">
    <div
      :class="twJoin(
        'relative z-10 flex justify-between',
        'px-3 py-2 border-b bg-card',
        visible && 'border-dashed',
      )"
    >
      <XButton
        label="操作" color="success"
        icon="lucide:chart-no-axes-gantt"
        @click="visible = !visible"
      />
      <slot name="default" />
    </div>

    <!-- <div v-show=""></div> -->

    <Transition name="fade-in">
      <div
        v-if="visible"
        class="fixed left-0 right-0 size-full bg-black/80"
        @click="visible = false"></div>
    </Transition>

    <Transition name="toolbar-spread">
      <div
        v-show="visible"
        :class="twJoin(
          'absolute top-full left-0 right-0 p-3',
          'bg-card border border-t-0 rounded-b-lg shadow-md'
        )">
          <slot name="extra" />
        </div>
    </Transition>
  </section>
</template>
