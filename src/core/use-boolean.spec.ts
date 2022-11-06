import { useBoolean } from './use-boolean'

describe('use-boolean', () => {
  it('Basic', () => {
    const [state, control] = useBoolean()
    expect(state.value).toBe(false)
    control.setFalse()
    expect(state.value).toBe(false)
    control.setTrue()
    expect(state.value).toBe(true)
    control.toggle()
    expect(state.value).toBe(false)
  })
})
