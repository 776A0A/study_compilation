import Token from './Token'

export default class StrToken extends Token {
  private literal: string

  constructor(line: number, str: string) {
    super(line)
    this.literal = str
  }

  override getText() {
    return this.literal
  }

  override isString(): boolean {
    return true
  }
}
