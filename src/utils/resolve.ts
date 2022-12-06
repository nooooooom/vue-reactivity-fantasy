import { computed, unref } from 'vue'

import type { MaybeValueSource } from '../types'
import { isFunction } from './is'

export function resolveSourceValue<T>(source: MaybeValueSource<T>) {
  return resolveSourceValueGetter(source)()
}

export function resolveSourceValueGetter<T>(source: MaybeValueSource<T>) {
  return isFunction(source) ? source : () => unref(source) as T
}

export function resolveComputed<T>(source: MaybeValueSource<T>) {
  return computed(resolveSourceValueGetter(source))
}
