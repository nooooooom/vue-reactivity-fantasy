import { computed } from 'vue'

import { useForceUpdate } from 'src/core'
import { batch } from 'src/utils/batch'

describe('batch', () => {
  it('Basic', async () => {
    const [track, trigger] = useForceUpdate()

    let i = 0
    const foo = computed(() => {
      batch(() => {
        track()
      })
      return i++
    })

    const bar = computed(() => foo.value)

    expect(bar.value).toBe(0)

    new Array(10).fill(undefined).forEach(() => {
      trigger()
      expect(bar.value).toBe(0)
    })

    for (let index = 0; index < 10; index++) {
      new Array(10).fill(undefined).forEach(() => {
        trigger()
      })

      const current = i

      await new Promise((resolve) => setTimeout(resolve))
      expect(bar.value).toBe(current)
    }
  })
})
