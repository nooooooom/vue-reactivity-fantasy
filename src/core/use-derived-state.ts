import type { ComputedRef } from 'vue'
import type { ValueSource } from '../types'
import { useTransformState } from './use-transform-state'

export function useDerivedState<T, Props>(
  props: ValueSource<Props>,
  getDerivedStateFromProps: (props: Props, prevState: T | undefined) => T
): ComputedRef<T> {
  let prevState: T | undefined
  return useTransformState(props, props => {
    return (prevState = getDerivedStateFromProps(props, prevState))
  })
}
