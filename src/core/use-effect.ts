import { watch, watchEffect, WatchOptions } from 'vue'
import type {
  Dependency,
  DependencyList,
  InvalidDependency,
  ResolveDependencySource
} from '../types'
import { Cleanup, OnCleanup, SetupEffect, createManualEffect, isValidDependency } from '../utils'

export type SetupEffectWithDependency<V, LV> = (
  onCleanup: OnCleanup,
  dependency: V,
  lastDependency: LV
) => void | Cleanup

export type EffectDependency<T = unknown> = Dependency<T> | DependencyList<T>

export type StopEffect = () => void

export interface UseEffectOptions<Immediate extends boolean = false>
  extends WatchOptions<Immediate> {}

/**
 * Accepts a function that contains imperative, possibly effectful code.
 *
 * To cope with multiple scenarios, it has the following logic:
 * 1. If you pass in valid dependency,
 * `setup` will only rerun when one of the dependencies has changed.
 *
 * 2. If you don't pass in valid dependency,
 * `setup` will rerun on the side effects carried by setup.
 *
 * 3. If source is a getter function, it can receive changes to dependency.
 */

// overload: array of multiple dependencies,
// TODO: There is no better way to distinguish reactive array and dependencies array from the type.
export function useEffect<T extends DependencyList, Immediate extends Readonly<boolean> = false>(
  setup: SetupEffectWithDependency<
    ResolveDependencySource<T>,
    ResolveDependencySource<Immediate extends true ? T | undefined : T>
  >,
  dependencies: [...T],
  options?: UseEffectOptions<Immediate>
): StopEffect

// overload: single or multiple dependency
export function useEffect<T extends EffectDependency, Immediate extends Readonly<boolean> = false>(
  setup: SetupEffectWithDependency<
    ResolveDependencySource<T>,
    ResolveDependencySource<Immediate extends true ? T | undefined : T>
  >,
  dependency: T,
  options?: UseEffectOptions<Immediate>
): StopEffect

// overload: no valid dependencies, watch setup effect
export function useEffect<T extends InvalidDependency>(
  setup: SetupEffect,
  dependency?: T,
  options?: Omit<UseEffectOptions, 'immediate'>
): StopEffect

// implementation
export function useEffect<T, Immediate extends Readonly<boolean> = false>(
  setup: any,
  dependency?: T,
  options?: UseEffectOptions<Immediate>
): StopEffect {
  const control = createManualEffect()

  if (isValidDependency(dependency)) {
    return watch(
      dependency,
      (dependency, lastDependency, onCleanup) => {
        control.reset((onCleanup) => setup(onCleanup, dependency, lastDependency))
        onCleanup(control.clear)
      },
      options
    )
  }

  return watchEffect(
    (onCleanup) => {
      control.reset((onCleanup) => setup(onCleanup))
      onCleanup(control.clear)
    },
    {
      ...options,
      immediate: undefined
    } as any
  )
}
