import { TokenType } from './TokenType'

export default class Token {
  text = ''
  type: TokenType | null = null

  getText() {
    return this.text
  }
}
