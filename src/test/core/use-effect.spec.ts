import { nextTick, ref } from 'vue'

import { useEffect } from 'src/core/use-effect'

// Because `useEffect` is based on Vue.watch,
// we only need to test the processing logic of different parameters

describe('use-effect', () => {
  it('Non-dependency', async () => {
    const foo = ref(0)

    const spy = vi.fn()
    useEffect(() => {
      foo.value
      spy()
    })

    foo.value++
    await nextTick()
    expect(spy).toBeCalledTimes(2)
  })

  it('Single dependency', async () => {
    const foo = ref(0)

    const spy = vi.fn()
    useEffect((_, fooValue) => {
      expect(fooValue).toBe(foo.value)
      spy()
    }, foo)

    foo.value++
    await nextTick()
    expect(spy).toBeCalledTimes(1)
  })

  it('Multiple dependencies', async () => {
    const foo = ref(0)

    const spy = vi.fn()
    useEffect(
      (_, [fooValue]) => {
        expect(fooValue).toBe(foo.value)
        spy()
      },
      [foo]
    )

    foo.value++
    await nextTick()
    expect(spy).toBeCalledTimes(1)
  })

  it('OnCleanup', async () => {
    const foo = ref(0)

    useEffect(
      (OnCleanup, [fooValue]) => {
        OnCleanup(() => {
          expect(fooValue + 1).toBe(foo.value)
        })
      },
      [foo]
    )

    useEffect(
      (_, [fooValue]) =>
        () => {
          expect(fooValue + 1).toBe(foo.value)
        },
      [foo]
    )

    foo.value++
  })

  it('OnCleanup with Non-dependency', async () => {
    const foo = ref(0)

    useEffect((OnCleanup) => {
      const fooValue = foo.value
      OnCleanup(() => {
        expect(fooValue + 1).toBe(foo.value)
      })
    })

    foo.value++
  })

  it('OnCleanup with Non-dependency', async () => {
    const foo = ref(0)

    useEffect((OnCleanup) => {
      const fooValue = foo.value
      OnCleanup(() => {
        expect(fooValue + 1).toBe(foo.value)
      })
    })

    useEffect(() => {
      const fooValue = foo.value
      return () => {
        expect(fooValue + 1).toBe(foo.value)
      }
    })

    foo.value++
  })

  it('Stop', async () => {
    const foo = ref(0)

    const spy = vi.fn()
    const stop = useEffect(() => {
      spy()
    }, [foo])

    foo.value++
    await nextTick()
    expect(spy).toBeCalledTimes(1)

    stop()

    foo.value++
    await nextTick()
    expect(spy).toBeCalledTimes(1)
  })
})
