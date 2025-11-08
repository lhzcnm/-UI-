/**华强北接口返回值类型 */
export interface HuaQiangBeiType {
  model: string
  models: ModelsType[]
}

interface ModelsType {
  remark: string
  prices: PricesType[]
}

interface PricesType {
  memory: string
  list: ListType[]
}

interface ListType {
  color: number
  prices: {
    primary: string
    secondary: string
  }
}

//飞扬接口返回值类型
export interface FeiYangType {
  remark: string
  type: string
  models: ModelsTypeFY[]
}

interface ModelsTypeFY {
  memory: string
  prices: {
    bigFlower: string
    good: string
    new: string
    smallFlower: string
  }
}

// 香港新机接口返回值类型 // 三星同返回值类型
export interface HKNewType {
  id: number
  type: string
  models: ModelsTypeHKNew[]
}

interface ModelsTypeHKNew {
  remark: string
  memories: MemoriesType[]
}

interface MemoriesType {
 memory: string
 active: ActiveType[]
 inactive: ActiveType[]
}

interface ActiveType {
  color: number
  prices: {
    primary: string
    secondary: string
    source: string
  }
}


