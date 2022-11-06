import { computed, nextTick, ref, watch } from 'vue'

import { useState } from './use-state'

describe('use-state', () => {
  it('Basic', () => {
    expect(useState(7)[0].value).toBe(7)
    expect(useState(ref(7))[0].value).toBe(7)
    expect(useState(computed(() => 7))[0].value).toBe(7)
    expect(useState(() => 7)[0].value).toBe(7)

    const fn = () => 7
    expect(useState(() => fn)[0].value).toBe(fn)
  })

  it('Shallow', async () => {
    const [obj] = useState({
      a: 0
    })
    const spy = vi.fn()
    watch(obj, spy, { deep: true })
    obj.value.a = 1
    await nextTick()
    expect(spy).toBeCalledTimes(1)

    const [shallowObj] = useState(
      {
        a: 0
      },
      true
    )
    const shallowSpa = vi.fn()
    watch(shallowObj, shallowSpa, { deep: true })
    shallowObj.value.a = 1
    await nextTick()
    expect(shallowSpa).toBeCalledTimes(0)
  })
})
