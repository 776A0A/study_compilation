import Token from './Token'

export default class TokenReader {
  pos = 0
  tokens: Token[]

  constructor(tokens: Token[]) {
    this.tokens = tokens
  }

  peek() {
    if (this.pos < this.tokens.length) return this.tokens[this.pos]
    else return null
  }

  read() {
    if (this.pos < this.tokens.length) return this.tokens[this.pos++]
    else return null
  }

  unread() {
    if (this.pos > 0) this.pos--
  }

  setPos(pos: number) {
    if (pos >= 0 && pos < this.tokens.length) this.pos = pos
  }
}
