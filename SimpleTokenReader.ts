import Token from './Token'
import { TokenReader } from './TokenReader'

export default class SimpleTokenReader implements TokenReader {
  tokens: Token[] = []
  pos = 0

  constructor(tokens: Token[]) {
    this.tokens = tokens
  }

  peek(): Token {
    if (this.pos < this.tokens.length) {
      return this.tokens[this.pos++]
    }
    return null
  }

  read() {
    if (this.pos < this.tokens.length) {
      return this.tokens[this.pos++]
    }
    return null
  }

  unread() {
    if (this.pos > 0) this.pos--
  }

  getPosition() {
    return this.pos
  }

  setPosition(pos: number) {
    if (pos >= 0 && pos < this.tokens.length) this.pos = pos
  }
}
