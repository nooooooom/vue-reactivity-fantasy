import { ref, Ref, shallowRef, ShallowRef } from 'vue'

import { resolveSourceValue } from '../utils/resolve'
import type { ValueSourceOrRaw } from '../types'

export function useState<T, Shallow extends Readonly<boolean> = false>(
  initialValue: ValueSourceOrRaw<T>,
  shallow?: Shallow
): [Shallow extends true ? ShallowRef<T> : Ref<T>, (value: T) => void] {
  const createRef = shallow ? shallowRef : ref
  const stateRef = createRef<any>(resolveSourceValue(initialValue))
  return [
    stateRef,
    (value) => {
      stateRef.value = value
    }
  ]
}
