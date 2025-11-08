import http from "@/utils/http";

export class quoteApi{
  //华强北
  static async getHuaQiangBei() {
    const { data } = await http.get('/hqb/list')
    return data
  }
  static async HuaQiangBeiSearch() {
    const { data } = await http.get('/hqb/select')
    return data
  }

  //飞扬
  static async GetFeiYang() {
    const { data } = await http.get('/feiyang/list')
    return data
  }
  static async FeiYang() {
    const { data } = await http.get('/feiyang/select')
    return data
  }

  //香港新机
  static async GetHongKongNew() {
    const { data } = await http.get('/hk/list/iphone')
    return data
  }
  static async HongKongNew() {
    const { data } = await http.get('/hk/select/iphone')
    return data
  }


  //三星
  static async GetSanXin() {
    const { data } = await http.get('/hk/list/samsung')
    return data
  }
  static async SanXin() {
    const { data } = await http.get('/hk/select/samsung')
    return data
  }

}

//免费次数接口
export async function freeGenerate(){
  const { data } = await http.post('/feiyang/pay')
  return data
}

//免费次数不足就扣除积分接口
export async function deductPoints() {
  const { data } = await http.post('/feiyang/payCredit')
  return data
}