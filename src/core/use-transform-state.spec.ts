import { nextTick, ref } from 'vue'

import { useTransformState } from './use-transform-state'

describe('use-transform-state', () => {
  it('Basic', async () => {
    const source = ref(0)
    const double = useTransformState(source, (value: number) => value * 2)

    expect(double.value).toBe(0)

    source.value = 1
    await nextTick()
    expect(double.value).toBe(2)
  })
})
