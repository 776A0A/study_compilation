import AstLeaf from './AstLeaf'

export default class Name extends AstLeaf {
  get name() {
    return this.token.getText()
  }
}
