<script setup lang="ts">
const services = [
  {
    title: "IMEI / SN 设备查询",
    desc: "支持苹果、谷歌、等多种设备的信息查询。",
  },
  {
    title: "设备解锁服务",
    desc: "提供激活锁查询、ID锁解锁、谷歌锁解锁等热门服务。",
  },
  {
    title: "AI 图片识别",
    desc: "微信公众号支持上传设备标签图片自动识别 IMEI。",
  },
]
</script>

<template>
  <section class="middle-section w-full flex justify-center py-24 px-4">
    <div class="max-w-[1200px] w-full flex flex-col items-center text-center space-y-12">

      <div>
        <h2 class="text-4xl font-bold text-gray-900">我们的服务</h2>
        <p class="text-gray-600 mt-3">
          为用户提供快速、精准、安全的电子设备查询与解锁服务
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full mt-8">
        <div v-for="item in services" :key="item.title" class="service-card text-left">
          <h4 class="text-xl font-semibold mb-2">{{ item.title }}</h4>
          <p class="text-gray-600">{{ item.desc }}</p>
        </div>
      </div>

      <div>
        <h2 class="text-4xl font-bold text-gray-900">高效批量查询与 API 能力</h2>
        <p class="text-gray-600 mt-3">
          我们的系统支持大规模批量查询，满足企业用户和开发者的多样化需求
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full mt-8">
        <div class="service-card text-left">
          <h4 class="text-xl font-semibold mb-2">多格式文件批量导入</h4>
          <p class="text-gray-600">
            支持 XLSX / CSV / TXT 等格式文件直接上传，一次性处理大量 IMEI 或序列号数据。
          </p>
        </div>

        <div class="service-card text-left">
          <h4 class="text-xl font-semibold mb-2">高并发查询引擎</h4>
          <p class="text-gray-600">
            内置高性能任务队列与并发控制，实现快速、稳定、可持续的大规模批量查询处理。
          </p>
        </div>

        <div class="service-card text-left">
          <h4 class="text-xl font-semibold mb-2">标准化 API 接口</h4>
          <p class="text-gray-600">
            提供 HTTP API 供服务器集成，支持自动化查询、批量任务推送及结果回调。
          </p>
        </div>
      </div>

      <div>
        <h2 class="text-4xl font-bold text-gray-900">服务平台优势</h2>
        <p class="text-gray-600 mt-3">
          我们的系统经过长期打磨，为用户提供稳定、快速、即时响应的服务体验
        </p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full mt-8">
        <div class="service-card text-left">
          <h4 class="text-xl font-semibold mb-2">订单快速处理</h4>
          <p class="text-gray-600">
            平台针对查询与解锁服务做了深度优化，大量订单也能在短时间内完成处理。
          </p>
        </div>

        <div class="service-card text-left">
          <h4 class="text-xl font-semibold mb-2">实时结果推送客服</h4>
          <p class="text-gray-600">
            每个订单在后台处理完成后，会自动推送至客服系统，方便及时响应用户需求。
          </p>
        </div>

        <div class="service-card text-left">
          <h4 class="text-xl font-semibold mb-2">稳定可靠的后台系统</h4>
          <p class="text-gray-600">
            系统长期运行稳定，支持持续监控、异常自检与恢复机制，为用户提供流畅服务。
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
