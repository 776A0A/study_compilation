import { TokenType } from './types/TokenType'

export default class Token {
  text = ''
  type: TokenType | null = null

  getText() {
    return this.text
  }

  getType() {
    return this.type
  }
}
