import { ref } from 'vue'

/**
 * @returns [track, trigger]
 */
export function useForceUpdate() {
  const signal = ref(0)
  return [
    () => signal.value,
    () => {
      signal.value++
    }
  ]
}
