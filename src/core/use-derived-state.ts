import { Ref, ref, UnwrapRef, watch, WatchOptions } from 'vue'

import type { ValueSource } from '../types'

export interface UseDerivedStateOptions<Immediate extends boolean = false>
  extends WatchOptions<Immediate> {}

export type UseDerivedStateReturn<T> = [Ref<T>, () => void]

/**
 * Create a writable Ref whose value changes with the source.
 */

// overload: bind the derived state to ref
export function useDerivedState<T>(
  initialState: Ref<T>,
  source: ValueSource<T>,
  options?: UseDerivedStateOptions<boolean>
): UseDerivedStateReturn<T>

// overload: if Immediate is false, the derived state may be initial value or source
export function useDerivedState<T, Initial>(
  initialState: Initial,
  source: ValueSource<T>,
  options?: UseDerivedStateOptions<false>
): UseDerivedStateReturn<Initial extends Ref ? UnwrapRef<Initial> : T | UnwrapRef<Initial>>

// overload: if Immediate is true, initial value is always overwritten
export function useDerivedState<T, Initial>(
  initialState: Initial,
  source: ValueSource<T>,
  options?: UseDerivedStateOptions<true>
): UseDerivedStateReturn<Initial extends Ref ? UnwrapRef<Initial> : T>

// implementation
export function useDerivedState<T, Initial = any, Immediate extends Readonly<boolean> = false>(
  initialState: Initial,
  source: ValueSource<T>,
  options?: UseDerivedStateOptions<Immediate>
): UseDerivedStateReturn<T> {
  const stateRef = ref(initialState) as Ref<any>

  const stop = watch(
    source,
    (deriviedState) => {
      stateRef.value = deriviedState
    },
    options
  )

  return [stateRef, stop]
}
