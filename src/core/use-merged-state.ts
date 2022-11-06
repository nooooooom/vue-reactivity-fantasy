import { computed, ComputedRef, Ref, WritableComputedRef } from 'vue'

import type { ValueSourceOrRaw } from '../types'
import { isFunction, isWritableRef, resolveSourceValueGetter } from '../utils'

export type MergedState<Main, Candidate> = Candidate extends undefined
  ? Main | Candidate | undefined
  : Candidate extends undefined
  ? undefined
  : Candidate

/**
 * Use the merged value of two values, its priority is
 * 1. if `source` is not undefined, the value of `source` is used
 * 2. if `source` is undefined, the value of `defaultValue` is used
 *
 * If `source` is a writable ref, the value set to the return value will be the value set to `source`,
 * you can also pass in a custom `setter`.
 */
export function useMergedState<T, U>(
  source: Ref<T>,
  defaultValue?: ValueSourceOrRaw<U>,
  setter?: (value: MergedState<T, U>) => void
): WritableComputedRef<MergedState<T, U>>

export function useMergedState<T, U, S extends (value: MergedState<T, U>) => void>(
  source: ValueSourceOrRaw<T>,
  defaultValue: ValueSourceOrRaw<U>,
  setter: S
): WritableComputedRef<MergedState<T, U>>

export function useMergedState<T, U, S extends (value: MergedState<T, U>) => void>(
  source: Exclude<ValueSourceOrRaw<T>, Ref>,
  defaultValue: ValueSourceOrRaw<U>
): ComputedRef<MergedState<T, U>>

export function useMergedState<T, U>(
  source: ValueSourceOrRaw<T>,
  defaultValue?: ValueSourceOrRaw<U>,
  setter?: (value: MergedState<T, U>) => void
) {
  setter =
    setter ??
    (isWritableRef(source)
      ? (value: MergedState<T, U>) => ((source as any).value = value)
      : undefined)

  const getSource = resolveSourceValueGetter(source)
  const getDefaultValue = resolveSourceValueGetter(defaultValue)

  const getter = () => {
    const source = getSource()
    return (source === undefined ? getDefaultValue() : source) as MergedState<T, U>
  }

  if (isFunction(setter)) {
    return computed({
      get: getter,
      set: setter
    })
  }

  return computed(getter)
}
