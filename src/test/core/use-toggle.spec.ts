import { useToggle } from 'src/core/use-toggle'

describe('use-toggle', () => {
  it('As boolean when no reverse value', () => {
    const [state, control] = useToggle()
    expect(state.value).toBe(false)
    control.setReverse()
    expect(state.value).toBe(true)
    control.setDefault()
    expect(state.value).toBe(false)
    control.toggle()
    expect(state.value).toBe(true)
  })

  it('Has reverse value', () => {
    const [state, control] = useToggle('Hello', 'World')
    expect(state.value).toBe('Hello')
    control.setReverse()
    expect(state.value).toBe('World')
    control.toggle()
    expect(state.value).toBe('Hello')
  })
})
