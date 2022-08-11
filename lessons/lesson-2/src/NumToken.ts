import Token from './Token'

export default class NumToken extends Token {
  private value: number

  constructor(line: number, int: number) {
    super(line)
    this.value = int
  }

  override getText() {
    return this.value.toString()
  }

  override isNumber(): boolean {
    return true
  }

  override getNumber() {
    return this.value
  }
}
