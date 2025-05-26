<script setup lang="ts">
import UpstreamForm from '@/components/forms/UpstreamForm.vue'
import { createUpstream, updateUpstream } from '@/api/upstream'
import { UPSTREAM_STORE } from '../utils'

const store = inject(UPSTREAM_STORE)!

async function handleCreate() {
  const data = await createUpstream(store.formBase)
  store.upstreams.push(data)
  store.visibleBase = false
}

async function handleUpdate() {
  const upstream = store.upstreams[store.index!]
  const body = { ...store.formBase, apiId: upstream.apiId }
  await updateUpstream(body)

  store.upstreams[store.index!] = { ...upstream, ...body }
  store.visibleBase = false
}
</script>

<template>
  <FormDialog
    v-model="store.visibleBase"
    :index="store.index"
    :update="handleUpdate"
    :create="handleCreate"
  >
    <UpstreamForm v-model="store.formBase" />
  </FormDialog>
</template>
