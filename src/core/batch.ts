import { computed, ComputedRef, effectScope } from 'vue'
import { isVue2 } from 'vue-module-demi'

import { useForceUpdate } from '../core'
import { untrack } from './untrack'

const tick = /*#__PURE__*/ Promise.resolve()
const queue: any[] = []
let queued = false

const scheduler = (fn: any) => {
  queue.push(fn)
  if (!queued) {
    queued = true
    tick.then(flush)
  }
}

const flush = () => {
  for (let i = 0; i < queue.length; i++) {
    queue[i]()
  }
  queue.length = 0
  queued = false
}

/**
 * Holds changes inside the block before the reactive context is updated
 * @param fn wraps the reactive updates that should be batched
 * @returns the return value from `fn`
 */

// Annotations are referenced from SolidJS

export function batch<T>(fn: () => T): T {
  const reactiveScope = computed(() => fn()) as ComputedRef<T> & { _scheduled: boolean }
  const reactiveEffect = <any>reactiveScope.effect

  let scheduled = false

  if (isVue2) {
    const [track, trigger] = useForceUpdate()
    let value: T
    untrack(() => {
      const scope = effectScope(true)
      scope.run(() => {
        value = reactiveScope.value
        if (scheduled) {
          return
        }
        scheduler(() => {
          trigger()
          scheduled = false
        })
        scheduled = false
      })
    })
    track()
    return value!
  } else {
    const originScheduler = reactiveEffect.scheduler
    reactiveEffect.scheduler = () => {
      if (scheduled) {
        return
      }
      scheduler(() => {
        if (reactiveEffect.active) {
          if (originScheduler) {
            originScheduler()
          } else {
            reactiveEffect.run()
          }
        }
        scheduled = false
      })
      scheduled = false
    }
  }

  return reactiveScope.value
}
