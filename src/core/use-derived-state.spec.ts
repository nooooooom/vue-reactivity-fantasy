import { nextTick, ref } from 'vue'

import { useDerivedState } from './use-derived-state'

describe('use-derived-state', () => {
  it('Basic', async () => {
    const source = ref(0)
    const [state] = useDerivedState(null, source)

    expect(state.value).toBe(null)

    source.value = 1
    await nextTick()
    expect(state.value).toBe(1)

    state.value = 2
    await nextTick()
    expect(state.value).toBe(2)
  })

  it('Immediate', async () => {
    const source = ref(0)
    const [state] = useDerivedState(null, () => source.value, {
      immediate: true
    })

    expect(state.value).toBe(0)
  })

  it('Stop derivation', async () => {
    const source = ref(0)
    const [state, stop] = useDerivedState(null, source)

    source.value = 1
    await nextTick()
    expect(state.value).toBe(1)

    stop()

    source.value = 2
    await nextTick()
    expect(state.value).toBe(1)
  })
})
