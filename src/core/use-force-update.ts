import { ref } from 'vue'

/**
 * @returns [track, trigger]
 */
export function useForceUpdate(): [() => number, () => void] {
  const signal = ref(0)
  return [
    () => signal.value,
    () => {
      signal.value++
    }
  ]
}
