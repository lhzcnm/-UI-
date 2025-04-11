<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'
import { toast } from 'vue-sonner'
import { USERNAME_REG } from '@3un/utils'

const store = useUserStore()

const isEditName = ref(false)
const editName = ref(store.info.userName)

function handleEditName() {
  if (!USERNAME_REG.test(editName.value)) {
    toast.error('请输入正确的账号')
    return
  }

  store.updateName(editName.value)
}

function handleCancelEditName() {
  isEditName.value = false
  editName.value = store.info.userName
}
</script>

<template>
  <div class="flex items-center space-x-3">
    <TheAvatar class="size-20 cursor-default" />
    <div class="h-full">
      <div class="flex items-center space-x-2 mb-1.5">
        <template v-if="!isEditName">
          <span class="text-lg">{{ store.info.userName }}</span>

          <button
            class="p-1.5 text-muted-foreground hover:text-primary rounded-full hover:bg-primary/20"
            @click="isEditName = true"
          >
            <Icon icon="lucide:edit" class="size-4" />
          </button>
        </template>
        <template v-else>
          <XInput
            v-model="editName"
            placeholder="请输入账号"
            class="w-40"
          />

          <button
            :class="twJoin(
              'p-2 text-muted-foreground border hover:border-primary',
              'hover:text-primary hover:bg-primary/20 rounded-full',
            )"
            @click="handleEditName"
          >
            <Icon icon="lucide:check" class="size-4" />
          </button>
          <button
            :class="twJoin(
              'p-2 text-muted-foreground border hover:border-rose-500',
              'hover:text-rose-500 hover:bg-rose-500/20 rounded-full',
            )"
            @click="handleCancelEditName"
          >
            <Icon icon="lucide:x" class="size-4" />
          </button>
        </template>
      </div>
      <div class="space-x-2">
        <XTag color="blue" :label="`ID:${store.info.userId}`" />
        <XTag color="rose" :label="store.info.pricePlan" />
      </div>
    </div>
  </div>
</template>
