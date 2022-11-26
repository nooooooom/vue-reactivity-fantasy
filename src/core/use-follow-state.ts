import { ref, Ref, unref, watch } from 'vue'

import type { ValueSource } from '../types'
import { isWritableRef } from '../utils'

export interface UseFollowStateOptions {
  immediate?: boolean
  deep?: boolean
  onFollow?: () => void
}

export function useFollowState<T>(
  initialValue: T | Ref<T>,
  target: ValueSource<T>,
  options?: UseFollowStateOptions
): [Ref<T>, () => void] {
  const stateRef = isWritableRef(initialValue) ? initialValue : ref(unref(initialValue))

  const stopFollow = watch(
    target,
    (target) => {
      stateRef.value = target
      options?.onFollow?.()
    },
    options
  )

  return [stateRef as Ref<T>, stopFollow]
}
