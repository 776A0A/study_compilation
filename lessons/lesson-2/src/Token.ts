import StoneError from './StoneError'

export default class Token {
  static EOF = new Token(-1)
  static EOL = '\\n'

  private lineNumber: number

  protected constructor(line: number) {
    this.lineNumber = line
  }

  getLineNumber() {
    return this.lineNumber
  }

  isIdentifier() {
    return false
  }

  isNumber() {
    return false
  }
  isString() {
    return false
  }

  getNumber() {
    throw new StoneError('not number token')
  }

  getText(): string {
    return ''
  }
}
