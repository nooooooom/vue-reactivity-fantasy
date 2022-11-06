import { Ref, ref, unref } from 'vue'

import type { MaybeRef } from '../types'
import { isWritableRef } from '../utils'
import { useToggleControl } from './use-toggle-control'

export interface UseBooleanControl {
  set: (value: boolean) => void
  setTrue: () => void
  setFalse: () => void
  toggle: () => void
}

export function useBoolean(
  initialValue: MaybeRef<boolean> = false
): [Ref<boolean>, UseBooleanControl] {
  const stateRef = isWritableRef(initialValue)
    ? initialValue
    : ref(!!unref(initialValue))

  const toggleControl = useToggleControl(
    stateRef,
    () => true,
    () => false
  )

  return [
    stateRef,
    {
      set: toggleControl.set,
      setTrue: toggleControl.setDefault,
      setFalse: toggleControl.setReverse,
      toggle: toggleControl.toggle
    }
  ]
}
