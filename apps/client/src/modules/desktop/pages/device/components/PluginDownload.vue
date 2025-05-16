<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="absolute inset-0 z-50 flex items-center justify-center flex-col h-full bg-background">
    <div class="relative -mt-36">
      <div class="absolute inset-0 animate-pulse bg-primary/10 rounded-full blur-xl"></div>
      <div class="relative border-2 border-dashed border-primary/30 rounded-full p-6 bg-background/50 backdrop-blur-sm">
        <Icon icon="lucide:shield-alert" class="text-7xl text-primary" />
      </div>
    </div>
    <div class="mt-12 text-center space-y-4">
      <h2 class="text-2xl font-semibold text-foreground">
        未检测到插件运行
      </h2>
      <p class="text-base text-muted-foreground max-w-md">
        如果插件未运行，请先启动插件，再刷新页面。<br>
        如果插件未安装，请点击下方按钮下载安装插件。
      </p>
      <XButton
        icon="lucide:arrow-down-to-line"
      >
        下载插件
      </XButton>
    </div>
  </div>
</template>
