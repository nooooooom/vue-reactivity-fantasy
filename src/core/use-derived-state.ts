import { Ref, ref, UnwrapRef, watch, WatchOptions } from 'vue'

import type { ValueSource } from '../types'

export interface UseDerivedStateOptions<Immediate extends boolean = false>
  extends WatchOptions<Immediate> {}

export type UseDerivedStateReturn<T> = [Ref<T>, () => void]

/**
 * Create a writable Ref whose value changes with the source.
 */
export function useDerivedState<
  Source,
  Initial extends Ref,
  Immediate extends boolean = false
>(
  initialState: Initial,
  source: Source,
  options?: UseDerivedStateOptions<Immediate>
): UseDerivedStateReturn<Source | UnwrapRef<Initial>>

export function useDerivedState<
  Source,
  Initial,
  Immediate extends boolean = false
>(
  initialState: Initial,
  source: ValueSource<Source>,
  options?: UseDerivedStateOptions<Immediate>
): UseDerivedStateReturn<Immediate extends true ? Source : Source | Initial>

export function useDerivedState(
  initialState: any,
  source: any,
  options?: UseDerivedStateOptions
) {
  const stateRef = ref(initialState)

  const stop = watch(
    source,
    (deriviedState) => {
      stateRef.value = deriviedState
    },
    options
  )

  return [stateRef, stop]
}
