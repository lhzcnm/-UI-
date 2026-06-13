<script setup lang="ts">
import { userApi } from '@/api/user'
import { VALID_TYPE, VALID_TYPE_LIST, VALID_TYPE_MAP } from '../types'
import { PROFILE_STORE } from '../utils'
import { toast } from 'vue-sonner'

const store = inject(PROFILE_STORE)!
const uStore = useUserStore()

const localStore = useLocalStore()

const count = ref<number>(60)
const type = ref<VALID_TYPE>(VALID_TYPE.PHONE)

let timer: number

const displayValidType = computed(() => {
  let res = uStore.info.phone

  if (store.validType === VALID_TYPE.EMAIL) {
    res = uStore.info.email
  }

  return res
})

function startCountdown() {
  timer = window.setInterval(() => {
    count.value--

    if (count.value <= 0) {
      stopTimer()
      store.isGetCode = false
      count.value = 60
    }
  }, 1000)
}

function stopTimer() {
  if (timer) {
    clearInterval(timer)
  }
}

function close() {
  store.visibleUnBind = false
  stopTimer()
  count.value = 60
}

async function handleSendCode() {
  if (!displayValidType.value) {
    return toast.warning(localStore.localData['profile_PromptNoAuth'])
  }

  if (!store.validType) {
    return toast.warning(localStore.localData['profile_PromptMustUnbind'])
  }

  if (store.isGetCode) {
    return toast.warning(localStore.localData['profile_PromptWaitGetCode'].replace('@',count))
  }

  try {
    await userApi.unbindApply({
      target: displayValidType.value,
      type: store.unBindType!,
    })
    
    store.isGetCode = true
    type.value = store.validType
    startCountdown()
  } catch {}
}

async function handleConfirmCode() {
  if (!store.validType) {
    return toast.warning(localStore.localData['profile_PromptMustUnbind'])
  }

  if (!store.code) {
    return toast.warning(localStore.localData['profile_PromptNeedCode	'])
  }

  if (store.validType !== type.value) {
    return toast.warning(localStore.localData['profile_PromptNotPair'])
  }

  if (store.code.length !== 6) {
    return toast.warning(localStore.localData['profile_PromptCodeError'])
  }

  try {
    await userApi.unbindConfirm({
      target: displayValidType.value,
      type: store.unBindType!,
      code: store.code,
    })

    toast.success(localStore.localData['profile_PromptSuccess'])
    setTimeout(() => {
      uStore.logout()
    }, 1500)
  } catch {}
}
</script>

<template>
  <XDialog
    v-model="store.visibleUnBind"
    :title="localStore.localData['profile_UnbindConfirmation']"
    ui-root="sm:p-0"
    ui-header="p-4 border-b"
    @close="close">
    <template #default>
      <form class="p-4 border-b divide-y divide-dashed divide-border" @submit.prevent>
        <div class="flex py-4 pt-0 border-dashed flex-col space-y-2">
          <div class="flex">
            <p class="text-base font-semibold before:content-['*'] before:text-rose-500 before:text-sm">{{ localStore.localData['profile_VertificationType'] }}</p>
          </div>

          <div class="flex items-center space-x-2">
            <label
              v-for="type in VALID_TYPE_LIST"
              :key="type.value"
              class="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="radio"
                name="validType"
                v-model="store.validType"
                :value="type.value"
              />
              <span>{{localStore.localData[type.label] }}</span>
            </label>
          </div>
        </div>

        <div class="flex py-4 border-dashed flex-col space-y-2">
          <div class="flex">
            
            <p class="text-base font-semibold before:content-['*'] before:text-rose-500 before:text-sm">{{ localStore.localData[VALID_TYPE_MAP[store.validType]] }}</p>
          </div>
          <XInput :disabled="true" v-model="displayValidType" />
        </div>

        <div class="flex py-4 border-dashed flex-col space-y-2 pb-0">
          <div class="flex">
            <p class="text-base font-semibold before:content-['*'] before:text-rose-500 before:text-sm">{{ localStore.localData['profile_VertificationCode'] }}</p>
          </div>

          <div class="flex space-x-2">
            <XInput :placeholder="localStore.localData['profile_VertificationCode']" v-model="store.code" />
            <XButton @click="handleSendCode">
              {{ store.isGetCode ? localStore.localData['profile_PlaceholderCountdown'].replace('@',count) : localStore.localData['profile_PlaceholderSendVerty'] }}
            </XButton>
          </div>
        </div>
      </form>
    </template>

    <template #footer>
      <div class="p-4 flex justify-end space-x-2 mt-2">
        <ButtonGroup
          :layouts="['cancel', 'confirm']"
          @cancel="close" @confirm="handleConfirmCode"
        />
      </div>
    </template>
  </XDialog>
</template>
