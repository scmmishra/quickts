import { greet } from '../src'

describe('greet', () => {
  it('Greets Hello World', () => {
    expect(greet()).toEqual('Hello World')
  })
})
