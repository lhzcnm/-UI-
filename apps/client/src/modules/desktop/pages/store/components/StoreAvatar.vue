<script setup lang="ts">
interface StoreAvatarProps {
  url: string | undefined,
}

const props = defineProps<StoreAvatarProps>()
const mode = import.meta.env.VITE_APP_MODE

const visible = ref<boolean>(false)

const avatar = computed(() => {
  let res = props.url ? props.url : `/${mode}/default_avatar.jpg`

  return res
})
</script>

<template>
  <XPopover
    v-model="visible" ui-root="size-8 rounded-full" placement="bottom-end">
    <template #trigger>
      <button>
        <img
          class="size-8 rounded-full"
          :src="avatar"
        />
      </button>
    </template>
    <template #default>
      <div class="w-32 flex flex-col">
        <span>用户信息</span>
      </div>
    </template>
  </XPopover>
</template>
