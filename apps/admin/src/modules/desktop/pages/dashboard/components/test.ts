import dayjs from 'dayjs'

export interface OrderStatItem {
  total: number
  failure: number
  success: number
  dataTime: string
}

const rawData: OrderStatItem[] = [
  {
      "total": 18,
      "success": 18,
      "failure": 0,
      "dataTime": "2025-06-29 22:44:00"
  },
  {
      "total": 17,
      "success": 17,
      "failure": 0,
      "dataTime": "2025-06-29 22:45:00"
  },
  {
      "total": 15,
      "success": 15,
      "failure": 0,
      "dataTime": "2025-06-29 22:46:00"
  }
]

console.log(handleDisplayData(rawData.splice(-3)))

function handleDisplayData(data: OrderStatItem[]) {
  const result: OrderStatItem[] = []
  const lastItem = data[data.length - 1]
  const format = 'YYYY-MM-DD HH:mm:ss'

  for (let i = 0; i < data.length - 1; i++) {
    const nextItem = data[i + 1] || lastItem
    const item = data[i]

    const itemTime = dayjs(item.dataTime)
    const totalRate = (nextItem.total - item.total) / 60
    const successRate = (nextItem.success - item.success) / 60
    const failureRate = (nextItem.failure - item.failure) / 60

    result.push(item)

    for (let j = 5; j < 60; j += 5) {
      const currentTime = itemTime.add(j, 'second')

      result.push({
        dataTime: currentTime.format(format),
        total: Math.round(item.total + totalRate * j),
        success: Math.round(item.success + successRate * j),
        failure: Math.round(item.failure + failureRate * j),
      })
    }
  }

  return result
}
