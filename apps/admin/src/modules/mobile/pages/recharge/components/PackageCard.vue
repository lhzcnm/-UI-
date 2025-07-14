<script setup lang="ts">
import { xconfirm } from '@3un/utils'
import { toast } from 'vue-sonner'

import { zRechargePackageForm, type RechargePackage } from '@/inters/recharge'
import { deleteRechargePackages } from '@/api/recharge'

import { PACKAGE_STORE } from '../utils'

interface TheProps {
  item: RechargePackage
  index: number
}

const props = defineProps<TheProps>()
const store = inject(PACKAGE_STORE)!
const item = props.item

function handleClick() {
  const price = +item.price

  store.formBase = zRechargePackageForm.parse({
    ...item, price,
  })

  store.index = props.index
  store.visibleBase = true
}

async function handleDelete() {
  if (!await xconfirm('确定删除该套餐吗？')) return

  deleteRechargePackages([item.id]).then(() => {
    store.packages.splice(props.index, 1)
    toast.success('删除成功')
  })
}
</script>

<template>
  <div class="bg-card border rounded-lg" @click="handleClick">
    <div class="flex items-center justify-between p-3">
      <h3 class="text-lg font-bold">{{ item.id }} | {{ item.shopName }}</h3>
      <div class="flex items-center space-x-2">
        <XTag :label="`￥${item.price}`" color="warning" />
        <XTag :label="`${item.month}个月`" />
      </div>
    </div>

    <div class="flex items-center justify-between px-3 py-2 border-t border-dashed">
      <span class="text-sm text-muted-foreground">{{ item.createTime }}</span>
      <XButton
        label="删除"
        icon="lucide:trash-2"
        size="sm" color="danger"
        @click.stop="handleDelete"
      />
    </div>
  </div>
</template>
