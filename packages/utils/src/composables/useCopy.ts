import { klona } from 'klona/json'

export function useCopy<T>(obj: T) {
  return () => klona(obj)
}
