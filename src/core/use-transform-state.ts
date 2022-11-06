import { computed, ComputedRef } from 'vue'

import type { ValueSource } from '../types'
import { resolveSourceValueGetter } from '../utils/resolve'

/**
 * Resolve the source value, and convert it through a transform function.
 */
export function useTransformState<Result, Source = any>(
  source: ValueSource<Source> | Source,
  transform: (input: Source) => Result
): ComputedRef<Result> {
  const getter = resolveSourceValueGetter(source)
  return computed(() => transform(getter()))
}
