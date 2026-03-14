<script setup lang="ts">
import { PRICE_TYPE_LIST } from '@3un/utils'
import type { BatchPriceUpdate } from '@/inters/batch'
import { XInputNumber } from '@3un/ui'

const form = defineModel<BatchPriceUpdate>({ required: true })

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
            
  target.value = target.value.replace(/[^0-9.]/g, '')

  const parts = target.value.split('.')
  if (parts.length > 2) {
    target.value = parts[0] + '.' + parts.slice(1).join('')
  }

  if (parts[1]?.length > 2) {
    target.value = parts[0] + '.' + parts[1].slice(0, 2)
  }

  form.value.price = Number(target.value) || 0
}
</script>

<template>
  <form @submit.prevent class="divide-y">
    <XFormField label="修改类型" variant="vertical">
      <div class="flex space-x-3">
        <label
          v-for="type in PRICE_TYPE_LIST"
          :key="type.value"
          class="flex items-center space-x-1 cursor-pointer"
        >
          <input
            type="radio"
            name="priceType"
            :value="type.value"
            v-model="form.type"
          />
          <span>{{ type.label }}</span>
        </label>
      </div>
    </XFormField>

    <XFormField label="数值" variant="vertical">
      <XInputNumber :step="0.01" :precision="2" v-model="form.price" @input="handleInput" />
    </XFormField>
  </form>
</template>
