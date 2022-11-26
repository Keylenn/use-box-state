import type {WrapperBox, BoxSymbolRefT} from './createBox'

export {WrapperBox}
export type BoxDataT<T extends WrapperBox> = ReturnType<T[BoxSymbolRefT]['get']>
export type SetStateAction<S> = (next: S | ((prevState: S) => S)) => void
export type MapStateFn<T extends WrapperBox> = (data: BoxDataT<T>) => any

export type AnyArr = any[]
