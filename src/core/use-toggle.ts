import { ref, Ref } from 'vue'

import type { ValueSourceOrRaw } from '../types'
import { resolveSourceValue } from '../utils'
import { ToggleControl, useToggleControl } from './use-toggle-control'
import { useTransformState } from './use-transform-state'

export function useToggle(
  defaultValue?: ValueSourceOrRaw<any>
): [Ref<boolean>, ToggleControl<boolean>]

export function useToggle<T, U>(
  defaultValue: ValueSourceOrRaw<T>,
  reverseValue: ValueSourceOrRaw<U>
): [Ref<T | U>, ToggleControl<T | U>]

export function useToggle<T, U>(
  defaultValue = false as unknown as ValueSourceOrRaw<T>,
  reverseValue?: ValueSourceOrRaw<U>
): [Ref<T | U>, ToggleControl<T | U>] {
  const asBoolean = arguments.length <= 1
  if (asBoolean) {
    reverseValue = !resolveSourceValue(defaultValue) as U
  }

  const transform = asBoolean
    ? (value: any) => Boolean(value)
    : (value: any) => value

  const defaultValueRef = useTransformState<T>(defaultValue, transform)
  const reverseValueRef = useTransformState<U>(reverseValue, transform)

  const stateRef = ref(defaultValueRef.value) as Ref<T | U>

  return [
    stateRef,
    useToggleControl(stateRef, defaultValueRef, reverseValueRef)
  ]
}
