import Token from '../Token'
import AstTree from './AstTree'

export default class AstLeaf extends AstTree {
  protected _token: Token

  constructor(token: Token) {
    super()
    this._token = token
  }

  numChildren(): number {
    return 0
  }

  child(): AstTree | null {
    return null
  }

  override toString() {
    return this._token.getText()
  }

  location(): string {
    return `at line ${this._token.getLineNumber()}`
  }

  get token() {
    return this._token
  }
}
