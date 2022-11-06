import { computed, ref } from 'vue'

import { useMergedState } from './use-merged-state'

describe('use-merged-state', () => {
  it('Basic', () => {
    const source = ref<number>()
    const defaultValue = ref(1)
    const merged = useMergedState(source, defaultValue)

    expect(merged.value).toBe(1)

    source.value = 2
    expect(merged.value).toBe(2)
  })

  it('Non-setter', () => {
    const source = computed(() => 0)
    const merged = useMergedState(source)

    const spy = vi.fn()

    const rawWarn = console.warn
    console.warn = spy
    merged.value = 1
    expect(spy).toHaveBeenCalled()
    console.warn = rawWarn
  })

  it('Custom setter', async () => {
    const source = ref<number>()
    const defaultValue = ref(1)

    const merged = useMergedState(source, defaultValue, () => {
      source.value = 2
    })

    merged.value = 1

    expect(source.value).toBe(2)
    expect(merged.value).toBe(2)
  })
})
