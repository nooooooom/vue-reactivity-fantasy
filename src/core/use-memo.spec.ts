import { nextTick, ref, watch } from 'vue'

import { useMemo } from './use-memo'

// Because `useMemo` is based on Vue.watch,
// we only need to test the processing logic of different parameters

describe('use-memo', () => {
  it('Non-dependency', async () => {
    const foo = ref(0)
    const bar = ref(0)

    const memo = useMemo(() => {
      foo.value
      return bar.value
    })

    const spy = vi.fn()
    watch(memo, spy)

    for (let i = 0; i < 7; i++) {
      foo.value++
      await nextTick()
      expect(spy).toBeCalledTimes(0)
    }

    bar.value++
    await nextTick()
    expect(spy).toBeCalledTimes(1)
  })

  it('Single dependency', async () => {
    const foo = ref(0)
    const bar = ref(0)

    const memo = useMemo((bar) => {
      foo.value
      return bar
    }, bar)

    const spy = vi.fn()
    watch(memo, spy)

    for (let i = 0; i < 7; i++) {
      foo.value++
      await nextTick()
      expect(spy).toBeCalledTimes(0)
    }

    bar.value++
    await nextTick()
    expect(spy).toBeCalledTimes(1)
  })

  it('Multiple dependencies', async () => {
    const foo = ref(0)
    const bar = ref(0)

    const memo = useMemo(
      ([foo, bar]) => {
        return bar
      },
      [foo, bar]
    )

    const spy = vi.fn()
    watch(memo, spy)

    for (let i = 0; i < 7; i++) {
      foo.value++
      await nextTick()
      expect(spy).toBeCalledTimes(0)
    }

    bar.value++
    await nextTick()
    expect(spy).toBeCalledTimes(1)
  })
})
