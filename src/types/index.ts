import type { Ref } from 'vue'

export type MaybeRef<T> = T | Ref<T>

export type ValueSource<T = unknown> = Ref<T> | (() => T)
export type MaybeValueSource<T = unknown> = ValueSource<T> | T

export type Dependency<T = unknown> = ValueSource<T> | object
export type DependencyList<T = unknown> = Array<Dependency<T>>

export type InvalidDependency = null | undefined | string | number | boolean

export type ResolveValueSource<T> = T extends ValueSource<infer R> ? R : T

export type ResolveDependencySource<T> = T extends any[]
  ? {
      [K in keyof T]: ResolveDependencySource<T[K]>
    }
  : ResolveValueSource<T>
