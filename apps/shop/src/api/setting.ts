import { zSettiing, type Setting } from "@/inters/setting"
import http from "@/utils/http"

export async function getSetting(): Promise<Setting> {
  const { data } = await http.get('settings')
  return zSettiing.parse(data)
}