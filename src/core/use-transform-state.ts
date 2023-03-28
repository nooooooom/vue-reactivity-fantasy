import { computed, ComputedRef } from 'vue'
import type { MaybeValueSource } from '../types'
import { resolveSourceValueGetter } from '../utils'

/**
 * Resolve the source value, and convert it through a transform function.
 */
export function useTransformState<T, Source>(
  source: MaybeValueSource<Source>,
  transform: (source: Source) => T
): ComputedRef<T> {
  const getter = resolveSourceValueGetter(source)

  return computed(() => transform(getter()))
}
