import type {AnyArr} from './type'

export default function isShallowArrayEqual(arr1: AnyArr, arr2: AnyArr): boolean {
  if (arr1 === arr2) {
    return true
  }

  if (arr1.length !== arr2.length) return false

  for (const idx in arr1) {
    if (!Object.is(arr1[idx], arr2[idx])) return false
  }

  return true
}
