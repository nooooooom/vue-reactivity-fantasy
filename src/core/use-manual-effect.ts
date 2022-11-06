import { isFunction } from '../utils'

export type Cleanup = () => void

export type OnCleanup = (cleanup: Cleanup) => void

export type SetupEffect = (onCleanup: OnCleanup) => void | Cleanup

export interface UseManaualEffectControl {
  clear: () => void
  ensure: () => void
  reset: (setup?: SetupEffect) => void
}

export function useManualEffect(
  setup?: SetupEffect,
  immediate = false
): UseManaualEffectControl {
  let state: number = 0

  let cleanup: Cleanup | undefined
  const onCleanup = (fn: Cleanup) => {
    cleanup = fn
  }

  const clear = () => {
    isFunction(cleanup) && cleanup()
    cleanup = undefined
    state = 0
  }

  const doSetup = () => {
    if (isFunction(setup)) {
      const returnSetup = setup(onCleanup)
      if (!isFunction(cleanup) && isFunction(returnSetup)) {
        cleanup = returnSetup
      }
      state++
    }
  }

  const ensure = () => {
    if (!state) {
      doSetup()
    }
  }

  const reset = (overrideSetup?: SetupEffect) => {
    if (isFunction(overrideSetup)) {
      setup = overrideSetup
    }
    clear()
    doSetup()
  }

  if (immediate) {
    doSetup()
  }

  return {
    clear,
    ensure,
    reset
  }
}
