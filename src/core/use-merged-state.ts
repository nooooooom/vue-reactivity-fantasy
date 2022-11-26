import { computed, ComputedRef } from 'vue'

import type { MaybeValueSource } from '../types'
import { resolveSourceValueGetter } from '../utils'

export type MergedState<Value, DefaultValue> = undefined extends Value
  ? undefined extends DefaultValue
    ? Value | DefaultValue
    : DefaultValue
  : Value

/**
 * Use the merged value of two values, its priority is
 * 1. if `source` is not undefined, the value of `source` is used
 * 2. if `source` is undefined, the value of `defaultValue` is used
 */
export function useMergedState<T, U>(
  source: MaybeValueSource<T>,
  defaultValue?: MaybeValueSource<U>
): ComputedRef<MergedState<T, U>> {
  const getValue = resolveSourceValueGetter(source)
  const getDefaultValue = resolveSourceValueGetter(defaultValue)

  const getter = () => {
    const value = getValue()
    return (value === undefined ? getDefaultValue() : value) as MergedState<
      T,
      U
    >
  }

  return computed(getter)
}
