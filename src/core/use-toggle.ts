import { ref, Ref } from 'vue'
import type { MaybeValueSource } from '../types'
import { createToggleControl, resolveSourceValue, ToggleControl } from '../utils'
import { useTransformState } from './use-transform-state'

export function useToggle(
  defaultValue?: MaybeValueSource<any>
): [Ref<boolean>, ToggleControl<boolean>]

export function useToggle<T, U>(
  defaultValue: MaybeValueSource<T>,
  reverseValue: MaybeValueSource<U>
): [Ref<T | U>, ToggleControl<T | U>]

export function useToggle<T, U>(
  defaultValue = false as unknown as MaybeValueSource<T>,
  reverseValue?: MaybeValueSource<U>
): [Ref<T | U>, ToggleControl<T | U>] {
  const asBoolean = arguments.length <= 1
  if (asBoolean && reverseValue === undefined) {
    reverseValue = !resolveSourceValue(defaultValue) as U
  }

  const transform = asBoolean ? (value: any) => Boolean(value) : (value: any) => value
  const defaultValueRef = useTransformState(defaultValue, transform)
  const reverseValueRef = useTransformState(reverseValue, transform)

  const stateRef = ref(defaultValueRef.value) as Ref<T | U>

  return [stateRef, createToggleControl(stateRef, defaultValueRef, reverseValueRef)]
}
