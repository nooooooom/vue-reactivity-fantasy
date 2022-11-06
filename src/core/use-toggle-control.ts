import type { Ref } from 'vue'

import type { ValueSource } from '../types'
import { resolveSourceValueGetter } from '../utils/resolve'

export interface ToggleControl<T> {
  set: (value: T) => void
  setDefault: () => void
  setReverse: () => void
  toggle: () => void
}

/**
 * A development pattern used to reduce the focus on how default value and reverse value provide.
 */
export function useToggleControl<T, U>(
  value: Ref<T | U>,
  defaultValue: ValueSource<T>,
  reverseValue: ValueSource<U>
): ToggleControl<T | U> & { value: Ref<T | U> } {
  const getDefaultValue = resolveSourceValueGetter(defaultValue)
  const getReverseValue = resolveSourceValueGetter(reverseValue)
  return {
    value,
    set: (newValue) => (value.value = newValue),
    setDefault: () => (value.value = getDefaultValue()),
    setReverse: () => (value.value = getReverseValue()),
    toggle: () => {
      const defaultValue = getDefaultValue()
      value.value =
        value.value === defaultValue ? getReverseValue() : defaultValue
    }
  }
}
