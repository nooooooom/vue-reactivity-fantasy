import { ref, Ref, shallowRef, ShallowRef } from 'vue'

import { resolveSourceValue } from '../utils/resolve'
import type { MaybeValueSource } from '../types'

export function useState<T, Shallow extends Readonly<boolean> = false>(
  initialValue: MaybeValueSource<T>,
  shallow?: Shallow
): [Shallow extends true ? ShallowRef<T> : Ref<T>, (value: T) => void] {
  const createRef = shallow ? shallowRef : ref
  const state = createRef<any>(resolveSourceValue(initialValue))
  return [
    state,
    (value) => {
      state.value = value
    }
  ]
}
