<script setup lang="ts">
import { twJoin, twMerge } from 'tailwind-merge'
import { TICKET_STATUS, xconfirm } from '@3un/utils'
import { toast } from 'vue-sonner'

import type { Ticket } from '@/inters/ticket'
import { deleteTicket, updateTicket, createTicketReply } from '@/api/ticket'
import { TICKET_STORE } from '../utils'

const store = inject(TICKET_STORE)!

const msg = ref('')
const currentTicket = ref<Ticket>()
const isSolved = ref(false)

watchEffect(() => {
  if (store.index === undefined) {
    currentTicket.value = undefined
    return
  }

  const ticket = store.tickets.list[store.index]
  isSolved.value = ticket.statusId === TICKET_STATUS.SOLVED
  currentTicket.value = ticket
})

function handleSubmit() {
  if (isSolved.value) return
  if (msg.value.trim() === '') {
    toast.warning('不能发送空消息')
    return
  }

  const response = createTicketReply({
    ticketId: currentTicket.value!.id,
    msg: msg.value,
  })

  response.then((data) => {
    store.replies.push(data)
    msg.value = ''
  })
}

function getAvatar(replyId: number | null) {
  if (replyId) return '/images/customer_service_avatar.png'
  if (currentTicket.value && currentTicket.value.headImgUrl) {
    return currentTicket.value.headImgUrl
  }

  const mode = import.meta.env.VITE_APP_MODE
  return `/${mode}/default_avatar.jpg`
}

function isUser(replyId: number | null) {
  return replyId === null
}

async function handleToggle() {
  const playload = {
    id: currentTicket.value!.id,
    statusId: isSolved.value
      ? TICKET_STATUS.PROCESS
      : TICKET_STATUS.SOLVED,
  }

  await updateTicket(playload)
  store.tickets.list[store.index!] = {
    ...currentTicket.value!,
    statusId: playload.statusId,
  }
}

async function handleDelete() {
  if (!await xconfirm('确定删除该工单吗？')) return
  if (currentTicket.value) {
    await deleteTicket([currentTicket.value.id])

    store.tickets.list.splice(store.index!, 1)
    store.tickets.total--
    store.index = undefined
  }
}
</script>

<template>
  <div class="flex-1 bg-card border rounded-lg">
    <NoMessage v-if="!store.replies.length || !currentTicket" />
    <template v-else>
      <section
        :class="twJoin(
          'flex items-center justify-between',
          'border-b border-dashed p-4 pb-3',
        )"
      >
        <h2 class="text-lg font-bold truncate">
          {{ currentTicket.subject }}
        </h2>
        <div class="flex items-center space-x-2">
          <XButton size="sm" variant="outline" @click="handleToggle">
            {{ isSolved ? '重新打开' : '关闭工单' }}
          </XButton>

          <XButton color="danger" size="sm" @click="handleDelete">
            删除工单
          </XButton>
        </div>
      </section>

      <section class="flex flex-col h-[calc(100%-3.625rem)]">
        <div class="flex-1 overflow-y-auto space-y-4 p-4">
          <div
            v-for="reply in store.replies" :key="reply.id" 
            :class="twMerge(
              'flex items-start',
              !isUser(reply.replyId) && 'flex-row-reverse'
            )"
          >
            <img 
              :src="getAvatar(reply.replyId)"
              class="size-8 rounded-full object-cover flex-shrink-0"
              :alt="reply.replyId ? '客服' : '用户'"
              draggable="false"
            />
            <div
              :class="twMerge(
                'max-w-[80%] p-3 mx-3 rounded-lg bg-success/20',
                isUser(reply.replyId) && 'bg-primary/20',
              )"
            >
              <p class="text-sm whitespace-pre-wrap mb-1">{{ reply.msg }}</p>
              <div class="flex items-center justify-end text-xs text-muted-foreground">
                <span>{{ reply.time }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex space-x-2 border-t p-3">
          <textarea
            v-model="msg"
            :class="twMerge(
              'w-full h-full pl-2 text-base sm:text-sm bg-transparent',
              'resize-none focus:outline-none'
            )"
            placeholder="请输入回复内容"
            rows="5"
          />
          <XButton
            label="发送"
            :disabled="isSolved"
            @click="handleSubmit"
          />
        </div>
      </section>
    </template>
  </div>
</template>
