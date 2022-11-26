import { ReactiveEffect } from 'vue'

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
  let parent: ReactiveEffect | undefined
  let scheduled = false
  const effect = new ReactiveEffect(
    () => {
      parent = effect.parent
      return fn()
    },
    () => {
      if (scheduled) {
        return
      }
      scheduled = true
      scheduler(() => {
        if (effect.active && parent) {
          if (parent.scheduler) {
            parent.scheduler()
          } else {
            parent.run()
          }
        }
        scheduled = false
      })
    }
  )
  return effect.run() as T
}
