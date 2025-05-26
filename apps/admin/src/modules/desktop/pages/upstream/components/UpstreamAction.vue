<script setup lang="ts">
import { zUpstreamForm, type Upstream } from '@/inters/upstream'
import { UPSTREAM_STORE } from '../utils'

interface UpstreamActionProps {
  row: Upstream
  index: number
}

const props = defineProps<UpstreamActionProps>()
const store = inject(UPSTREAM_STORE)!

function openUpdate() {
  store.formBase = zUpstreamForm.parse(props.row)
  const idx = store.upstreams
    .findIndex(u => u.apiId === props.row.apiId)
  store.index = idx
  store.visibleBase = true
}
</script>

<template>
  <XButton icon="lucide:edit" label="编辑" size="sm" @click="openUpdate" />
</template>
