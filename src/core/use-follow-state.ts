import { ref, Ref, unref } from 'vue'

import type { ValueSource } from '../types'
import { isWritableRef } from '../utils'
import { useEffect } from './use-effect'

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

  const stopFollow = useEffect(
    (_, target) => {
      stateRef.value = target
      options?.onFollow?.()
    },
    target,
    options
  )

  return [stateRef as Ref<T>, stopFollow]
}
