<script setup lang="ts">
import { tv } from 'tailwind-variants'

import { getMenus, getTools } from '@/utils/sidebar'

const menus = getMenus()
const tools = getTools()

const style = tv({
  slots: {
    base: [
      'w-sidebar h-screen flex flex-col',
      'bg-card/80 backdrop-blur',
      'border-r border-border',
      'shadow-sm'
    ],
    section: 'flex-1 overflow-y-auto',
    header: 'h-14 flex items-center px-4 text-lg font-semibold',
    nav: 'overflow-y-auto px-2 py-3 space-y-1',
  },
})

const b = style()
</script>

<template>
  <aside :class="b.base()">
    <!-- <div :class="b.header()">
      <span>竞标平台</span>
    </div> -->

    <section :class="b.section()">
      <nav :class="b.nav()">
        <SidebarItem v-for="menu in menus"
          :key="menu.route"
          :menu="menu" />
      </nav>
  
      <hr class="w-full h-px bg-border" />

      <nav :class="b.nav()">
        <ToolItem
          v-for="(tool, index) in tools"
          :key="index"
          :tool="tool" />
      </nav>
    </section>
  </aside>
</template>
