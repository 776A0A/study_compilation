import { beforeEach, describe, it, expect } from 'vitest'
import Token from '../Token'
import TokenReader from '../TokenReader'

describe('TokenReader', () => {
  let tokens: Token[]
  let reader: TokenReader

  beforeEach(() => {
    tokens = Array.from({ length: 3 }, (_, i) => new Token(String(i)))
    reader = new TokenReader(tokens)
  })

  it('peek', () => {
    const token = reader.peek()

    expect(token?.text).toBe('0')
    expect(reader.pos === 0)
  })

  it('read', () => {
    const token = reader.read()

    expect(token?.text).toBe('0')
    expect(reader.pos === 1)
  })

  it('unread', () => {
    let token = reader.peek()

    reader.unread()

    expect(reader.pos === 0)

    token = reader.read()

    reader.unread()

    expect(reader.pos === 0)
  })

  it('setPos', () => {
    reader.setPos(1)

    expect(reader.pos === 1)
  })
})
