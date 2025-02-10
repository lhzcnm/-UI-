import { defineStore } from 'pinia'

enum SubmitStatus {
  WAIT = 'WAIT',
  SUBMITING = 'SUBMITING',
  FINISH = 'FINISH',
}

export const useSubmitStore = defineStore('submitStore', () => {
  const status = ref(SubmitStatus.WAIT)
  

  return {
    status,
  }
})
