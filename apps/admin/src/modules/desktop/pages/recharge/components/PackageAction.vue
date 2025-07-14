<script setup lang="ts">
import { xconfirm } from '@3un/utils'
import { toast } from 'vue-sonner'

import { zRechargePackageForm, type RechargePackage } from '@/inters/recharge'
import { deleteRechargePackages } from '@/api/recharge'
import { PACKAGE_STORE } from '../utils'

interface PackageActionProps {
  row: RechargePackage
  index: number
}

const props = defineProps<PackageActionProps>()
const store = inject(PACKAGE_STORE)!

function openUpdate() {
  const price = +props.row.price

  store.formBase = zRechargePackageForm.parse({
    ...props.row,
    price,
  })

  store.index = props.index
  store.visibleBase = true
}

async function handleDelete() {
  if (!await xconfirm('确定删除该套餐吗？')) return

  deleteRechargePackages([props.row.id]).then(() => {
    store.packages.splice(props.index, 1)
    toast.success('删除成功')
  })
}
</script>

<template>
  <div class="space-x-2">
    <XButton icon="lucide:edit" size="sm" label="编辑" @click="openUpdate" />
    <XButton icon="lucide:trash-2" size="sm" color="danger" label="删除" @click="handleDelete" />
  </div>
</template>
