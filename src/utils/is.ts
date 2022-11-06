import { isReactive, isReadonly, isRef, Ref, UnwrapRef } from 'vue'

import type { DependencyList, Dependency } from '../types'

export function isWritableRef<T = unknown>(v: unknown): v is Ref<UnwrapRef<T>> {
  return isRef(v) && !isReadonly(v)
}

export function isValidDependency<T = unknown>(
  dep: unknown
): dep is Dependency<T> | DependencyList<T> {
  return (
    isRef(dep) ||
    isReactive(dep) ||
    isFunction(dep) ||
    (isArray(dep) && dep.every(isValidDependency))
  )
}

export const isArray = Array.isArray

export function isFunction(val: unknown): val is Function {
  return typeof val === 'function'
}
