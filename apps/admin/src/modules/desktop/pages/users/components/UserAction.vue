<script setup lang="ts">
const options = [
  { label: '查看详情', icon: 'lucide:eye' },
  { label: '积分设置', icon: 'lucide:dollar-sign' },
  { label: '积分记录', icon: 'lucide:coins' },
  { label: '支付记录', icon: 'lucide:credit-card' },
  { label: '登录日志', icon: 'lucide:location-edit' },,
  { label: '永久删除', icon: 'lucide:trash-2' },
]
</script>

<template>
  <XButtonSplit
    :options="options"
    size="sm" label="编辑"
  />
</template>
