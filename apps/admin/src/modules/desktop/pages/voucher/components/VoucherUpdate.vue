<script setup lang="ts">
import { toast } from 'vue-sonner'
import type { Directive } from 'vue'
import { VOUCHER_STATUS, VOUCHER_STATUS_List, VOUCHER_STATUS_MAP, xconfirm } from '@3un/utils'

import type { Voucher } from '@/inters/voucher'

interface VoucherUpdateProps {
  row: Voucher,
}

interface VoucherUpdateEmits {
  change: [value: VOUCHER_STATUS]
}

const { row } = defineProps<VoucherUpdateProps>()

const emits = defineEmits<VoucherUpdateEmits>()
 
const isEditing = ref<boolean>(false)
const selectVal = ref<VOUCHER_STATUS>(row.status)

watch(
  () => selectVal.value,
  async (value) => {
    await handleSelect(value)
  }
)

function handleEnter() {
  isEditing.value = true
}

function handleLeave(isOpen: boolean) {
  if(!isOpen) {
    isEditing.value = false
  }
}

function handleClose() {
  isEditing.value = false
}

async function handleSelect(value: VOUCHER_STATUS) {
  if(row.status === VOUCHER_STATUS.FAILURE && value === VOUCHER_STATUS.USEFUL) {
    if(!await xconfirm('是否确认将该券码从失效状态变为可使用?')) {
      row.status = VOUCHER_STATUS.FAILURE
      return
    }
  }
  if(row.status === VOUCHER_STATUS.USED) {
    row.status === VOUCHER_STATUS.USED
    return toast.warning("已使用的券码不能更改状态")
  }
  emits('change', value)
}

const vClickOutside: Directive = {
  beforeMount(el, binding) {
    el.__clickOutside__ = (e: MouseEvent) => {
      if (!el.contains(e.target as Node)) {
        binding.value(e)
      }
    }
    document.addEventListener("click", el.__clickOutside__)
  },
  unmounted(el) {
    document.removeEventListener("click", el.__clickOutside__)
  },
}
</script>

<template>
  <div class="inline-flex items-center" v-click-outside="handleClose">
    <template v-if="isEditing">
      <XSelect
        v-model="selectVal"
        size="sm"
        :close-on-mouse-leave="false"
        @mouseleave="handleLeave">
        <XSelectItem
          v-for="item in VOUCHER_STATUS_List" :key="item.value"
          :label="item.label" :value="item.value"
        />
      </XSelect>
    </template>
    <template v-else>
      <XTag
        :color="VOUCHER_STATUS_MAP[row.status].color"
        :label="VOUCHER_STATUS_MAP[row.status].label"
        @mouseenter="handleEnter"
      />
    </template>
  </div>
</template>
