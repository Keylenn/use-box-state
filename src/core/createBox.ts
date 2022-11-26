import Box from './Box'

const BOX_SYMBOL_WRAPPER_REF = Symbol()

export type BoxSymbolRefT = typeof BOX_SYMBOL_WRAPPER_REF

export type WrapperBox<T = any> = {
  [BOX_SYMBOL_WRAPPER_REF]: Box<T>
}

export default function createBox<T extends () => any>(initialDataCreator: T): WrapperBox<ReturnType<T>>
export default function createBox<T>(initialData: T): WrapperBox<T>
export default function createBox(iData: any) {
  const initialData = typeof iData === 'function' ? iData() : iData
  const box = new Box(initialData)

  const boxWrapper = {
    [BOX_SYMBOL_WRAPPER_REF]: box,
  }
  return Object.freeze(boxWrapper)
}

export function _getBox<T extends WrapperBox>(wb: T) {
  return wb[BOX_SYMBOL_WRAPPER_REF]
}
