import { computed } from 'vue'

import { useForceUpdate } from 'src/core'
import { untrack } from 'src/utils/untrack'

describe('untrack', () => {
  it('Basic', () => {
    const [track, trigger] = useForceUpdate()

    let i = 0
    let tick = 0
    const foo = computed(() => {
      tick = untrack(() => {
        track()
        return i
      })
      return i++
    })

    expect(foo.value).toBe(0)
    expect(tick).toBe(0)

    new Array(10).fill(undefined).forEach(() => {
      trigger()
      expect(foo.value).toBe(0)
      expect(tick).toBe(0)
    })
  })
})
