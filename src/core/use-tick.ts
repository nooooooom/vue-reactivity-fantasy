import { ref } from 'vue'

/**
 * Simplest tick.
 * 
 * @returns [Track, Trigger]
 */
export function useTick() {
  const tickRef = ref(0)
  return [
    () => tickRef.value,
    () => {
      tickRef.value++
    }
  ]
}
