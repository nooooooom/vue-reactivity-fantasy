import { Ref, ref, unref } from 'vue'

import type { MaybeRef } from '../types'
import { createToggleControl, isWritableRef } from '../utils'

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

  const toggleControl = createToggleControl(
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
