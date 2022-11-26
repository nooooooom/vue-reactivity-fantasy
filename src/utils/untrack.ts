import { ReactiveEffect } from 'vue'

/**
 * Ignores tracking context inside its scope
 * @param fn the scope that is out of the tracking context
 * @returns the return value of `fn`
 */

// Annotations are referenced from SolidJS

export function untrack<T>(fn: () => T): T {
  const effect = new ReactiveEffect(() => fn())
  effect.parent = undefined
  try {
    return effect.run() as T
  } finally {
    effect.stop()
  }
}
