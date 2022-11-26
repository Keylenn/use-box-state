import * as React from 'react'
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect'
import isShallowArrayEqual from './isShallowArrayEqual'
import {_getBox} from './createBox'
import type {WrapperBox, SetStateAction, MapStateFn, BoxDataT} from './type'

export default function useBoxState<T extends WrapperBox>(wb: T): [BoxDataT<T>, SetStateAction<BoxDataT<T>>]
export default function useBoxState<T extends WrapperBox, M extends MapStateFn<T>>(
  box: T,
  mapStateFn: M,
): [ReturnType<M>, SetStateAction<BoxDataT<T>>]
export default function useBoxState(wb: WrapperBox, mapStateFn?: any) {
  const [, forceRender] = React.useReducer(s => s + 1, 0)
  const box = _getBox(wb)
  const setState = useSetBoxState(wb)
  const getCurState = () => mapStateFn?.(box.get()) ?? box.get()

  const getDeps = (): any[] => {
    const state = getCurState()
    return Object.prototype.toString.call(state) === '[object Object]' ? Object.values(state) : [state]
  }

  const depsRef = React.useRef(getDeps())

  useIsomorphicLayoutEffect(() => {
    const listener = () => {
      // 浅比较依赖
      const newDeps = getDeps()
      if (!isShallowArrayEqual(depsRef.current, newDeps)) forceRender()
      depsRef.current = newDeps
    }
    box.add(listener)
    return () => {
      box.remove(listener)
    }
  }, [])

  return [getCurState(), setState] as const
}

export function useSetBoxState<T extends WrapperBox>(wb: T): SetStateAction<BoxDataT<T>> {
  const box = _getBox(wb)
  const setState = (next: any) => {
    const nextData = typeof next === 'function' ? next(box.get()) : next
    box.set(nextData)
    box.notify()
    return nextData
  }
  return setState
}
