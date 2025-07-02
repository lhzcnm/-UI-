<script setup lang="ts">

</script>

<template>
  <div>
    <TheToolbar>
      <template #right>
        <XSimplePagination :total="100" />
      </template>

      <template #extra>
        <XButton icon="lucide:filter" label="筛选" />
        <XButton icon="lucide:plus" label="添加用户" />
      </template>
    </TheToolbar>

    <section>

    </section>
  </div>
</template>
