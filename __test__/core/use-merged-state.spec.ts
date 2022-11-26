import { ref } from 'vue'

import { useMergedState } from 'src/core/use-merged-state'

describe('use-merged-state', () => {
  it('Basic', () => {
    const source = ref<number>()
    const defaultValue = ref(1)
    const merged = useMergedState(source, defaultValue)

    expect(merged.value).toBe(1)

    defaultValue.value = 2
    expect(merged.value).toBe(2)

    source.value = 3
    expect(merged.value).toBe(3)

    defaultValue.value = 4
    expect(merged.value).toBe(3)
  })
})
