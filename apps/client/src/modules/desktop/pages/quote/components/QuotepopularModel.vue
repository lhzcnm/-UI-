<script setup lang="ts">
const scrollBox = ref<HTMLDivElement | null>(null)

//鼠标拖动横向滚动
function scrollX() {
   const el = scrollBox.value
  if (!el) return

  let isDown = false
  let startX = 0
  let scrollLeft = 0

  const mouseDownHandler = (e: MouseEvent) => {
    isDown = true
    el.classList.add('active')
    startX = e.pageX - el.offsetLeft
    scrollLeft = el.scrollLeft
  }

  const mouseLeaveHandler = () => {
    isDown = false
  }

  const mouseUpHandler = () => {
    isDown = false
  }

  const mouseMoveHandler = (e: MouseEvent) => {
    if (!isDown) return
    e.preventDefault()
    const x = e.pageX - el.offsetLeft
    const walk = (x - startX) * 1.5 // 控制滚动速度
    el.scrollLeft = scrollLeft - walk
  }

  el.addEventListener('mousedown', mouseDownHandler)
  el.addEventListener('mouseleave', mouseLeaveHandler)
  el.addEventListener('mouseup', mouseUpHandler)
  el.addEventListener('mousemove', mouseMoveHandler)

  // ✅ 组件卸载时移除事件监听
  onBeforeUnmount(() => {
    el.removeEventListener('mousedown', mouseDownHandler)
    el.removeEventListener('mouseleave', mouseLeaveHandler)
    el.removeEventListener('mouseup', mouseUpHandler)
    el.removeEventListener('mousemove', mouseMoveHandler)
  })
}

onMounted(() => {
 scrollX()
})
</script>

<template>
  <section
    class="relative px-2 mx-auto my-4 w-full rounded-3xl bg-gradient-to-br from-white/90 to-gray-100/60 dark:from-black/90 dark:to-black/50 shadow-md border border-white/40 backdrop-blur-md overflow-hidden">
      
    <div class="absolute inset-0 bg-gradient-to-tr from-sky-100/40 via-purple-100/30 to-pink-100/30 blur-3xl opacity-50"></div>
      
    <div class="relative text-center py-4">
      <h2
        class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 drop-shadow-sm">
        ··· 高人气机型 ···
      </h2>
      <div class="mx-auto mt-2 w-24 h-[2px] bg-gradient-to-r from-transparent via-gray-300/70 to-transparent rounded-full"></div>
    </div>
  
    <!-- ✅ overflow-x-auto 放这里 -->
    <div
      ref="scrollBox"
      class="relative w-full overflow-x-auto scroll-smooth pb-8 touch-pan-x">
      
      <!-- ✅ grid 要加 w-max 让内容撑开 -->
      <div class="grid grid-rows-2 grid-flow-col gap-2 auto-cols-[10rem] w-max">
        <div
          v-for="(item, index) in 100"
          :key="index"
          class="group relative flex flex-col items-center justify-center cursor-pointer select-none rounded-3xl
                 border border-white/60 bg-gradient-to-br from-white/60 via-gray-100/40 to-white/10
                 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)]
                 hover:shadow-[0_8px_25px_-4px_rgba(0,0,0,0.15)]
                 hover:-translate-y-[4px] hover:scale-[1.03]
                 transition-all duration-500 ease-[cubic-bezier(.25,.8,.25,1)]
                 backdrop-blur-2xl overflow-hidden"
          style="height: 6.5rem;"
        >
          <div
            class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700
                   bg-gradient-to-br from-sky-400/30 via-purple-300/25 to-pink-300/20 blur-2xl"></div>
          
          <div
            class="absolute inset-0 rounded-3xl ring-1 ring-transparent
                   group-hover:ring-[3px] group-hover:ring-sky-400/50
                   transition-all duration-500 ease-out"></div>
          
          <div
            class="relative z-10 text-[0.95rem] sm:text-base font-semibold text-gray-700 tracking-wide
                   group-hover:text-sky-600 transition-colors duration-300 italic">
            陈子健{{ item }}
          </div>
          
          <div
            class="absolute bottom-0 left-0 right-0 h-[2px]
                   bg-gradient-to-r from-transparent via-sky-400/50 to-transparent
                   opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div
            class="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors duration-500 rounded-3xl"></div>
        </div>
      </div>
    </div>
  </section>

</template>