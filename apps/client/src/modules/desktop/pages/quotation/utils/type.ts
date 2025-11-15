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
  color: string
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
 colors: ActiveType[]
}

interface ActiveType {
  color: string
  prices: {
    Asis: string
    "Asis+": string
    BrandNew: string
    cpo: string
  }
}

// 香港新机接口返回值类型
export interface HKSamSungType {
  id: number
  type: string
  models: ModelsTypeHKSamSung[]
}

interface ModelsTypeHKSamSung {
  remark: string
  memories: MemoriesTypeSamSung[]
}

interface MemoriesTypeSamSung {
 memory: string
 colors: ActiveTypeSamSung[]
}

interface ActiveTypeSamSung {
  color: string
  prices: {
    BrandNew: string
  }
}


