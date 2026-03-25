import { type DefaultVersion, type PluginInfo } from "@/types/plugin"
import axios from "axios"

export async function getPluginInfo() {
  const { data } = await axios.get<PluginInfo>(
    "http://localhost:9999/plugin",
    {
      headers: { "x-token": Date.now().toString(16), },
      timeout: 3000,
    }
  )

  return data
}

export async function checkPluginVersion(version: string) {
  const { data } = await axios.get<DefaultVersion>("/data/version.json")
  const { latest } = data
  return version < latest
}
