import { printComposable } from "./functions"
import { printVariants } from "./variants"

export default function usePrinter() {
  return {
    ...printVariants(),
    ...printComposable(),
  }
}
