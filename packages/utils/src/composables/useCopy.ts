import { klona } from 'klona/json'

export function useCopy<T>(params: T) {
  return () => klona(params)
}

export function useCopyFn<T extends (...args: any[]) => any>(params: T): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>) => klona(params(...args))
}
