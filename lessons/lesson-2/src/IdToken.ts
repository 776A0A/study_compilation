import Token from './Token'

export default class IdToken extends Token {
  private text: string

  constructor(line: number, id: string) {
    super(line)
    this.text = id
  }

  override getText() {
    return this.text
  }

  override isIdentifier(): boolean {
    return true
  }
}
