import type { ComputedRef } from 'vue'
import type { ValueSource } from '../types'
import { useMemo } from './use-memo'
import { useTransformState } from './use-transform-state'

export function useDerivedState<T, Props>(
  props: ValueSource<Props>,
  getDerivedStateFromProps: (props: Props, prevState: T | undefined) => T
): ComputedRef<T> {
  let prevState: T | undefined

  return useMemo(
    useTransformState(props, (props) => (prevState = getDerivedStateFromProps(props, prevState)))
  )
}
