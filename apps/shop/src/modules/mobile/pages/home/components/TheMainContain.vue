<script setup lang="ts">
const services = [
  {
    title: "IMEI / SN 查询",
    desc: "支持苹果、谷歌等多设备的验机查询。",
  },
  {
    title: "设备解锁服务",
    desc: "激活锁、ID锁、谷歌锁等服务。",
  },
  {
    title: "AI 图片识别",
    desc: "上传标签图片自动识别 IMEI。",
  },
]
</script>

<template>
  <section class="w-full px-4 py-6 space-y-8">

    <!-- 顶部介绍 -->
    <div class="text-center">
      <h1 class="text-xl font-bold">设备查询解锁服务平台</h1>
      <p class="text-gray-600 mt-2 text-sm">
        支持大规模批量查询与 API 接口
      </p>
    </div>

    <!-- 服务卡片 -->
    <div class="grid grid-cols-1 gap-4">
      <div
        v-for="item in services"
        :key="item.title"
        class="p-4 rounded-xl bg-gray-50 border shadow-sm"
      >
        <h3 class="font-semibold">{{ item.title }}</h3>
        <p class="text-gray-600 text-sm mt-1 leading-relaxed">
          {{ item.desc }}
        </p>
      </div>
    </div>

    <!-- API / 批量能力 -->
    <div>
      <h2 class="text-lg font-bold">批量查询能力</h2>

      <ul class="text-sm text-gray-600 mt-3 space-y-2 list-disc pl-5">
        <li>XLSX / CSV / TXT 批量导入</li>
        <li>高并发查询引擎</li>
        <li>标准化 API 接口</li>
      </ul>
    </div>

    <!-- 平台优势 -->
    <div>
      <h2 class="text-lg font-bold">平台优势</h2>

      <ul class="text-sm text-gray-600 mt-3 space-y-2 list-disc pl-5">
        <li>订单快速处理</li>
        <li>实时推送至客服系统</li>
        <li>稳定可靠，长期运行</li>
      </ul>
    </div>

  </section>
</template>
