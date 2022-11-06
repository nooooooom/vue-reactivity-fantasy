import { computed, unref } from 'vue'

import type { ValueSource } from '../types'
import { isFunction } from './is'

export function resolveSourceValue<T>(source: ValueSource<T> | T) {
  return resolveSourceValueGetter(source)()
}

export function resolveSourceValueGetter<T>(source: ValueSource<T> | T) {
  return isFunction(source) ? source : () => unref(source) as T
}

export function resolveComputed<T>(source: ValueSource<T>) {
  return computed(resolveSourceValueGetter(source))
}
