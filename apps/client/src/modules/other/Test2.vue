<script setup lang="ts">
const selected1 = ref('1')
const selected2 = ref('1')
const search = ref('')
</script>

<template>
  <div class="m-12 p-6 border">
    <section class="flex items-center justify-between h-12 border-b border-dashed mb-6">
      <h1 class="text-2xl font-mono font-bold">@3un/ui</h1>
      <TheTheme />
    </section>

    <section class="space-y-3 mb-12">
      <h2 class="text-xl font-mono font-bold">Input & Textarea</h2>
      <div class="space-y-2">
        <XInput placeholder="Input" />
        <XTextarea placeholder="Textarea" />
      </div>
    </section>

    <section class="space-y-3 mb-12">
      <h2 class="text-xl font-mono font-bold">Tag</h2>
      <div class="flex gap-2">
        <XTag label="Tag" color="blue" />
        <XTag label="Tag" color="emerald" />
        <XTag label="Tag" color="rose" />
        <XTag label="Tag" color="zinc" />
      </div>
      <div class="flex gap-2">
        <XTag size="sm" label="Tag" color="blue" />
        <XTag size="sm" label="Tag" color="emerald" />
        <XTag size="sm" label="Tag" color="rose" />
        <XTag size="sm" label="Tag" color="zinc" />
      </div>
    </section>

    <section class="space-y-3 mb-12">
      <h2 class="text-xl font-mono font-bold">Switch</h2>
      <div class="flex gap-2">
        <XSwitch />
        <XSwitch label="启用注册功能" />
      </div>
    </section>

    <section class="space-y-3 mb-12">
      <h2 class="text-xl font-mono font-bold">Select</h2>
      <div class="flex gap-2">
        <XSelect v-model="selected1">
          <XSelectItem value="1" label="Option 1" />
          <XSelectItem value="2" label="Option 2" />
          <XSelectItem value="3" label="Option 3" />
        </XSelect>

        <XSelect
          v-model="selected2"
          v-model:input="search"
          filterable
        >
          <XSelectItem value="1">Option 1</XSelectItem>
          <XSelectItem value="2">Option 2</XSelectItem>
          <XSelectItem value="3">Option 3</XSelectItem>
        </XSelect>
      </div>
    </section>
  </div>
</template>
