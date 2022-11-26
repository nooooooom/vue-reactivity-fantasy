import { computed, ComputedRef } from 'vue'

import type { MaybeValueSource } from '../types'
import { resolveSourceValueGetter } from '../utils/resolve'
import { untrack } from '../utils/untrack'

/**
 * Resolve the source value, and convert it through a transform function.
 */
export function useTransformState<T, Source>(
  source: MaybeValueSource<Source>,
  transform: (source: Source) => T,
  trackTransform: boolean = true
): ComputedRef<T> {
  const getter = resolveSourceValueGetter(source)

  return computed(() => {
    const value = getter()

    if (trackTransform) {
      return transform(value)
    }

    return untrack(() => transform(value))
  })
}
