import AstLeaf from './AstLeaf'

export default class NumberLiteral extends AstLeaf {
  get value() {
    return this.token.getNumber()
  }
}
