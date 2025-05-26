<script setup lang="ts">
import { twJoin } from 'tailwind-merge'
</script>

<template>
  <div
    :class="twJoin(
      'flex items-center justify-center',
      '-mt-32 h-screen text-muted-foreground'
    )"
  >
    <XEmpty
      src="/images/not_found.png"
      ui-image="bg-card border rounded-lg"
    >
      <RouterLink to="/" class="block mt-2 text-center">
        返回首页
      </RouterLink>
    </XEmpty>
  </div>
</template>
