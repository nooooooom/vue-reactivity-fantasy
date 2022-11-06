import { ComputedRef, Ref, ref, watch } from 'vue'

import type {
  Dependency,
  DependencyList,
  InvalidDependency,
  ResolveDependencySource,
  ValueSource
} from '../types'
import {
  isValidDependency,
  resolveComputed,
  resolveSourceValueGetter
} from '../utils'

export interface UseMemoOptions {
  deep?: boolean
}

/**
 * `useMemo` will cache the value parsed from the `source` and "trigger" only when the value changes.
 *
 * To cope with multiple scenarios, it has the following logic:
 * 1. If you pass in valid dependency,
 * `useMemo` will only recompute the memoized value when one of the dependencies has changed.
 *
 * 2. If you don't pass in valid dependency,
 * `useMemo` value will depend on the side effects carried by source.
 *
 * 3. If source is a getter function, it can receive changes to dependency.
 */

// overload: array of multiple dependencies,
export function useMemo<T, D extends any[]>(
  source:
    | Exclude<ValueSource<T>, Function>
    | ((
        dependency: ResolveDependencySource<D>,
        lastDependency: ResolveDependencySource<D> | undefined
      ) => T),
  dependencies: [...D],
  options?: UseMemoOptions
): ComputedRef<T>

// overload: single or multiple dependencies
export function useMemo<T, D extends Dependency | DependencyList>(
  source:
    | Exclude<ValueSource<T>, Function>
    | ((
        dependency: ResolveDependencySource<D>,
        lastDependency: ResolveDependencySource<D> | undefined
      ) => T),
  dependency: D,
  options?: UseMemoOptions
): ComputedRef<T>

// overload: no valid dependency, watch source change
export function useMemo<T>(
  source: ValueSource<T>,
  dependency?: InvalidDependency
): ComputedRef<T>

// implementation
export function useMemo<T, D extends Dependency | DependencyList>(
  source: any,
  dependency?: D,
  options?: UseMemoOptions
): ComputedRef<T> {
  const stateRef = ref() as Ref<T>
  const getter = resolveSourceValueGetter(source as ValueSource<T>)

  if (isValidDependency(dependency)) {
    watch(
      dependency,
      (dependency, lastDependency) => {
        const currentState = (getter as any)(dependency, lastDependency)
        if (!Object.is(stateRef.value, currentState)) {
          stateRef.value = currentState
        }
      },
      {
        ...options,
        immediate: true
      }
    )
  } else {
    watch(
      getter,
      (currentValue) => {
        stateRef.value = currentValue
      },
      {
        immediate: true
      }
    )
  }

  return resolveComputed(stateRef)
}
