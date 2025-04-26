<script setup lang="ts">
import { columns } from './utils/columnGroup'

const store = useServiceStore()
</script>

<template>
  <div class="px-3 mb-3">
    <section class="my-3">
      <x-button>新增服务组</x-button>
    </section>

    <XTable
      :data="store.groups"
      :columns="columns"
    />
  </div>
</template>
