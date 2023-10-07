import { computed, ComputedRef, DebuggerOptions, UnwrapRef, WritableComputedRef } from 'vue'
import type { ValueSource } from '../types'
import { isFunction, resolveSourceValueGetter } from '../utils'

export function useComputed<T>(source: ValueSource<T>): ComputedRef<UnwrapRef<T>>

export function useComputed<T>(
  source: ValueSource<T>,
  setter: (value: T) => void
): WritableComputedRef<UnwrapRef<T>>

export function useComputed<T>(
  source: ValueSource<T>,
  debugOptions: DebuggerOptions
): ComputedRef<UnwrapRef<T>>

export function useComputed<T>(
  source: ValueSource<T>,
  setter?: ((value: T) => void) | DebuggerOptions,
  debugOptions?: DebuggerOptions
) {
  const getter = resolveSourceValueGetter(source)
  const options = typeof setter === 'object' ? setter : debugOptions

  return isFunction(setter)
    ? computed(
        {
          get: getter,
          set: setter
        },
        options
      )
    : computed(getter, options)
}
