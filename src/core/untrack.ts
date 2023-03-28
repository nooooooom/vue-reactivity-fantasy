import { computed } from 'vue'
import { isVue2 } from 'vue-module-demi'

/**
 * Ignores tracking context inside its scope
 * @param fn the scope that is out of the tracking context
 * @returns the return value of `fn`
 */

// Annotations are referenced from SolidJS

export function untrack<T>(fn: () => T): T {
  const reactiveScope = computed(() => fn())
  const reactiveEffect = <any>reactiveScope.effect

  if (isVue2) {
    reactiveEffect.teardown()
    return reactiveEffect.get()
  } else {
    const result = reactiveScope.value
    reactiveEffect.stop()
    return result
  }
}
