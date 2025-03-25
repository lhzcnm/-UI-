<script setup lang="ts">
const uStore = useUserStore()

const avatar = computed(() => {
  const mode = import.meta.env.VITE_APP_MODE
  if (uStore.info.avatar) return uStore.info.avatar
  return `/${mode}/images/default_avatar.jpg`
})
</script>

<template>
  <RouterLink
    to="/profile"
    class="border rounded-full overflow-hidden"
  >
    <img
      :src="avatar"
      alt="avatar"
      draggable="false"
      class="size-full object-cover"
    >
  </RouterLink>
</template>
