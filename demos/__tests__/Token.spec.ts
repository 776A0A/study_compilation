import { describe, expect, it } from 'vitest'
import Token from '../Token'
import { TokenType } from '../types'

describe('Token', () => {
  it('正确的 token 结构', () => {
    const token = new Token()
    token.text = 'test'
    token.type = TokenType.Identifier

    expect(token).toEqual({ text: 'test', type: TokenType.Identifier })
  })
})
